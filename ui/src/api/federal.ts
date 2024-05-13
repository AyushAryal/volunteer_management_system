import {
    Province, ProvinceBrief, ProvinceBriefDeserializer, ProvinceDeserializer,
    District, DistrictBrief, DistrictBriefDeserializer, DistrictDeserializer,
    Municipality, MunicipalityBrief, MunicipalityBriefDeserializer, MunicipalityDeserializer,
    Ward, WardBrief, WardBriefDeserializer, WardDeserializer,
    FederalBody,
    FederalBodyDeserializer,
} from "@models/federal";
import { get_detail, get_filtered_list } from "./utils";
import { endpoints, server } from "@api/api";

export let get_province_detail = get_detail<Province, number>(endpoints.province, ProvinceDeserializer);
export let get_district_detail = get_detail<District, number>(endpoints.district, DistrictDeserializer);
export let get_municipality_detail = get_detail<Municipality, number>(endpoints.municipality, MunicipalityDeserializer);
export let get_ward_detail = get_detail<Ward, number>(endpoints.ward, WardDeserializer);
export let get_federal_body_detail = (type: string) => get_detail<FederalBody, number>(`${server}/api/${type}`, FederalBodyDeserializer);

export const get_province_brief_list = get_filtered_list<ProvinceBrief, {}>(endpoints.province_brief, ProvinceBriefDeserializer);
export const get_district_brief_list = get_filtered_list<DistrictBrief, {}>(endpoints.district_brief, DistrictBriefDeserializer);
export const get_municipality_brief_list = get_filtered_list<MunicipalityBrief, {}>(endpoints.municipality_brief, MunicipalityBriefDeserializer);
export const get_ward_brief_list = get_filtered_list<WardBrief, {}>(endpoints.ward_brief, WardBriefDeserializer);
