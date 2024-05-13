import { ImmutableObject, State } from "@hookstate/core";
import { Store } from "./models/store";
import { FederalBodyBrief } from "./models/federal";

export function get_selected_federal_list(store: State<Store, {}>): ImmutableObject<FederalBodyBrief[]> | undefined {
    const mapControls = store.mapControls;
    if (mapControls.selectedMunicipality.get() !== null) {
        return store.municipalityList.get();
    } else if (mapControls.selectedDistrict.get() !== null) {
        return store.districtList.get();
    } else if (mapControls.selectedProvince.get() !== null) {
        return store.provinceList.get();
    }
}

export function get_selected_local_body(store: State<Store, {}>): ImmutableObject<FederalBodyBrief> | undefined {
    const mapControls = store.mapControls;
    if (mapControls.selectedWard.get() !== null) {
        return store.wardList.get().find((body) => body.url == mapControls.selectedWard.get());
    } else if (mapControls.selectedMunicipality.get() !== null) {
        return store.municipalityList.get().find((body) => body.url == mapControls.selectedMunicipality.get());
    } else if (mapControls.selectedDistrict.get() !== null) {
        return store.districtList.get().find((body) => body.url == mapControls.selectedDistrict.get());
    } else if (mapControls.selectedProvince.get() !== null) {
        return store.provinceList.get().find((body) => body.url == mapControls.selectedProvince.get());
    }
}

function titleCase(s: string) {
    return s.replace(/^[-_]*(.)/, (_, c) => c.toUpperCase())
        .replace(/[-_]+(.)/g, (_, c) => ' ' + c.toUpperCase());
}

export function deepFlatten(o: object, prefix = ''): Map<string, string | object> {
    return Object.entries(o).reduce((acc, [k, v]) => {
        const pre = prefix.length ? prefix + '_' : '';
        if (typeof v === 'object' && !Array.isArray(v) && v !== null) {
            let childMap = deepFlatten(v, pre + k);
            return new Map([...childMap, ...acc]);
        } else if (Array.isArray(v)) {
            acc.set(titleCase(pre + k), v);
        }
        return acc;
    }, new Map<string, string | object>());
}
