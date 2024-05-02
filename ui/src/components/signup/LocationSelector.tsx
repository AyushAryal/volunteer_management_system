
import { useHookstate } from '@hookstate/core';
import { storeState } from '@models/store';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';

import {
    Province,
    District,
    Municipality
} from '@models/federal';
import { StateTuple } from '@models/generics';

type LocationSelectorProps = {
    selectedProvinceState: StateTuple<string>,
    selectedDistrictState: StateTuple<string>,
    selectedMunicipalityState: StateTuple<string>,
};

export function LocationSelector(props: LocationSelectorProps) {
    const store = useHookstate(storeState);
    const {
        selectedProvinceState,
        selectedDistrictState,
        selectedMunicipalityState,
    } = props;

    const [selectedProvince, setProvince] = selectedProvinceState;
    const [selectedDistrict, setDistrict] = selectedDistrictState;
    const [selectedMunicipality, setMunicipality] = selectedMunicipalityState;

    const updateProvince = (province: Province | undefined) => {
        setMunicipality("");
        setDistrict("");
        setProvince(province?.url ?? "");
    };

    const updateDistrict = (district: District | undefined) => {
        setMunicipality("");
        setDistrict(district?.url ?? "");
        let province = store.provinceList.get().find((province) => province.url === district?.province);
        if (province !== undefined) {
            setProvince(province?.url ?? "");
        }
    };

    const updateMunicipality = (municipality: Municipality | undefined) => {
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
                value={store.provinceList.get().find((province) => selectedProvince == province.url)}
                onChange={(ev) => { updateProvince(ev.value); }}
                options={store.provinceList.get() as Province[]}
                emptyMessage={store.provinceList.get().length == 0 ? progressSpinner : null}
                optionLabel="name"
                showClear
                placeholder="Select a province"
            />
            <Dropdown
                value={store.districtList.get().find((district) => selectedDistrict == district.url)}
                onChange={(ev) => { updateDistrict(ev.value); }}
                options={store.districtList.get() as District[]}
                emptyMessage={store.districtList.get().length == 0 ? progressSpinner : null}
                optionLabel="name"
                showClear
                filter
                placeholder="Select a district" />
            <Dropdown
                value={store.municipalityList.get().find((municipality) => selectedMunicipality == municipality.url)}
                onChange={(ev) => { updateMunicipality(ev.value); }}
                options={store.municipalityList.get() as Municipality[]}
                emptyMessage={store.municipalityList.get().length == 0 ? progressSpinner : null}
                optionLabel="name"
                showClear
                filter
                placeholder="Select a municipality"
            />
        </div>
    );
}
