import { useEffect, useRef, useState } from 'react';

import L, { LatLngBounds, Map } from 'leaflet';
import { TileLayer, MapContainer } from 'react-leaflet';
import { useHookstate } from '@hookstate/core';

import { FederalBodyPolygons } from '@components/map/FederalPolygons.tsx';
import { FederalSelector } from '@components/map/FederalSelector';
import { SideBar } from '@components/map/SideBar';
import { storeState } from '@models/store.ts';
import { get_id } from '@api/utils.ts';
import { FederalFilter, get_incident_list, get_job_list, get_program_list, get_volunteer_profile } from '@api/incident.ts';
import { get_district_list, get_municipality_list, get_province_list } from '@api/federal';
import { Dialog } from 'primereact/dialog';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FederalPolygonsSelector } from './FederalPolygonsSelector';


export function VmsMap() {
    const store = useHookstate(storeState);
    const mapRef = useRef<Map>(null);
    const [loading, setIsLoading] = useState(true);
    const [loadingMessage, setLoadingMessage] = useState("");

    useEffect(() => {
        let networkRequest = async () => {
            setLoadingMessage("Province");
            let provinceList = await get_province_list();
            storeState.provinceList.set(provinceList);

            setLoadingMessage("District");
            let districtList = await get_district_list();
            storeState.districtList.set(districtList);

            setLoadingMessage("Municipality");
            let municipalityList = await get_municipality_list();
            storeState.municipalityList.set(municipalityList);
            setIsLoading(false);
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

    const loadingDialog = <Dialog
        showHeader={false}
        modal={false}
        closable={false}
        visible={loading}
        position={"bottom-right"}
        onHide={() => { setIsLoading(false); }}
        contentStyle={{ padding: "0 2rem", background: "#00000090" }}
    >
        <div className="flex align-items-center justify-content-around gap-4">
            <ProgressSpinner
                style={{
                    width: '30px',
                    height: '30px'
                }}
                pt={{
                    circle: {
                        style: {
                            animation: "p-progress-spinner-dash 1.5s ease-in-out infinite, ease-in-out infinite",
                            stroke: "white"
                        }
                    }
                }}
            />
            <h3 className="text-white"> Loading {loadingMessage}... </h3>
        </div>
    </Dialog>;

    return (
        <section className="w-full h-screen mx-auto flex">
            <div className="flex flex-row align-items-stretch" style={{ width: "100vw", height: "100vh" }}>
                <SideBar mapRef={mapRef} />
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
                    <div style={{ position: "absolute", right: "10px", top: "10px" }}>
                        <div className="leaflet-control flex flex-row align-items-start" style={{ gap: "1rem" }}>
                            <FederalSelector />
                        </div>
                    </div>
                    <div style={{ position: "absolute", left: "10px", bottom: "10px" }}>
                        <div className="leaflet-control flex flex-row align-items-start" style={{ gap: "1rem" }}>
                            <FederalPolygonsSelector />
                        </div>
                    </div>
                </MapContainer>
            </div>
            {loadingDialog}
        </section>
    );
}
