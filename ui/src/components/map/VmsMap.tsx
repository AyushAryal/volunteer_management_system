import { useEffect, useRef } from 'react';

import L, { LatLngBounds, Map as LeafletMap } from 'leaflet';
import { TileLayer, MapContainer } from 'react-leaflet';
import { useHookstate } from '@hookstate/core';

import { storeState } from '@models/store.ts';
import { IncidentFilter, JobFilter, ProgramFilter, get_incident_list, get_job_list, get_program_list, get_volunteer_profile } from '@api/incident.ts';
import { get_district_brief_list, get_municipality_brief_list, get_province_brief_list } from '@api/federal';

import { FederalBodyPolygons } from '@components/map/FederalPolygons.tsx';
import { FederalSelector } from '@components/map/FederalSelector';
import { Sidebar } from '@components/sidebar/Sidebar';
import { FederalPolygonsSelector } from '@components/map/FederalPolygonsSelector';
import { LoadingDisplay } from '@components/map/LoadingDisplay';
import { TimeFilter } from '@components/map/TimeFilter';
import { get_id } from '@api/utils';
import { IncidentMarkers } from './IncidentMarkers';


export function VmsMap() {
    const store = useHookstate(storeState);
    const mapRef = useRef<LeafletMap>(null);

    useEffect(() => {
        let networkRequest = async () => {
            store.loaded.provinceList.set(false);
            let provinceList = await get_province_brief_list();
            storeState.provinceList.set(provinceList);
            store.loaded.provinceList.set(true);

            store.loaded.districtList.set(false);
            let districtList = await get_district_brief_list();
            storeState.districtList.set(districtList);
            store.loaded.districtList.set(true);

            store.loaded.municipalityList.set(false);
            let municipalityList = await get_municipality_brief_list();
            storeState.municipalityList.set(municipalityList);
            store.loaded.municipalityList.set(true);
        }
        networkRequest();
    }, []);

    useEffect(() => {
        let networkRequest = async () => {
            if (store.volunteerProfile.get() === null) {
                await get_volunteer_profile().then((volunteer) => {
                    store.volunteerProfile.set(volunteer);
                });
            }
        }
        networkRequest();
    }, [store.volunteerProfile]);

    useEffect(() => {
        let networkRequest = async () => {
            let selectedProvince = store.mapControls.selectedProvince.get();
            let selectedDistrict = store.mapControls.selectedDistrict.get();
            let selectedMunicipality = store.mapControls.selectedMunicipality.get();

            let startDate = store.mapControls.startDate.get();
            let startDateRepr: string | undefined = undefined;
            if (startDate) {
                startDate = new Date(startDate.getTime() - (startDate.getTimezoneOffset() * 60 * 1000));
                startDateRepr = startDate.toISOString().split('T')[0]
            }

            let endDate = store.mapControls.endDate.get();
            let endDateRepr: string | undefined = undefined;
            if (endDate) {
                endDate = new Date(endDate.getTime() - (endDate.getTimezoneOffset() * 60 * 1000));
                endDateRepr = endDate.toISOString().split('T')[0]
            }
            let province = selectedProvince ? get_id(selectedProvince) : undefined;
            let district = selectedDistrict ? get_id(selectedDistrict) : undefined;
            let municipality = selectedMunicipality ? get_id(selectedMunicipality) : undefined;
            let incident_query: IncidentFilter = {
                province, district, municipality,
                date_before: endDateRepr,
                date_after: startDateRepr,
            };
            store.loaded.incidentList.set(false);
            get_incident_list(incident_query).then((incidentList) => {
                store.incidentList.set(incidentList);
                store.loaded.incidentList.set(true);
            });

            let program_query: ProgramFilter = {
                province, district, municipality,
                date_before: endDateRepr,
                date_after: startDateRepr,
            };
            store.loaded.programList.set(false);
            get_program_list(program_query).then((programList) => {
                store.programList.set(programList);
                store.loaded.programList.set(true);
            });

            let job_query: JobFilter = {
                province, district, municipality,
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
                    <div style={{ position: "absolute", right: "0.5rem", top: "0.5rem" }}>
                        <div className="leaflet-control flex flex-row align-items-start" style={{ gap: "1rem" }}>
                            <FederalSelector />
                        </div>
                    </div>
                    <div style={{ position: "absolute", left: "0.5rem", bottom: "0.5rem" }}>
                        <div className="leaflet-control flex flex-row align-items-start" style={{ gap: "1rem" }}>
                            <FederalPolygonsSelector />
                        </div>
                    </div>
                    <div style={{ position: "absolute", left: "4rem", top: "0.5rem" }}>
                        <div className="leaflet-control flex flex-row align-items-start" style={{ gap: "1rem" }}>
                            <TimeFilter />
                        </div>
                    </div>
                    <IncidentMarkers />
                </MapContainer>
            </div>
            <LoadingDisplay />
        </section>
    );
}
