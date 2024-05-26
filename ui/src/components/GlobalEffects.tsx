import { useEffect } from "react";
import { useHookstate } from "@hookstate/core";

import { storeState } from "@models/store";
import {
    get_district_brief_list,
    get_municipality_brief_list,
    get_province_brief_list,
    get_ward_brief_list
} from "@api/federal";
import { get_notification_list, get_volunteer } from "@api/incident";

export function GlobalEffects() {
    const store = useHookstate(storeState);

    useEffect(() => {
        let network_request = async () => {
            storeState.loaded.provinceList.set(false);
            let provinceList = await get_province_brief_list()
            storeState.provinceList.set(provinceList);
            storeState.loaded.provinceList.set(true);
        }
        network_request();
    }, []);

    useEffect(() => {
        let network_request = async () => {
            storeState.loaded.districtList.set(false);
            let districtList = await get_district_brief_list()
            storeState.districtList.set(districtList);
            storeState.loaded.districtList.set(true);
        }
        network_request();
    }, []);

    useEffect(() => {
        let network_request = async () => {
            storeState.loaded.municipalityList.set(false);
            let municipalityList = await get_municipality_brief_list()
            storeState.municipalityList.set(municipalityList);
            storeState.loaded.municipalityList.set(true);
        }
        network_request();
    }, []);

    useEffect(() => {
        let network_request = async () => {
            storeState.loaded.wardList.set(false);
            let wardList = await get_ward_brief_list()
            storeState.wardList.set(wardList);
            storeState.loaded.wardList.set(true);
        }
        network_request();
    }, []);

    useEffect(() => {
        let networkRequest = async () => {
            if (store.volunteer.get() === null) {
                await get_volunteer().then((volunteer) => {
                    store.volunteer.set(volunteer);
                });
            }
        }
        networkRequest();
    }, []);

    useEffect(() => {
        let network_request = async () => {
            storeState.loaded.notificationList.set(false);
            let notificationList = await get_notification_list();
            storeState.notificationList.set(notificationList);
            storeState.loaded.notificationList.set(true);
        }
        network_request();
    }, []);
    return null;
}
