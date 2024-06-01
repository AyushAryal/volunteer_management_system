import { useHookstate } from '@hookstate/core';

import { storeState } from '@models/store';

import { LocationSelector } from '@components/LocationSelector';

export function GlobalLocationSelector() {
    const mapControlsSelectedProvince = useHookstate(storeState.mapControls.selectedProvince);
    const mapControlsSelectedDistrict = useHookstate(storeState.mapControls.selectedDistrict);
    const mapControlsSelectedMunicipality = useHookstate(storeState.mapControls.selectedMunicipality);
    const mapControlsSelectedWard = useHookstate(storeState.mapControls.selectedWard);

    return <LocationSelector
        selectedProvince={mapControlsSelectedProvince.get()}
        onChangeSelectedProvince={(value) => mapControlsSelectedProvince.set(value)}
        selectedDistrict={mapControlsSelectedDistrict.get()}
        onChangeSelectedDistrict={(value) => mapControlsSelectedDistrict.set(value)}
        selectedMunicipality={mapControlsSelectedMunicipality.get()}
        onChangeSelectedMunicipality={(value) => mapControlsSelectedMunicipality.set(value)}
        selectedWard={mapControlsSelectedWard.get()}
        onChangeSelectedWard={(value) => mapControlsSelectedWard.set(value)}
    />;
}
