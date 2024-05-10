import { useEffect, useRef } from 'react';

import { LatLngBounds, Map } from 'leaflet';
import { TileLayer, MapContainer } from 'react-leaflet';
import { useHookstate } from '@hookstate/core';

import { FederalBodyPolygons } from '@components/map/FederalPolygons.tsx';
import { FederalSelector } from '@components/map/FederalSelector';
import { SideBar } from '@components/map/SideBar';
import { storeState } from '@models/store.ts';
import { get_id } from '@api/utils.ts';
import { FederalFilter, get_incident_list, get_job_list, get_program_list, get_volunteer_profile } from '@api/incident.ts';

export function VmsMap() {
    const store = useHookstate(storeState);
    const mapRef = useRef<Map>(null);

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

            let query: FederalFilter = {}
            if (selectedProvince !== null) { query.province = get_id(selectedProvince); }
            if (selectedDistrict !== null) { query.district = get_id(selectedDistrict); }
            if (selectedMunicipality !== null) { query.municipality = get_id(selectedMunicipality); }

            get_incident_list(query).then((incidents) => {
                store.incidentList.set(incidents);
            });
            get_job_list(query).then((jobs) => {
                store.jobList.set(jobs);
            });
            get_program_list(query).then((programs) => {
                store.programList.set(programs);
            });
        }
        networkRequest();
    }, [
        store.mapControls.selectedDistrict,
        store.mapControls.selectedMunicipality,
        store.mapControls.selectedProvince
    ]);

    return (
        <section className="w-full h-screen mx-auto flex">
            <div className="flex flex-row align-items-stretch" style={{ width: "100vw", height: "100vh" }}>
                <SideBar mapRef={mapRef} />
                <MapContainer
                    bounds={new LatLngBounds([[26, 80], [31, 89]])}
                    style={{ width: "100%", height: "100%" }}
                    ref={mapRef}
                >
                    <TileLayer
                        url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <FederalBodyPolygons />
                    <div style={{ position: "absolute", right: "10px", top: "10px" }}>
                        <div className="leaflet-control flex flex-row align-items-start" style={{ gap: "1rem" }}>
                            <FederalSelector />
                        </div>
                    </div>
                </MapContainer>
            </div>
        </section>
    );
}
