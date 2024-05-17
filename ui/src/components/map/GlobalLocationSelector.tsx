import { useEffect, useState } from 'react';
import { useHookstate } from '@hookstate/core';

import { storeState } from '@models/store';

import { LocationSelector } from '@components/LocationSelector';

export function GlobalLocationSelector() {
    const mapControlsSelectedProvince = useHookstate(storeState.mapControls.selectedProvince);
    const mapControlsSelectedDistrict = useHookstate(storeState.mapControls.selectedDistrict);
    const mapControlsSelectedMunicipality = useHookstate(storeState.mapControls.selectedMunicipality);
    const mapControlsSelectedWard = useHookstate(storeState.mapControls.selectedWard);

    const selectedProvinceState = useState<string | null>(mapControlsSelectedProvince.get());
    const selectedDistrictState = useState<string | null>(mapControlsSelectedDistrict.get());
    const selectedMunicipalityState = useState<string | null>(mapControlsSelectedMunicipality.get());
    const selectedWardState = useState<string | null>(mapControlsSelectedWard.get());

    const [selectedProvince,] = selectedProvinceState;
    const [selectedDistrict,] = selectedDistrictState;
    const [selectedMunicipality,] = selectedMunicipalityState;
    const [selectedWard,] = selectedWardState;

    useEffect(() => {
        mapControlsSelectedProvince.set(selectedProvince);
        mapControlsSelectedDistrict.set(selectedDistrict);
        mapControlsSelectedMunicipality.set(selectedMunicipality);
        mapControlsSelectedWard.set(selectedWard);
    }, [selectedProvince, selectedDistrict, selectedMunicipality, selectedWard]);

    return <LocationSelector
        selectedProvinceState={selectedProvinceState}
        selectedDistrictState={selectedDistrictState}
        selectedMunicipalityState={selectedMunicipalityState}
        selectedWardState={selectedWardState}
    />;
}
