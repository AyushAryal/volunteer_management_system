const server = "http://localhost:8000";

type Point = [number, number];

type Polygon = {
    type: string,
    coordinates: Point[][],
}
type Province = {
    name: string,
    shape: Polygon,
};

type District = {
    name: string,
    shape: Polygon,
    province: string,
}

type Municipality = {
    name: string,
    shape: Polygon,
    district: string,
}

export type ProvinceBrief = {
    url: string,
    name: string,
}

export type DistrictBrief = {
    url: string,
    name: string,
    province: string,
}

export type MunicipalityBrief = {
    url: string,
    name: string,
    district: string,
}

async function* depaginate<T>(url: string): AsyncGenerator<T[], void, void> {
    while (url !== null) {
        let response = await fetch(url);
        let json = await response.json();
        url = json["next"];
        yield json["results"];
    }
}

async function depaginate_full<T>(url: string): Promise<T[]> {
    let elements: T[] = [];
    for await (let element_page of depaginate<T>(url)) {
        elements.push(...element_page);
    }
    return elements;
}

export function get_list_factory<T>(url: string): (query?: {}) => Promise<T[]> {
    return async (query) => {
        if (typeof (query) !== 'undefined') {
            const query_string = Object.entries(query)
                .map(([key, value]) => `${key}=${value}`)
                .join("&");
            return await depaginate_full<T>(`${url}?${query_string}`);
        }
        return await depaginate_full<T>(url);
    };
}

export const get_province_list = get_list_factory<Province>(`${server}/api/province`);
export const get_district_list = get_list_factory<District>(`${server}/api/district`);
export const get_municipality_list = get_list_factory<Municipality>(`${server}/api/municipality`);
export const get_province_brief_list = get_list_factory<ProvinceBrief>(`${server}/api/province/brief`);
export const get_district_brief_list = get_list_factory<DistrictBrief>(`${server}/api/district/brief`);
export const get_municipality_brief_list = get_list_factory<MunicipalityBrief>(`${server}/api/municipality/brief`);
