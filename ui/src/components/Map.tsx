import { useMemo } from 'react';

import { LatLngBounds, LatLngTuple } from 'leaflet';
import { Tooltip, TileLayer, Polygon, MapContainer } from 'react-leaflet';
import { useHookstate } from '@hookstate/core';

import { BoundingBox } from '../models/geojson.ts';
import { FederalSelector } from './FederalSelector';
import { SideBar } from './SideBar';
import { storeState } from '../models/store.ts';


function SelectedFederalBodyPolygons() {
    const store = useHookstate(storeState);
    const mapControls = store.mapControls;

    let selectedBody = mapControls.selectedProvince.get();
    let federalList = store.provinceList.get();
    if (mapControls.selectedDistrict.get() !== null && mapControls.selectedMunicipality.get() === null) {
        selectedBody = mapControls.selectedDistrict.get();
        federalList = store.districtList.get();
    } else if (mapControls.selectedMunicipality.get() !== null) {
        selectedBody = mapControls.selectedMunicipality.get();
        federalList = store.municipalityList.get();
    }

    let selectedPolygons = federalList
        .filter((body) => selectedBody !== null && body.url === selectedBody)
        .map((body) => {
            let points = body.shape.coordinates as LatLngTuple[][];
            return <Polygon key={body.url} positions={points} color="var(--primary-color)" weight={1}>
                <Tooltip sticky>{body.name}</Tooltip>
            </Polygon >;
        })

    return <> {selectedPolygons} </>;
}

function ProvincePolygons() {
    const store = useHookstate(storeState);
    const polygons = useMemo(() => {
        return store.provinceList.get().map((body) => {
            let points = body.shape.coordinates as LatLngTuple[][];
            return <Polygon key={body.url} positions={points} color="black" weight={1}>
                <Tooltip sticky>{body.name}</Tooltip>
            </Polygon >;
        });
    }, [store.provinceList]);
    return <> {polygons} </>
}

export function Map() {
    const store = useHookstate(storeState);
    const mapControls = store.mapControls;

    let bounds = useMemo(() => {
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

        return new LatLngBounds([[bbox[0], bbox[1]], [bbox[2], bbox[3]]]);
    }, [mapControls.selectedProvince.get(), mapControls.selectedDistrict.get(), mapControls.selectedMunicipality.get()]);

    return <div className="flex flex-row" style={{ width: "100vw", height: "100vh" }}>
        <SideBar />
        <MapContainer bounds={bounds} style={{ width: "100%", height: "100%" }}>;
            <TileLayer
                url='https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png'
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <ProvincePolygons />
            <SelectedFederalBodyPolygons />
            <div style={{ position: "absolute", right: "10px", top: "10px" }}>
                <div className="leaflet-control">
                    <FederalSelector />
                </div>
            </div>
        </MapContainer>
    </div>;
}
