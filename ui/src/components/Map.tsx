
import { LatLngBounds, LatLngTuple } from 'leaflet';
import { Tooltip, TileLayer, Polygon, MapContainer } from 'react-leaflet';

import { useHookstate } from '@hookstate/core';

import { FederalSelector } from './FederalSelector';
import { SideBar } from './SideBar';

import { g_provinceList, g_districtList, g_municipalityList, g_currentProvince, g_currentDistrict, g_currentMunicipality } from '../api/state.ts';
import { BoundingBox } from '../api/federal.ts';
import { useMemo } from 'react';


function SelectedFederalBodyPolygons() {
    const provinceList = useHookstate(g_provinceList);
    const districtList = useHookstate(g_districtList);
    const municipalityList = useHookstate(g_municipalityList);

    const selectedProvince = useHookstate(g_currentProvince);
    const selectedDistrict = useHookstate(g_currentDistrict);
    const selectedMunicipality = useHookstate(g_currentMunicipality);

    let selectedBody = selectedProvince.get();
    let federalList = provinceList.get();
    if (selectedDistrict.get() !== null && selectedMunicipality.get() === null) {
        selectedBody = selectedDistrict.get();
        federalList = districtList.get();
    } else if (selectedMunicipality.get() !== null) {
        selectedBody = selectedMunicipality.get();
        federalList = municipalityList.get();
    }

    let selectedPolygons = federalList
        .filter((body) => selectedBody !== null && body.url === selectedBody)
        .map((body) => {
            let points = body.shape.coordinates as LatLngTuple[][];
            return <Polygon key={body.url} positions={points} color="#f88" weight={1}>
                <Tooltip sticky>{body.name}</Tooltip>
            </Polygon >;
        })

    return <> {selectedPolygons} </>;
}

function FederalBodyPolygons() {
    const provinceList = useHookstate(g_provinceList);
    const polygons = useMemo(() => {
        return provinceList.get().map((body) => {
            let points = body.shape.coordinates as LatLngTuple[][];
            return <Polygon key={body.url} positions={points} color="black" weight={1}>
                <Tooltip sticky>{body.name}</Tooltip>
            </Polygon >;
        });
    }, [provinceList]);
    return <> {polygons} </>
}
export function Map() {
    const provinceList = useHookstate(g_provinceList);
    const districtList = useHookstate(g_districtList);
    const municipalityList = useHookstate(g_municipalityList);

    const selectedProvince = useHookstate(g_currentProvince);
    const selectedDistrict = useHookstate(g_currentDistrict);
    const selectedMunicipality = useHookstate(g_currentMunicipality);

    let bounds = useMemo(() => {
        let bbox: BoundingBox = [26, 80, 31, 89];
        if (selectedMunicipality.get() !== null) {
            let municipality = municipalityList.get().find((body) => body.url == selectedMunicipality.get());
            bbox = municipality?.shape.bbox as BoundingBox ?? bbox;
        } else if (selectedDistrict.get() !== null) {
            let district = districtList.get().find((body) => body.url == selectedDistrict.get());
            bbox = district?.shape.bbox as BoundingBox ?? bbox;
        } else if (selectedProvince.get() !== null) {
            let province = provinceList.get().find((body) => body.url == selectedProvince.get());
            bbox = province?.shape.bbox as BoundingBox ?? bbox;
        }

        return new LatLngBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
    }, [selectedProvince.get(), selectedDistrict.get(), selectedMunicipality.get()]);

    return <div className="flex flex-row" style={{ width: "100vw", height: "100vh" }}>
        <SideBar />
        <MapContainer bounds={bounds} style={{ width: "100%", height: "100%" }}>;
            <TileLayer
                url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <FederalBodyPolygons />
            <SelectedFederalBodyPolygons />
            <div style={{ position: "absolute", right: "10px", top: "10px" }}>
                <div className="leaflet-control">
                    <FederalSelector />
                </div>
            </div>
        </MapContainer>
    </div>;
}
