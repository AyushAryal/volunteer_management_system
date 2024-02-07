import { useEffect } from 'react';

import { LatLngBounds } from 'leaflet';
import { TileLayer, MapContainer } from 'react-leaflet';
import { useHookstate } from '@hookstate/core';

import { BoundingBox } from '../../models/geojson.ts';
import { FederalBodyPolygons } from './FederalPolygons.tsx';
import { FederalSelector } from './FederalSelector';
import { SideBar } from './SideBar';
import { storeState } from '../../models/store.ts';
import { get_id } from '../../api/utils.ts';
import { FederalFilter, get_incident_list, get_job_list, get_program_list, get_volunteer_profile } from '../../api/incident.ts';

export function Map() {
    const store = useHookstate(storeState);
    const mapControls = store.mapControls;

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

    let bbox: BoundingBox = [26, 80, 31, 89];
    if (mapControls.selectedMunicipality.get() !== null) {
        let municipality = store.municipalityList.get().find((body) => body.url == mapControls.selectedMunicipality.get());
        bbox = municipality?.shape.bbox as BoundingBox ?? bbox;
    } else if (mapControls.selectedDistrict.get() !== null) {
        let district = store.districtList.get().find((body) => body.url == mapControls.selectedDistrict.get());
        bbox = district?.shape.bbox as BoundingBox ?? bbox;
    } else if (mapControls.selectedProvince.get() !== null) {
        let province = store.provinceList.get().find((body) => body.url == mapControls.selectedProvince.get());
        bbox = province?.shape.bbox as BoundingBox ?? bbox;
    }

    let bounds = new LatLngBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);

    return <div className="flex flex-row" style={{ width: "100vw", height: "100vh" }}>
        <SideBar />
        <MapContainer bounds={bounds} style={{ width: "100%", height: "100%" }}>;
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
    </div>;
}
