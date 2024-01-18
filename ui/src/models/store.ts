import { get_district_list, get_municipality_list, get_province_list } from '../api/federal';
import {
    Province,
    District,
    Municipality,
} from '../models/federal';

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

export interface Store {
    provinceList: Province[],
    districtList: District[],
    municipalityList: Municipality[],
    mapControls: MapControls
}

export const storeState = hookstate<Store>({
    provinceList: [],
    districtList: [],
    municipalityList: [],
    mapControls: {
        selectedProvince: null,
        selectedDistrict: null,
        selectedMunicipality: null,
        showProvinceBorders: true,
        showDistrictBorders: false,
        showMunicipalityBorders: false,
        expandFilters: false,
        expandSidebar: false,
    }
})

get_province_list().then((list) => storeState.provinceList.set(list));
get_district_list().then((list) => storeState.districtList.set(list));
get_municipality_list().then((list) => storeState.municipalityList.set(list));
