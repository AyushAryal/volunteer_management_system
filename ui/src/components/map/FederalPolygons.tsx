import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { Polygon, Tooltip, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { get_selected_local_body } from "../../utils";
import { server } from "@api/api";
import { get_id } from "@api/utils";
import { get_federal_body_detail } from "@api/federal";
import { FederalBody } from "@models/federal";
import { LatLngTuple } from "leaflet";
import { ProgressSpinner } from "primereact/progressspinner";


export function SelectedFederalBodyPolygons() {
    const store = useHookstate(storeState);
    const [federalBody, setFederalBody] = useState<FederalBody>();
    let selectedBody = get_selected_local_body(store);

    useEffect(() => {
        let network_request = async () => {
            if (selectedBody) {
                let id = get_id(selectedBody.url ?? "");
                let type = selectedBody.url.split("/").reverse()[1];
                setFederalBody(await get_federal_body_detail(type)(id));
            } else {
                setFederalBody(undefined);
            }
        }
        network_request();
    }, [
        store.mapControls.selectedProvince,
        store.mapControls.selectedDistrict,
        store.mapControls.selectedMunicipality,
        store.mapControls.selectedWard,
    ]);
    let statistics = useHookstate(storeState.statistics).get();
    if (!statistics) return <ProgressSpinner />;

    if (federalBody) {
        let points = federalBody.shape.coordinates as LatLngTuple[][];
        return <Polygon key={federalBody.url} positions={points} color="blue" weight={1}>
            <Tooltip className="bg-primary-100 border-round-lg" sticky>
                <div className="text-xs surface-primary flex flex-column p-2">
                    <span className="text-2xl font-semibold ">{federalBody.name}</span>
                    <span>
                        <span className="text-primary font-semibold">{statistics.volunteers.total}</span>
                        &nbsp;Volunteers
                    </span>
                    <span>
                        <span className="text-primary font-semibold">{statistics.incidents.total}</span>
                        &nbsp;Incidents
                    </span>
                    <span><span className="text-primary font-semibold">{statistics.jobs.total}</span>
                        &nbsp;Jobs
                    </span>
                </div>
            </Tooltip>
        </Polygon >;
    }

    return null;
}

export function AllFederalBodyPolygons() {
    const mapControls = useHookstate(storeState.mapControls);
    const mapRef = useMap();
    let L_ = window.L as any;

    useEffect(() => {
        let styles = {
            province: {
                fill: true,
                fillColor: mapControls.showProvinceBorders.get() ? "#00000020" : "#00000000",
                color: mapControls.showProvinceBorders.get() ? "#000000ff" : "#00000000",
                fillOpacity: 1,
                weight: 1.5,
            },
            district: {
                color: mapControls.showDistrictBorders.get() ? "#6d9debff" : "#00000000",
                weight: 1,
            },
            municipality: {
                color: mapControls.showMunicipalityBorders.get() ? "#095409ff" : "#00000000",
                weight: 0.2,
            },
            ward: function (_: any, zoomLevel: number) {
                return {
                    color: mapControls.showWardBorders.get() && zoomLevel > 7 ? "#ff0000ff" : "#00000000",
                    weight: 0.1,
                };
            },
        };
        let newFederalTileLayer = L_.vectorGrid.protobuf(`${server}/api/tiles/federal/{z}/{x}/{y}`, {
            rendererFactory: L_.canvas.tile,
            vectorTileLayerStyles: styles,
        });
        newFederalTileLayer._vms_federal_polygon_layer = true;

        let polygonLayer: any = undefined;
        mapRef.eachLayer(function (layer: any) {
            if (layer._vms_federal_polygon_layer) {
                polygonLayer = layer;
            }
        })

        if (polygonLayer) {
            mapRef.removeLayer(polygonLayer);
        }
        newFederalTileLayer.addTo(mapRef);
        newFederalTileLayer.setZIndex(2);
    }, [
        mapControls.showProvinceBorders,
        mapControls.showDistrictBorders,
        mapControls.showMunicipalityBorders,
        mapControls.showWardBorders,
    ]);

    return null;
}

export function FederalBodyPolygons() {
    return <>
        <AllFederalBodyPolygons />
        <SelectedFederalBodyPolygons />
    </>;
}
