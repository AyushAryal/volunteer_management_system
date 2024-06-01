import { useEffect, useRef } from 'react';

import L, { LatLngBounds, Map as LeafletMap } from 'leaflet';
import { TileLayer, MapContainer } from 'react-leaflet';
import { useHookstate } from '@hookstate/core';

import { TimePeriod, storeState } from '@models/store.ts';
import { IncidentFilter, JobFilter, ProgramFilter, StatisticsFilter, get_incident_list, get_job_list, get_program_list, get_statistics } from '@api/incident.ts';

import { FederalBodyPolygons } from '@components/map/FederalPolygons.tsx';
import { Sidebar } from '@components/map/sidebar/Sidebar';
import { LoadingDisplay } from '@components/map/LoadingDisplay';
import { get_id } from '@api/utils';
import { IncidentMarkers } from './IncidentMarkers';
import { BoundingBox } from '@models/geojson';
import { MapControls } from '@components/map/MapControls';


export function VmsMap() {
    let mapControls = useHookstate(storeState.mapControls);

    let statistics = useHookstate(storeState.statistics);
    let incidentList = useHookstate(storeState.incidentList);
    let programList = useHookstate(storeState.programList);
    let jobList = useHookstate(storeState.jobList);

    let provinceList = useHookstate(storeState.provinceList);
    let districtList = useHookstate(storeState.districtList);
    let municipalityList = useHookstate(storeState.municipalityList);
    let wardList = useHookstate(storeState.wardList);

    let statisticsLoaded = useHookstate(storeState.loaded.statistics);
    let incidentListLoaded = useHookstate(storeState.loaded.incidentList);
    let programListLoaded = useHookstate(storeState.loaded.programList);
    let jobListLoaded = useHookstate(storeState.loaded.jobList);

    const mapRef = useRef<LeafletMap>(null);

    useEffect(() => {
        let networkRequest = async () => {
            let selectedProvince = mapControls.selectedProvince.get();
            let selectedDistrict = mapControls.selectedDistrict.get();
            let selectedMunicipality = mapControls.selectedMunicipality.get();
            let selectedWard = mapControls.selectedWard.get();

            let startDate = mapControls.startDate.get();
            let startDateRepr: string | undefined = undefined;
            if (startDate) {
                startDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60 * 1000));
                startDateRepr = startDate.toISOString().split('T')[0];
            }

            let endDate = mapControls.endDate.get();
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
            incidentListLoaded.set(false);
            get_incident_list(incident_query).then((list) => {
                incidentList.set(list);
                incidentListLoaded.set(true);
            });

            let program_query: ProgramFilter = {
                province, district, municipality, ward,
                date_before: endDateRepr,
                date_after: startDateRepr,
            };

            programListLoaded.set(false);
            get_program_list(program_query).then((list) => {
                programList.set(list);
                programListLoaded.set(true);
            });

            let job_query: JobFilter = {
                province, district, municipality, ward,
                end_date_before: mapControls.timePeriod.get() == TimePeriod.Custom ? endDateRepr : undefined,
                end_date_after: startDateRepr,
            };
            jobListLoaded.set(false);
            get_job_list(job_query).then((list) => {
                jobList.set(list);
                jobListLoaded.set(true);
            });

            let statistics_query: StatisticsFilter = {
                province, district, municipality, ward,
                date_before: endDateRepr,
                date_after: startDateRepr,
            };
            statisticsLoaded.set(false);
            get_statistics(statistics_query).then((result) => {
                statistics.set(result);
                statisticsLoaded.set(true);
            });
        }
        networkRequest();
    }, [
        mapControls.selectedWard,
        mapControls.selectedDistrict,
        mapControls.selectedMunicipality,
        mapControls.selectedProvince,
        mapControls.startDate,
        mapControls.endDate,
        mapControls.timePeriod,
    ]);

    useEffect(() => {
        let bbox: BoundingBox = [26, 80, 31, 89];
        if (mapControls.selectedWard.get() !== null) {
            let ward = wardList.get().find((body) => body.url == mapControls.selectedWard.get());
            bbox = ward?.bbox as BoundingBox ?? bbox;
        } else if (mapControls.selectedMunicipality.get() !== null) {
            let municipality = municipalityList.get().find((body) => body.url == mapControls.selectedMunicipality.get());
            bbox = municipality?.bbox as BoundingBox ?? bbox;
        } else if (mapControls.selectedDistrict.get() !== null) {
            let district = districtList.get().find((body) => body.url == mapControls.selectedDistrict.get());
            bbox = district?.bbox as BoundingBox ?? bbox;
        } else if (mapControls.selectedProvince.get() !== null) {
            let province = provinceList.get().find((body) => body.url == mapControls.selectedProvince.get());
            bbox = province?.bbox as BoundingBox ?? bbox;
        }
        let bounds = new LatLngBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
        mapRef.current?.flyToBounds(bounds, { duration: 0.5 });
    }, [
        mapControls.selectedProvince,
        mapControls.selectedDistrict,
        mapControls.selectedMunicipality,
        mapControls.selectedWard,
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
                        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
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
