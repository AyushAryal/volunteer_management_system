import {
    ProvinceBrief,
    DistrictBrief,
    MunicipalityBrief,
    WardBrief,
} from '@models/federal';
import { Incident, Job, Program, VolunteerProfile } from '@models/incident';

import { hookstate } from '@hookstate/core';
import { get_volunteer_profile } from '@api/incident';

interface MapControls {
    selectedProvince: string | null,
    selectedDistrict: string | null,
    selectedMunicipality: string | null,
    selectedWard: string | null,
    showProvinceBorders: boolean,
    showDistrictBorders: boolean,
    showMunicipalityBorders: boolean,
    showWardBorders: boolean,
    startDate: Date | null,
    endDate: Date | null,
}

export interface Token {
    token: string,
    user: string,
}


export interface Store {
    token: Token | null,
    volunteerProfile: VolunteerProfile | null,
    provinceList: ProvinceBrief[],
    districtList: DistrictBrief[],
    municipalityList: MunicipalityBrief[],
    wardList: WardBrief[],
    incidentList: Incident[],
    jobList: Job[],
    programList: Program[],
    loaded: {
        provinceList: boolean,
        districtList: boolean,
        municipalityList: boolean,
        wardList: boolean,
        incidentList: boolean,
        jobList: boolean,
        programList: boolean,
    },
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
    wardList: [],
    incidentList: [],
    jobList: [],
    programList: [],
    loaded: {
        provinceList: false,
        districtList: false,
        municipalityList: false,
        wardList: false,
        incidentList: false,
        jobList: false,
        programList: false,
    },
    mapControls: {
        selectedProvince: null,
        selectedDistrict: null,
        selectedMunicipality: null,
        selectedWard: null,
        showProvinceBorders: true,
        showDistrictBorders: true,
        showMunicipalityBorders: false,
        showWardBorders: false,
        startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(),
    }
})

get_volunteer_profile().then((volunteer) => {
    storeState.volunteerProfile.set(volunteer);
});
