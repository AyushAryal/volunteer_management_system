
import { useHookstate } from '@hookstate/core';
import { storeState } from '@models/store';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';

import {
    ProvinceBrief,
    DistrictBrief,
    MunicipalityBrief,
    WardBrief
} from '@models/federal';
import { StateTuple } from '@models/generics';
import { useEffect } from 'react';
import { get_district_brief_list, get_municipality_brief_list, get_province_brief_list, get_ward_brief_list } from '@api/federal';


export function ProvinceSelector({ selectedProvinceState }: { selectedProvinceState: StateTuple<string> }) {
    const store = useHookstate(storeState);
    const [selectedProvince, setProvince] = selectedProvinceState;

    useEffect(() => {
        if (storeState.provinceList.get().length == 0) {
            let network_request = async () => {
                storeState.loaded.provinceList.set(false);
                let provinceList = await get_province_brief_list()
                storeState.provinceList.set(provinceList);
                storeState.loaded.provinceList.set(true);
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
                storeState.loaded.districtList.set(false);
                let districtList = await get_district_brief_list()
                storeState.districtList.set(districtList);
                storeState.loaded.districtList.set(true);
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
                storeState.loaded.municipalityList.set(false);
                let municipalityList = await get_municipality_brief_list()
                storeState.municipalityList.set(municipalityList);
                storeState.loaded.municipalityList.set(true);
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


export function WardSelector({ selectedWardState }: { selectedWardState: StateTuple<string> }) {
    const store = useHookstate(storeState);
    const [selectedWard, setWard] = selectedWardState;
    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    useEffect(() => {
        if (storeState.wardList.get().length == 0) {
            let network_request = async () => {
                storeState.loaded.wardList.set(false);
                let wardList = await get_ward_brief_list()
                storeState.wardList.set(wardList);
                storeState.loaded.wardList.set(true);
            }
            network_request();
        }
    }, [store.wardList]);

    return <div className="flex flex-column justify-content-center align-content-center">
        <Dropdown
            value={store.wardList.get().find((ward) => selectedWard == ward.url)}
            onChange={(ev) => { setWard(ev.value?.url ?? ""); }}
            options={store.wardList.get() as WardBrief[]}
            emptyMessage={store.wardList.get().length == 0 ? progressSpinner : null}
            optionLabel="name"
            showClear
            filter
            placeholder="Select a ward" />
    </div>;
}

type LocationSelectorProps = {
    selectedProvinceState: StateTuple<string | null>,
    selectedDistrictState: StateTuple<string | null>,
    selectedMunicipalityState: StateTuple<string | null>,
    selectedWardState: StateTuple<string | null>,
};

export function LocationSelector(props: LocationSelectorProps) {
    const store = useHookstate(storeState);

    useEffect(() => {
        if (storeState.provinceList.get().length == 0) {
            let network_request = async () => {
                storeState.loaded.provinceList.set(false);
                let provinceList = await get_province_brief_list()
                storeState.provinceList.set(provinceList);
                storeState.loaded.provinceList.set(true);
            }
            network_request();
        }
    }, [store.provinceList]);

    useEffect(() => {
        if (storeState.districtList.get().length == 0) {
            let network_request = async () => {
                storeState.loaded.districtList.set(false);
                let districtList = await get_district_brief_list()
                storeState.districtList.set(districtList);
                storeState.loaded.districtList.set(true);
            }
            network_request();
        }
    }, [store.districtList]);

    useEffect(() => {
        if (storeState.municipalityList.get().length == 0) {
            let network_request = async () => {
                storeState.loaded.municipalityList.set(false);
                let municipalityList = await get_municipality_brief_list()
                storeState.municipalityList.set(municipalityList);
                storeState.loaded.municipalityList.set(true);
            }
            network_request();
        }
    }, [store.municipalityList]);

    useEffect(() => {
        if (storeState.wardList.get().length == 0) {
            let network_request = async () => {
                storeState.loaded.wardList.set(false);
                let wardList = await get_ward_brief_list()
                storeState.wardList.set(wardList);
                storeState.loaded.wardList.set(true);
            }
            network_request();
        }
    }, [store.wardList]);

    const {
        selectedProvinceState,
        selectedDistrictState,
        selectedMunicipalityState,
        selectedWardState,
    } = props;

    const [selectedProvince, setProvince] = selectedProvinceState;
    const [selectedDistrict, setDistrict] = selectedDistrictState;
    const [selectedMunicipality, setMunicipality] = selectedMunicipalityState;
    const [selectedWard, setWard] = selectedWardState;

    const updateProvince = (province: ProvinceBrief | undefined) => {
        setWard(null);
        setMunicipality(null);
        setDistrict(null);
        setProvince(province?.url ?? null);
    };

    const updateDistrict = (district: DistrictBrief | undefined) => {
        setWard(null);
        setMunicipality(null);
        setDistrict(district?.url ?? null);
        let province = store.provinceList.get().find((province) => province.url === district?.province);
        if (province !== undefined) {
            setProvince(province?.url ?? null);
        }
    };

    const updateMunicipality = (municipality: MunicipalityBrief | undefined) => {
        setWard(null);
        setMunicipality(municipality?.url ?? null);
        let district = store.districtList.get().find((district) => district.url === municipality?.district);
        if (district !== undefined) {
            setDistrict(district?.url ?? null);
            let province = store.provinceList.get().find((province) => province.url === district?.province);
            setProvince(province?.url ?? null);
        }
    };

    const updateWard = (ward: WardBrief | undefined) => {
        setWard(ward?.url ?? null);
        let municipality = store.municipalityList.get().find((municipality) => municipality.url === ward?.municipality);
        if (municipality !== undefined) {
            setMunicipality(municipality?.url ?? null);
            let district = store.districtList.get().find((district) => district.url === municipality?.district);
            setDistrict(district?.url ?? null);
            let province = store.provinceList.get().find((province) => province.url === district?.province);
            setProvince(province?.url ?? null);
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
            <Dropdown
                value={store.wardList
                    .get()
                    .find((ward) => selectedWard == ward.url)}
                onChange={(ev) => {
                    updateWard(ev.value);
                }}
                options={store.wardList.get() as WardBrief[]}
                emptyMessage={
                    store.wardList.get().length == 0 ? progressSpinner : null
                }
                optionLabel="name"
                showClear
                filter
                filterInputAutoFocus
                virtualScrollerOptions={{ itemSize: 38 }}
                placeholder="Select a ward"
            />
        </div>
    );
}
