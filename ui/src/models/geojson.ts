import { LatLngTuple } from "leaflet";

export type BoundingBox = [number, number, number, number];

export type Polygon = {
    type: string,
    coordinates: LatLngTuple[][],
    bbox: BoundingBox,
}

export function flip_point(point: any) {
    [point[0], point[1]] = [point[1], point[0]];
}

export function flip_bbox(bbox: any) {
    [bbox[0], bbox[1], bbox[2], bbox[3]] = [bbox[1], bbox[0], bbox[3], bbox[2]];
}

export function flip_polygon(shape: any) {
    for (let polygon of shape.coordinates) {
        for (let point of polygon) {
            flip_point(point);
        }
    }
    flip_bbox(shape.bbox)
}
