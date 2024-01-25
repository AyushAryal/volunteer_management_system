import { ImmutableArray, useHookstate } from "@hookstate/core";
import { storeState } from "../../models/store";
import { Polygon } from "react-leaflet/Polygon";
import { LatLngTuple } from "leaflet";
import { Tooltip } from "react-leaflet";
import { useMemo } from "react";
import { get_selected_federal_list, get_selected_local_body } from "../../utils";
import { FederalBody } from "../../models/federal";


export function SelectedFederalBodyPolygons() {
    const store = useHookstate(storeState);

    let selectedBody = get_selected_local_body(store);
    let federalList = get_selected_federal_list(store);

    if (selectedBody === undefined || federalList === undefined) {
        return null;
    }

    let selectedPolygons = federalList.filter((body) => selectedBody !== null && body.url === selectedBody?.url)
        .map((body) => {
            let points = body.shape.coordinates as LatLngTuple[][];
            return <Polygon key={body.url} positions={points} color="var(--primary-color)" weight={1}>
                <Tooltip sticky>{body.name}</Tooltip>
            </Polygon >;
        });

    return <> {selectedPolygons} </>;
}

export function AllFederalBodyPolygons() {
    const store = useHookstate(storeState);

    const provincePolygons = useMemo(() => {
        return store.provinceList.get().map((body) => {
            let points = body.shape.coordinates as LatLngTuple[][];
            return <Polygon key={body.url} positions={points} color="black" weight={1}>
                <Tooltip sticky>{body.name}</Tooltip>
            </Polygon >;
        });
    }, [store.provinceList]);

    const districtPolygons = useMemo(() => {
        return store.districtList.get().map((body) => {
            let points = body.shape.coordinates as LatLngTuple[][];
            return <Polygon key={body.url} positions={points} color="black" weight={1}>
                <Tooltip sticky>{body.name}</Tooltip>
            </Polygon >;
        });
    }, [store.districtList]);

    // const municipalityPolygons = useMemo(() => {
    //     return store.municipalityList.get().map((body) => {
    //         let points = body.shape.coordinates as LatLngTuple[][];
    //         return <Polygon key={body.url} positions={points} color="black" weight={1}>
    //             <Tooltip sticky>{body.name}</Tooltip>
    //         </Polygon >;
    //     });
    // }, [store.municipalityList]);

    return <>
        <div className={store.mapControls.showProvinceBorders ? "" : "hidden"}>
            {provincePolygons}
        </div>
        <div className={store.mapControls.showDistrictBorders ? "" : "hidden"}>
            {districtPolygons}
        </div>
    </>
}

export function FederalBodyPolygons() {
    return <>
        <AllFederalBodyPolygons />
        <SelectedFederalBodyPolygons />
    </>;
}
