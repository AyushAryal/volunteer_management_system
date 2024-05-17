import { LocationSelector } from '@components/LocationSelector';
import { StateTuple } from '@models/generics';

type SignupAddressInformationProps = {
    selectedTemporaryProvinceState: StateTuple<string | null>,
    selectedTemporaryDistrictState: StateTuple<string | null>,
    selectedTemporaryMunicipalityState: StateTuple<string | null>,
    selectedTemporaryWardState: StateTuple<string | null>,
    selectedPermanentProvinceState: StateTuple<string | null>,
    selectedPermanentDistrictState: StateTuple<string | null>,
    selectedPermanentMunicipalityState: StateTuple<string | null>,
    selectedPermanentWardState: StateTuple<string | null>,
};

export function SignupAddressInformation(props: SignupAddressInformationProps) {

    const {
        selectedTemporaryProvinceState,
        selectedTemporaryDistrictState,
        selectedTemporaryMunicipalityState,
        selectedTemporaryWardState,
        selectedPermanentProvinceState,
        selectedPermanentDistrictState,
        selectedPermanentMunicipalityState,
        selectedPermanentWardState,
    } = props;

    const temporaryLocationSelector = <LocationSelector
        selectedProvinceState={selectedTemporaryProvinceState}
        selectedDistrictState={selectedTemporaryDistrictState}
        selectedMunicipalityState={selectedTemporaryMunicipalityState}
        selectedWardState={selectedTemporaryWardState}
    />;

    const permanentLocationSelector = <LocationSelector
        selectedProvinceState={selectedPermanentProvinceState}
        selectedDistrictState={selectedPermanentDistrictState}
        selectedMunicipalityState={selectedPermanentMunicipalityState}
        selectedWardState={selectedPermanentWardState}
    />;

    return <div className="flex flex-column w-full" style={{ gap: "1rem" }}>
        Current Address
        {temporaryLocationSelector}
        Permanent Address
        {permanentLocationSelector}
    </div>;

}
