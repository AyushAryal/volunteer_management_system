import { useEffect, useRef } from 'react';

import L, { LatLngBounds, Map as LeafletMap } from 'leaflet';
import { TileLayer, MapContainer } from 'react-leaflet';
import { useHookstate } from '@hookstate/core';

import { storeState } from '@models/store.ts';
import { IncidentFilter, JobFilter, ProgramFilter, get_incident_list, get_job_list, get_program_list } from '@api/incident.ts';

import { FederalBodyPolygons } from '@components/map/FederalPolygons.tsx';
import { Sidebar } from '@components/sidebar/Sidebar';
import { LoadingDisplay } from '@components/map/LoadingDisplay';
import { get_id } from '@api/utils';
import { IncidentMarkers } from './IncidentMarkers';
import { BoundingBox } from '@models/geojson';
import { MapControls } from '@components/map/MapControls';


export function VmsMap() {
    const store = useHookstate(storeState);
    const mapRef = useRef<LeafletMap>(null);

    useEffect(() => {
        let networkRequest = async () => {
            let selectedProvince = store.mapControls.selectedProvince.get();
            let selectedDistrict = store.mapControls.selectedDistrict.get();
            let selectedMunicipality = store.mapControls.selectedMunicipality.get();
            let selectedWard = store.mapControls.selectedWard.get();

            let startDate = store.mapControls.startDate.get();
            let startDateRepr: string | undefined = undefined;
            if (startDate) {
                startDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60 * 1000));
                startDateRepr = startDate.toISOString().split('T')[0];
            }

            let endDate = store.mapControls.endDate.get();
            let endDateRepr: string | undefined = undefined;
            if (endDate) {
                endDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60 * 1000));
                endDateRepr = endDate.toISOString().split('T')[0];
            }
            let province = selectedProvince ? get_id(selectedProvince) : undefined;
            let district = selectedDistrict ? get_id(selectedDistrict) : undefined;
            let municipality = selectedMunicipality ? get_id(selectedMunicipality) : undefined;
            let ward = selectedWard ? get_id(selectedWard) : undefined;
            let incident_query: IncidentFilter = {
                province, district, municipality, ward,
                date_before: endDateRepr,
                date_after: startDateRepr,
            };
            store.loaded.incidentList.set(false);
            get_incident_list(incident_query).then((incidentList) => {
                store.incidentList.set(incidentList);
                store.loaded.incidentList.set(true);
            });

            let program_query: ProgramFilter = {
                province, district, municipality, ward,
                date_before: endDateRepr,
                date_after: startDateRepr,
            };
            store.loaded.programList.set(false);
            get_program_list(program_query).then((programList) => {
                store.programList.set(programList);
                store.loaded.programList.set(true);
            });

            let job_query: JobFilter = {
                province, district, municipality, ward,
                end_date_before: endDateRepr,
                end_date_after: startDateRepr,
            };
            store.loaded.jobList.set(false);
            get_job_list(job_query).then((jobList) => {
                store.jobList.set(jobList);
                store.loaded.jobList.set(true);
            });
        }
        networkRequest();
    }, [
        store.mapControls.selectedDistrict,
        store.mapControls.selectedMunicipality,
        store.mapControls.selectedProvince,
        store.mapControls.startDate,
        store.mapControls.endDate,
    ]);

    useEffect(() => {
        let bbox: BoundingBox = [26, 80, 31, 89];
        if (store.mapControls.selectedWard.get() !== null) {
            let ward = store.wardList.get().find((body) => body.url == store.mapControls.selectedWard.get());
            bbox = ward?.bbox as BoundingBox ?? bbox;
        } else if (store.mapControls.selectedMunicipality.get() !== null) {
            let municipality = store.municipalityList.get().find((body) => body.url == store.mapControls.selectedMunicipality.get());
            bbox = municipality?.bbox as BoundingBox ?? bbox;
        } else if (store.mapControls.selectedDistrict.get() !== null) {
            let district = store.districtList.get().find((body) => body.url == store.mapControls.selectedDistrict.get());
            bbox = district?.bbox as BoundingBox ?? bbox;
        } else if (store.mapControls.selectedProvince.get() !== null) {
            let province = store.provinceList.get().find((body) => body.url == store.mapControls.selectedProvince.get());
            bbox = province?.bbox as BoundingBox ?? bbox;
        }
        let bounds = new LatLngBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
        mapRef.current?.flyToBounds(bounds, { duration: 0.5 });
    }, [
        store.mapControls.selectedProvince,
        store.mapControls.selectedDistrict,
        store.mapControls.selectedMunicipality,
        store.mapControls.selectedWard,
    ]);

    return (
        <section className="w-full h-screen mx-auto flex">
            <div className="flex flex-row align-items-stretch" style={{ width: "100vw", height: "100vh" }}>
                <Sidebar mapRef={mapRef} />
                <MapContainer
                    bounds={new LatLngBounds([[26, 80], [31, 89]])}
                    style={{ width: "100%", height: "100%" }}
                    ref={mapRef}
                    preferCanvas={true}
                    renderer={L.canvas()}
                >
                    <TileLayer
                        url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <FederalBodyPolygons />
                    <IncidentMarkers />
                    <div style={{ position: "absolute", right: "0.5rem", top: "0.5rem" }}>
                        <div className="leaflet-control flex flex-row align-items-start" style={{ gap: "1rem" }}>
                            <MapControls />
                        </div>
                    </div>
                </MapContainer>
            </div>
            <LoadingDisplay />
        </section>
    );
}
