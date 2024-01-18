import { District, FederalBody, Municipality, Province } from "../models/federal";
import { server } from "./api";
import { get_list_factory } from "./pagination";

function fix_geojson<T extends FederalBody>(fn: (query?: string) => Promise<T[]>): (query?: string) => Promise<T[]> {
    return async (query?) => {
        const list = await fn(query);
        for (let body of list) {
            for (let point of body.shape.coordinates[0]) {
                [point[0], point[1]] = [point[1], point[0]];
            }
            body.shape.bbox = [body.shape.bbox[1], body.shape.bbox[0], body.shape.bbox[3], body.shape.bbox[2]]
        }
        return list;
    }
}

export const get_province_list = fix_geojson(get_list_factory<Province>(`${server}/api/province`));
export const get_district_list = fix_geojson(get_list_factory<District>(`${server}/api/district`));
export const get_municipality_list = fix_geojson(get_list_factory<Municipality>(`${server}/api/municipality`));
