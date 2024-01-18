import { ImmutableObject, State } from "@hookstate/core";
import { Store } from "./models/store";
import { FederalBody } from "./models/federal";

export function get_selected_local_body(store: State<Store, {}>): ImmutableObject<FederalBody> | undefined {
    const mapControls = store.mapControls;
    if (mapControls.selectedMunicipality.get() !== null) {
        return store.municipalityList.get().find((body) => body.url == mapControls.selectedMunicipality.get());
    } else if (mapControls.selectedDistrict.get() !== null) {
        return store.districtList.get().find((body) => body.url == mapControls.selectedDistrict.get());
    } else if (mapControls.selectedProvince.get() !== null) {
        return store.provinceList.get().find((body) => body.url == mapControls.selectedProvince.get());
    }
}
