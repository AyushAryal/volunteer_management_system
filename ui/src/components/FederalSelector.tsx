import { useState } from 'react';
import { useHookstate } from '@hookstate/core';

import { Dropdown } from 'primereact/dropdown';
import { ProgressSpinner } from 'primereact/progressspinner';
import {
    Province,
    District,
    Municipality
} from '../api/federal';
import { g_provinceList, g_districtList, g_municipalityList, g_currentProvince, g_currentDistrict, g_currentMunicipality } from '../api/state';

import { Button } from 'primereact/button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';


export function FederalSelector() {
    const [expanded, setExpanded] = useState<boolean>(false);

    const provinceList = useHookstate(g_provinceList);
    const districtList = useHookstate(g_districtList);
    const municipalityList = useHookstate(g_municipalityList);

    const currentProvince = useHookstate(g_currentProvince);
    const currentDistrict = useHookstate(g_currentDistrict);
    const currentMunicipality = useHookstate(g_currentMunicipality);

    const updateProvince = (province: Province | undefined) => {
        currentMunicipality.set(() => null);
        currentDistrict.set(() => null);
        currentProvince.set(() => province?.url ?? null);
    };

    const updateDistrict = (district: District | undefined) => {
        currentMunicipality.set(() => null);
        currentDistrict.set(() => district?.url ?? null);
        let province = provinceList.get().find((province) => province.url === district?.province);
        if (province !== undefined) {
            currentProvince.set(() => province?.url ?? null);
        }
    };

    const updateMunicipality = (municipality: Municipality | undefined) => {
        currentMunicipality.set(() => municipality?.url ?? null);
        let district = districtList.get().find((district) => district.url === municipality?.district);
        if (district !== undefined) {
            currentDistrict.set(() => district?.url ?? null);
            let province = provinceList.get().find((province) => province.url === district?.province);
            currentProvince.set(() => province?.url ?? null);
        }
    };


    const expanded_icon = <Button
        rounded
        onClick={() => { setExpanded(!expanded); }}>
        <FontAwesomeIcon icon="filter"></FontAwesomeIcon>
    </Button>;


    if (!expanded) { return expanded_icon; }
    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    return (
        <div className="flex flex-column justify-content-center align-content-center">
            <Button
                rounded
                label="Filter"
                onClick={() => setExpanded(!expanded)}>
                <FontAwesomeIcon icon="filter"></FontAwesomeIcon>
            </Button>
            <Dropdown
                value={provinceList.get().find((province) => currentProvince.get() == province.url)}
                onChange={(ev) => { updateProvince(ev.value); }}
                options={provinceList.get() as Province[]}
                emptyMessage={provinceList.get().length == 0 ? progressSpinner : null}
                optionLabel="name"
                showClear
                placeholder="Select a province"
                className="w-full md:w-20rem" />
            <Dropdown
                value={districtList.get().find((district) => currentDistrict.get() == district.url)}
                onChange={(ev) => { updateDistrict(ev.value); }}
                options={districtList.get() as District[]}
                emptyMessage={districtList.get().length == 0 ? progressSpinner : null}
                optionLabel="name"
                showClear
                filter
                placeholder="Select a district" className="w-full md:w-20rem" />
            <Dropdown
                value={municipalityList.get().find((municipality) => currentMunicipality.get() == municipality.url)}
                onChange={(ev) => { updateMunicipality(ev.value); }}
                options={municipalityList.get() as Municipality[]}
                emptyMessage={municipalityList.get().length == 0 ? progressSpinner : null}
                optionLabel="name"
                showClear
                filter
                placeholder="Select a municipality"
                className="w-full md:w-20rem" />
        </div >
    );
}
