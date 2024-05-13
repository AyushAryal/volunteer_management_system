import { BoundingBox, Polygon, flip_bbox, flip_polygon } from "@models/geojson";
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

export type Ward = {
    url: string,
    name: string,
    shape: Polygon,
    municipality: string,
}

export type ProvinceBrief = {
    url: string,
    name: string,
    bbox: BoundingBox,
};

export type DistrictBrief = {
    url: string,
    name: string,
    bbox: BoundingBox,
    province: string,
}

export type MunicipalityBrief = {
    url: string,
    name: string,
    bbox: BoundingBox,
    district: string,
}

export type WardBrief = {
    url: string,
    name: string,
    bbox: BoundingBox,
    municipality: string,
}

export type FederalBody = Province | District | Municipality | Ward;
export type FederalBodyBrief = ProvinceBrief | DistrictBrief | MunicipalityBrief | WardBrief;

export const FederalBodyDeserializer: IDeserializer<FederalBody> = (json: any) => {
    flip_polygon(json.shape);
    return json as FederalBody;
}

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

export const WardDeserializer: IDeserializer<Ward> = (json: any) => {
    flip_polygon(json.shape);
    return json as Ward;
}

export const ProvinceBriefDeserializer: IDeserializer<ProvinceBrief> = (json: any) => {
    flip_bbox(json.bbox);
    return json as ProvinceBrief;
}

export const DistrictBriefDeserializer: IDeserializer<DistrictBrief> = (json: any) => {
    flip_bbox(json.bbox);
    return json as DistrictBrief;
}

export const MunicipalityBriefDeserializer: IDeserializer<MunicipalityBrief> = (json: any) => {
    flip_bbox(json.bbox);
    return json as MunicipalityBrief;
}

export const WardBriefDeserializer: IDeserializer<WardBrief> = (json: any) => {
    flip_bbox(json.bbox);
    return json as WardBrief;
}
