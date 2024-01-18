import { LatLngTuple } from "leaflet";

export type BoundingBox = [number, number, number, number];

export type Polygon = {
    type: string,
    coordinates: LatLngTuple[][],
    bbox: BoundingBox,
}
