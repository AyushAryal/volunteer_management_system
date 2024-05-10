import { Polygon, flip_polygon } from "@models/geojson";
import { IDeserializer } from "@models/deserializer";

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

export const ProvinceDeserializer: IDeserializer<Province> = (json: any) => {
    flip_polygon(json.shape);
    return json as Province;
}

export const DistrictDeserializer: IDeserializer<District> = (json: any) => {
    flip_polygon(json.shape);
    return json as District;
}

export const MunicipalityDeserializer: IDeserializer<Municipality> = (json: any) => {
    flip_polygon(json.shape);
    return json as Municipality;
}
