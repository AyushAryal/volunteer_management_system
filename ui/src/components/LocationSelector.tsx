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

type FederalSelectorProps = {
    value: string | undefined,
    onChange: (value: string | undefined) => void,
}

export function ProvinceSelector({ value, onChange }: FederalSelectorProps) {
    const provinceList = useHookstate(storeState.provinceList);

    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
    return <Dropdown
        value={provinceList.get().find((province) => value == province.url)}
        onChange={(ev) => onChange(ev.value?.url ?? null)}
        options={provinceList.get() as ProvinceBrief[]}
        emptyMessage={provinceList.get().length == 0 ? progressSpinner : null}
        optionLabel="name"
        showClear
        filter
        placeholder="Select a province" />;
}

export function DistrictSelector({ value, onChange }: FederalSelectorProps) {
    const districtList = useHookstate(storeState.districtList);
    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    return <div className="flex flex-column justify-content-center align-content-center">
        <Dropdown
            value={districtList.get().find((d) => value == d.url)}
            onChange={(ev) => { onChange(ev.value?.url ?? null); }}
            options={districtList.get() as DistrictBrief[]}
            emptyMessage={districtList.get().length == 0 ? progressSpinner : null}
            optionLabel="name"
            showClear
            filter
            placeholder="Select a district" />
    </div>;
}

export function MunicipalitySelector({ value, onChange }: FederalSelectorProps) {
    const municipalityList = useHookstate(storeState.municipalityList);
    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    return <div className="flex flex-column justify-content-center align-content-center">
        <Dropdown
            value={municipalityList.get().find((m) => value == m.url)}
            onChange={(ev) => { onChange(ev.value?.url ?? null); }}
            options={municipalityList.get() as MunicipalityBrief[]}
            emptyMessage={municipalityList.get().length == 0 ? progressSpinner : null}
            optionLabel="name"
            showClear
            filter
            placeholder="Select a municipality" />
    </div>;
}


export function WardSelector({ value, onChange }: FederalSelectorProps) {
    const wardList = useHookstate(storeState.wardList);
    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    return <div className="flex flex-column justify-content-center align-content-center">
        <Dropdown
            value={wardList.get().find((w) => value == w.url)}
            onChange={(ev) => { onChange(ev.value?.url ?? null); }}
            options={wardList.get() as WardBrief[]}
            emptyMessage={wardList.get().length == 0 ? progressSpinner : null}
            optionLabel="name"
            showClear
            filter
            placeholder="Select a ward" />
    </div>;
}

type LocationSelectorProps = {
    selectedProvince: string | null,
    onChangeSelectedProvince: (province: string | null) => void,

    selectedDistrict: string | null,
    onChangeSelectedDistrict: (district: string | null) => void,

    selectedMunicipality: string | null,
    onChangeSelectedMunicipality: (municipality: string | null) => void,

    selectedWard: string | null,
    onChangeSelectedWard: (ward: string | null) => void,
};

export function LocationSelector(props: LocationSelectorProps) {
    const store = useHookstate(storeState);

    let provinceList = storeState.provinceList.get() as ProvinceBrief[];
    let districtList = storeState.districtList.get() as DistrictBrief[];
    let municipalityList = storeState.municipalityList.get() as MunicipalityBrief[];
    let wardList = storeState.wardList.get() as WardBrief[];

    const updateProvince = (province: ProvinceBrief | undefined) => {
        props.onChangeSelectedWard(null);
        props.onChangeSelectedMunicipality(null);
        props.onChangeSelectedDistrict(null);
        props.onChangeSelectedProvince(province?.url ?? null);
    };

    const updateDistrict = (district: DistrictBrief | undefined) => {
        props.onChangeSelectedWard(null);
        props.onChangeSelectedMunicipality(null);
        props.onChangeSelectedDistrict(district?.url ?? null);
        let province = provinceList.find((province) => province.url === district?.province);
        if (province !== undefined) {
            props.onChangeSelectedProvince(province?.url ?? null);
        }
    };

    const updateMunicipality = (municipality: MunicipalityBrief | undefined) => {
        props.onChangeSelectedWard(null);
        props.onChangeSelectedMunicipality(municipality?.url ?? null);
        let district = districtList.find((district) => district.url === municipality?.district);
        if (district !== undefined) {
            props.onChangeSelectedDistrict(district?.url ?? null);
            let province = provinceList.find((province) => province.url === district?.province);
            props.onChangeSelectedProvince(province?.url ?? null);
        }
    };

    const updateWard = (ward: WardBrief | undefined) => {
        props.onChangeSelectedWard(ward?.url ?? null);
        let municipality = municipalityList.find((municipality) => municipality.url === ward?.municipality);
        if (municipality !== undefined) {
            props.onChangeSelectedMunicipality(municipality?.url ?? null);
            let district = districtList.find((district) => district.url === municipality?.district);
            props.onChangeSelectedDistrict(district?.url ?? null);
            let province = provinceList.find((province) => province.url === district?.province);
            props.onChangeSelectedProvince(province?.url ?? null);
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
    let districtOptions = calculateOptions(props.selectedProvince, districtList);
    let municipalityOptions = calculateOptions(props.selectedDistrict || props.selectedProvince, municipalityList);
    let wardOptions = calculateOptions(props.selectedMunicipality || props.selectedDistrict || props.selectedProvince, wardList);
    return (
        <div className="flex flex-column justify-content-center align-content-center">
            <Dropdown
                value={store.provinceList
                    .get()
                    .find((province) => props.selectedProvince == province.url)}
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
                    .find((district) => props.selectedDistrict == district.url)}
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
                    .find((municipality) => props.selectedMunicipality == municipality.url)}
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
                    .find((ward) => props.selectedWard == ward.url)}
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
