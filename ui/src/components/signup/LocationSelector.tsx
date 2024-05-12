
import { useHookstate } from '@hookstate/core';
import { storeState } from '@models/store';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';

import {
    ProvinceBrief,
    DistrictBrief,
    MunicipalityBrief
} from '@models/federal';
import { StateTuple } from '@models/generics';
import { useEffect } from 'react';
import { get_district_brief_list, get_municipality_brief_list, get_province_brief_list } from '@api/federal';


export function ProvinceSelector({ selectedProvinceState }: { selectedProvinceState: StateTuple<string> }) {
    const store = useHookstate(storeState);
    const [selectedProvince, setProvince] = selectedProvinceState;

    useEffect(() => {
        if (storeState.provinceList.get().length == 0) {
            let network_request = async () => {
                let provinceList = await get_province_brief_list()
                storeState.provinceList.set(provinceList);
            }
            network_request();
        }
    }, [store.provinceList]);

    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
    return <Dropdown
        value={store.provinceList.get().find((province) => selectedProvince == province.url)}
        onChange={(ev) => { setProvince(ev.value?.url ?? ""); }}
        options={store.provinceList.get() as ProvinceBrief[]}
        emptyMessage={store.provinceList.get().length == 0 ? progressSpinner : null}
        optionLabel="name"
        showClear
        filter
        placeholder="Select a province" />;
}

export function DistrictSelector({ label, selectedDistrictState }: { label: string, selectedDistrictState: StateTuple<string> }) {
    const store = useHookstate(storeState);
    const [selectedDistrict, setDistrict] = selectedDistrictState;
    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    useEffect(() => {
        if (storeState.districtList.get().length == 0) {
            let network_request = async () => {
                let districtList = await get_district_brief_list()
                storeState.districtList.set(districtList);
            }
            network_request();
        }
    }, [store.districtList]);

    return <div className="flex flex-column justify-content-center align-content-center">
        <Dropdown
            value={store.districtList.get().find((district) => selectedDistrict == district.url)}
            onChange={(ev) => { setDistrict(ev.value?.url ?? ""); }}
            options={store.districtList.get() as DistrictBrief[]}
            emptyMessage={store.districtList.get().length == 0 ? progressSpinner : null}
            optionLabel="name"
            showClear
            filter
            placeholder={label} />
    </div>;
}

export function MunicipalitySelector({ selectedMunicipalityState }: { selectedMunicipalityState: StateTuple<string> }) {
    const store = useHookstate(storeState);
    const [selectedMunicipality, setMunicipality] = selectedMunicipalityState;
    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    useEffect(() => {
        if (storeState.municipalityList.get().length == 0) {
            let network_request = async () => {
                let municipalityList = await get_municipality_brief_list()
                storeState.municipalityList.set(municipalityList);
            }
            network_request();
        }
    }, [store.municipalityList]);

    return <div className="flex flex-column justify-content-center align-content-center">
        <Dropdown
            value={store.municipalityList.get().find((municipality) => selectedMunicipality == municipality.url)}
            onChange={(ev) => { setMunicipality(ev.value?.url ?? ""); }}
            options={store.municipalityList.get() as MunicipalityBrief[]}
            emptyMessage={store.municipalityList.get().length == 0 ? progressSpinner : null}
            optionLabel="name"
            showClear
            filter
            placeholder="Select a municipality" />
    </div>;
}

type LocationSelectorProps = {
    selectedProvinceState: StateTuple<string>,
    selectedDistrictState: StateTuple<string>,
    selectedMunicipalityState: StateTuple<string>,
};

export function LocationSelector(props: LocationSelectorProps) {
    const store = useHookstate(storeState);

    useEffect(() => {
        if (storeState.provinceList.get().length == 0) {
            let network_request = async () => {
                let provinceList = await get_province_brief_list()
                storeState.provinceList.set(provinceList);
            }
            network_request();
        }
    }, [store.provinceList]);

    useEffect(() => {
        if (storeState.districtList.get().length == 0) {
            let network_request = async () => {
                let districtList = await get_district_brief_list()
                storeState.districtList.set(districtList);
            }
            network_request();
        }
    }, [store.districtList]);

    useEffect(() => {
        if (storeState.municipalityList.get().length == 0) {
            let network_request = async () => {
                let municipalityList = await get_municipality_brief_list()
                storeState.municipalityList.set(municipalityList);
            }
            network_request();
        }
    }, [store.municipalityList]);

    const {
        selectedProvinceState,
        selectedDistrictState,
        selectedMunicipalityState,
    } = props;

    const [selectedProvince, setProvince] = selectedProvinceState;
    const [selectedDistrict, setDistrict] = selectedDistrictState;
    const [selectedMunicipality, setMunicipality] = selectedMunicipalityState;

    const updateProvince = (province: ProvinceBrief | undefined) => {
        setMunicipality("");
        setDistrict("");
        setProvince(province?.url ?? "");
    };

    const updateDistrict = (district: DistrictBrief | undefined) => {
        setMunicipality("");
        setDistrict(district?.url ?? "");
        let province = store.provinceList.get().find((province) => province.url === district?.province);
        if (province !== undefined) {
            setProvince(province?.url ?? "");
        }
    };

    const updateMunicipality = (municipality: MunicipalityBrief | undefined) => {
        setMunicipality(municipality?.url ?? "");
        let district = store.districtList.get().find((district) => district.url === municipality?.district);
        if (district !== undefined) {
            setDistrict(district?.url ?? "");
            let province = store.provinceList.get().find((province) => province.url === district?.province);
            setProvince(province?.url ?? "");
        }
    };

    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    return (
        <div className="flex flex-column justify-content-center align-content-center">
            <Dropdown
                value={store.provinceList
                    .get()
                    .find((province) => selectedProvince == province.url)}
                onChange={(ev) => {
                    updateProvince(ev.value);
                }}
                options={store.provinceList.get() as ProvinceBrief[]}
                emptyMessage={
                    store.provinceList.get().length == 0 ? progressSpinner : null
                }
                optionLabel="name"
                showClear
                placeholder="Select a province"
            />
            <Dropdown
                value={store.districtList
                    .get()
                    .find((district) => selectedDistrict == district.url)}
                onChange={(ev) => {
                    updateDistrict(ev.value);
                }}
                options={store.districtList.get() as DistrictBrief[]}
                emptyMessage={
                    store.districtList.get().length == 0 ? progressSpinner : null
                }
                optionLabel="name"
                showClear
                filter
                filterInputAutoFocus
                placeholder="Select a district"
            />
            <Dropdown
                value={store.municipalityList
                    .get()
                    .find((municipality) => selectedMunicipality == municipality.url)}
                onChange={(ev) => {
                    updateMunicipality(ev.value);
                }}
                options={store.municipalityList.get() as MunicipalityBrief[]}
                emptyMessage={
                    store.municipalityList.get().length == 0 ? progressSpinner : null
                }
                optionLabel="name"
                showClear
                filter
                filterInputAutoFocus
                placeholder="Select a municipality"
            />
        </div>
    );
}
