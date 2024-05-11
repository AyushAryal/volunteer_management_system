import {
    Province, ProvinceBrief, ProvinceBriefDeserializer, ProvinceDeserializer,
    District, DistrictBrief, DistrictBriefDeserializer, DistrictDeserializer,
    Municipality, MunicipalityBrief, MunicipalityBriefDeserializer, MunicipalityDeserializer,
    FederalBody,
    FederalBodyDeserializer,
} from "@models/federal";
import { get_detail, get_filtered_list } from "./utils";

export let get_province_detail = get_detail<Province, number>("/api/province", ProvinceDeserializer);
export let get_district_detail = get_detail<District, number>("/api/district", DistrictDeserializer);
export let get_municipality_detail = get_detail<Municipality, number>("/api/municipality", MunicipalityDeserializer);
export let get_federal_body_detail = (type: string) => get_detail<FederalBody, number>(`/api/${type}`, FederalBodyDeserializer);

export const get_province_list = get_filtered_list<ProvinceBrief, {}>("/api/province/brief", ProvinceBriefDeserializer);
export const get_district_list = get_filtered_list<DistrictBrief, {}>("/api/district/brief", DistrictBriefDeserializer);
export const get_municipality_list = get_filtered_list<MunicipalityBrief, {}>("/api/municipality/brief", MunicipalityBriefDeserializer);
