import {
    Province,
    District,
    Municipality,
    get_province_list,
    get_district_list,
    get_municipality_list,
} from '../api/federal';

import { hookstate } from '@hookstate/core';

interface MapControls {
    selectedProvince: string | null,
    selectedDistrict: string | null,
    selectedMunicipality: string | null,
    showProvinceBorders: boolean,
    showDistrictBorders: boolean,
    showMunicipalityBorders: boolean,
    expandFilters: boolean,
    expandSidebar: boolean,
}

export const mapControls = hookstate<MapControls>({
    selectedProvince: null,
    selectedDistrict: null,
    selectedMunicipality: null,
    showProvinceBorders: true,
    showDistrictBorders: false,
    showMunicipalityBorders: false,
    expandFilters: false,
    expandSidebar: false,
});


export const g_currentProvince = hookstate<string | null>(null);
export const g_currentDistrict = hookstate<string | null>(null);
export const g_currentMunicipality = hookstate<string | null>(null);

export const g_provinceList = hookstate<Province[]>([]);
export const g_districtList = hookstate<District[]>([]);
export const g_municipalityList = hookstate<Municipality[]>([]);

get_province_list().then((list) => g_provinceList.set(list));
get_district_list().then((list) => g_districtList.set(list));
get_municipality_list().then((list) => g_municipalityList.set(list));
