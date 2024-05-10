import { District, DistrictDeserializer, Municipality, MunicipalityDeserializer, Province, ProvinceDeserializer } from "@models/federal";
import { get_paginated_list } from "@api/pagination";

export const get_province_list = get_paginated_list<Province, {}>("/api/province", ProvinceDeserializer);
export const get_district_list = get_paginated_list<District, {}>("/api/district", DistrictDeserializer);
export const get_municipality_list = get_paginated_list<Municipality, {}>("/api/municipality", MunicipalityDeserializer);
