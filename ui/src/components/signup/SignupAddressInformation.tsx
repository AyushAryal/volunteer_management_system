import { LocationSelector } from '@components/signup/LocationSelector';
import { StateTuple } from '@models/generics';

type SignupAddressInformationProps = {
    selectedTemporaryProvinceState: StateTuple<string>,
    selectedTemporaryDistrictState: StateTuple<string>,
    selectedTemporaryMunicipalityState: StateTuple<string>,
    selectedTemporaryWardState: StateTuple<string>,
    selectedPermanentProvinceState: StateTuple<string>,
    selectedPermanentDistrictState: StateTuple<string>,
    selectedPermanentMunicipalityState: StateTuple<string>,
    selectedPermanentWardState: StateTuple<string>,
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
