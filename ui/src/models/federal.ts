import { Polygon } from "./geojson";

export type Province = {
    url: string,
    name: string,
    shape: Polygon,
};

export type District = {
    url: string,
    name: string,
    shape: Polygon,
    province: string,
}

export type Municipality = {
    url: string,
    name: string,
    shape: Polygon,
    district: string,
}

export type FederalBody = Province | District | Municipality;
