import { get_district_list, get_municipality_list, get_province_list } from '../api/federal';
import {
    Province,
    District,
    Municipality,
} from './federal';
import { Incident, Job, Program } from './incident';

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
    incidentList: Incident[],
    jobList: Job[],
    programList: Program[],
    mapControls: MapControls
}

export const storeState = hookstate<Store>({
    provinceList: [],
    districtList: [],
    municipalityList: [],
    incidentList: [],
    jobList: [],
    programList: [],
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

Promise.all([
    get_province_list(), get_district_list(), get_municipality_list()
]).then(([provinceList, districtList, municipalityList]) => {
    storeState.provinceList.set(provinceList);
    storeState.districtList.set(districtList);
    storeState.municipalityList.set(municipalityList);
})
