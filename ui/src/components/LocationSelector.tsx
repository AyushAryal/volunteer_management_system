
import { useHookstate } from '@hookstate/core';
import { storeState } from '@models/store';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';

import {
    ProvinceBrief,
    DistrictBrief,
    MunicipalityBrief,
    WardBrief,
    FederalBodyBrief
} from '@models/federal';
import { StateTuple } from '@models/generics';

type Tree = Map<string, Tree | null>;

function constructTree(
    provinces: ProvinceBrief[],
    districts: DistrictBrief[],
    municipalities: MunicipalityBrief[],
    wards: WardBrief[]
): Tree {
    const tree: Tree = new Map();
    function addNode(parent: string, child: string) {
        const parentNode = tree.get(parent);
        if (parentNode === undefined) {
            tree.set(parent, new Map([[child, null]]));
        } else if (parentNode !== null) {
            parentNode.set(child, null);
        }
    }
    provinces.forEach(province => { tree.set(province.url, new Map()); });
    districts.forEach(district => { addNode(district.province, district.url); });
    municipalities.forEach(municipality => { addNode(municipality.district, municipality.url); });
    wards.forEach(ward => { addNode(ward.municipality, ward.url); });
    return tree;
}

function getDescendents(tree: Tree, url: string): string[] {
    const descendants: string[] = [];
    const node = tree.get(url);
    if (node !== undefined && node !== null) {
        for (const [childUrl, _] of node) {
            descendants.push(childUrl);
            const childDescendants = getDescendents(tree, childUrl);
            descendants.push(...childDescendants);
        }
    }
    return descendants;
}

export function ProvinceSelector({ selectedProvinceState }: { selectedProvinceState: StateTuple<string | undefined> }) {
    const provinceList = useHookstate(storeState.provinceList);
    const [selectedProvince, setProvince] = selectedProvinceState;

    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
    return <Dropdown
        value={provinceList.get().find((province) => selectedProvince == province.url)}
        onChange={(ev) => setProvince(ev.value?.url ?? undefined)}
        options={provinceList.get() as ProvinceBrief[]}
        emptyMessage={provinceList.get().length == 0 ? progressSpinner : null}
        optionLabel="name"
        showClear
        filter
        placeholder="Select a province" />;
}

export function DistrictSelector({ label, districtState }: { label: string, districtState: StateTuple<string | undefined> }) {
    const districtList = useHookstate(storeState.districtList);
    const [district, setDistrict] = districtState;
    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    return <div className="flex flex-column justify-content-center align-content-center">
        <Dropdown
            value={districtList.get().find((d) => district == d.url)}
            onChange={(ev) => { setDistrict(ev.value?.url ?? undefined); }}
            options={districtList.get() as DistrictBrief[]}
            emptyMessage={districtList.get().length == 0 ? progressSpinner : null}
            optionLabel="name"
            showClear
            filter
            placeholder={label} />
    </div>;
}

export function MunicipalitySelector({ municipalityState }: { municipalityState: StateTuple<string | undefined> }) {
    const municipalityList = useHookstate(storeState.municipalityList);
    const [municipality, setMunicipality] = municipalityState;
    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    return <div className="flex flex-column justify-content-center align-content-center">
        <Dropdown
            value={municipalityList.get().find((m) => municipality == m.url)}
            onChange={(ev) => { setMunicipality(ev.value?.url ?? undefined); }}
            options={municipalityList.get() as MunicipalityBrief[]}
            emptyMessage={municipalityList.get().length == 0 ? progressSpinner : null}
            optionLabel="name"
            showClear
            filter
            placeholder="Select a municipality" />
    </div>;
}


export function WardSelector({ wardState }: { wardState: StateTuple<string | null> }) {
    const wardList = useHookstate(storeState.wardList);
    const [ward, setWard] = wardState;
    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    return <div className="flex flex-column justify-content-center align-content-center">
        <Dropdown
            value={wardList.get().find((w) => ward == w.url)}
            onChange={(ev) => { setWard(ev.value?.url ?? null); }}
            options={wardList.get() as WardBrief[]}
            emptyMessage={wardList.get().length == 0 ? progressSpinner : null}
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


    let provinceList = storeState.provinceList.get() as ProvinceBrief[];
    let districtList = storeState.districtList.get() as DistrictBrief[];
    let municipalityList = storeState.municipalityList.get() as MunicipalityBrief[];
    let wardList = storeState.wardList.get() as WardBrief[];

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
        let province = provinceList.find((province) => province.url === district?.province);
        if (province !== undefined) {
            setProvince(province?.url ?? null);
        }
    };

    const updateMunicipality = (municipality: MunicipalityBrief | undefined) => {
        setWard(null);
        setMunicipality(municipality?.url ?? null);
        let district = districtList.find((district) => district.url === municipality?.district);
        if (district !== undefined) {
            setDistrict(district?.url ?? null);
            let province = provinceList.find((province) => province.url === district?.province);
            setProvince(province?.url ?? null);
        }
    };

    const updateWard = (ward: WardBrief | undefined) => {
        setWard(ward?.url ?? null);
        let municipality = municipalityList.find((municipality) => municipality.url === ward?.municipality);
        if (municipality !== undefined) {
            setMunicipality(municipality?.url ?? null);
            let district = districtList.find((district) => district.url === municipality?.district);
            setDistrict(district?.url ?? null);
            let province = provinceList.find((province) => province.url === district?.province);
            setProvince(province?.url ?? null);
        }
    };

    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    let tree = constructTree(
        provinceList,
        districtList,
        municipalityList,
        wardList,
    );

    let calculateOptions = (nearestSelectedParent: string | null, federalBodyOptions: FederalBodyBrief[]) => {
        if (nearestSelectedParent) {
            let descendents = getDescendents(tree, nearestSelectedParent);
            let newFederalBodyOptions = federalBodyOptions.filter(item => descendents.includes(item.url)).slice();
            if (newFederalBodyOptions.length !== 0) return newFederalBodyOptions;
        }
        return federalBodyOptions;
    }

    let provinceOptions = calculateOptions(null, provinceList);
    let districtOptions = calculateOptions(selectedProvince, districtList);
    let municipalityOptions = calculateOptions(selectedDistrict || selectedProvince, municipalityList);
    let wardOptions = calculateOptions(selectedMunicipality || selectedDistrict || selectedProvince, wardList);
    return (
        <div className="flex flex-column justify-content-center align-content-center">
            <Dropdown
                value={store.provinceList
                    .get()
                    .find((province) => selectedProvince == province.url)}
                onChange={(ev) => {
                    updateProvince(ev.value);
                }}
                options={provinceOptions}
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
                options={districtOptions}
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
                options={municipalityOptions}
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
                options={wardOptions}
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
