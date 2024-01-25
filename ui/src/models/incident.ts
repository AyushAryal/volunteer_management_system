import { LatLngTuple } from "leaflet";

export interface Incident {
    name: string,
    description: string,
    date: string,
    point: LatLngTuple,
    municipality: string,
}

export interface Program {
    name: string,
    description: string,
    incident: string,
}

export interface Job {
    name: string,
    description: string,
    start_date: string,
    end_date: LatLngTuple,
}
