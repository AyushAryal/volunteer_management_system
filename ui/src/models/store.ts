import {
    ProvinceBrief,
    DistrictBrief,
    MunicipalityBrief,
    WardBrief,
} from '@models/federal';
import { Incident, Job, Program, Volunteer, Report, Notification, Statistics } from '@models/incident';

import { hookstate } from '@hookstate/core';

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
    volunteer: Volunteer | null,
    provinceList: ProvinceBrief[],
    districtList: DistrictBrief[],
    municipalityList: MunicipalityBrief[],
    wardList: WardBrief[],
    incidentList: Incident[],
    jobList: Job[],
    reportList: Report[],
    programList: Program[],
    notificationList: Notification[],
    statistics: Statistics | null,
    loaded: {
        provinceList: boolean,
        districtList: boolean,
        municipalityList: boolean,
        wardList: boolean,
        incidentList: boolean,
        jobList: boolean,
        programList: boolean,
        notificationList: boolean,
        statistics: boolean,
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
    volunteer: null,
    provinceList: [],
    districtList: [],
    municipalityList: [],
    wardList: [],
    incidentList: [],
    jobList: [],
    reportList: [],
    programList: [],
    notificationList: [],
    statistics: null,
    loaded: {
        provinceList: false,
        districtList: false,
        municipalityList: false,
        wardList: false,
        incidentList: false,
        jobList: false,
        programList: false,
        notificationList: true,
        statistics: false,
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
