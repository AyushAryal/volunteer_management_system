import { get_district_list, get_municipality_list, get_province_list } from '@api/federal';
import {
    Province,
    District,
    Municipality,
} from './federal';
import { Incident, Job, Program, VolunteerProfile } from '@models/incident';

import { hookstate } from '@hookstate/core';
import { get_volunteer_profile } from '@api/incident';

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

export interface Token {
    token: string,
    user: string,
}


export interface Store {
    token: Token | null,
    volunteerProfile: VolunteerProfile | null,
    provinceList: Province[],
    districtList: District[],
    municipalityList: Municipality[],
    incidentList: Incident[],
    jobList: Job[],
    programList: Program[],
    mapControls: MapControls
}

function getTokenFromLocalStorage(): Token | null {
    let storage = localStorage.getItem("token");
    if (storage === null) {
        return null;
    } else {
        return JSON.parse(storage);
    }
};


export const storeState = hookstate<Store>({
    token: getTokenFromLocalStorage(),
    volunteerProfile: null,
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

get_volunteer_profile().then((volunteer) => {
    storeState.volunteerProfile.set(volunteer);
});

get_province_list().then((provinceList) => {
    storeState.provinceList.set(provinceList);
})

get_district_list().then((districtList) => {
    storeState.districtList.set(districtList);
})

get_municipality_list().then((municipalityList) => {
    storeState.municipalityList.set(municipalityList);
})
