import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import { SignupProfileInformation } from '@components/signup/SignupProfileInformation';
import { SignupAddressInformation } from '@components/signup/SignupAddressInformation';
import { VolunteerProfile } from '@models/incident';
import { Button } from 'primereact/button';
import { update_volunteer_profile } from '@api/incident';
//import { describeApiErrors, get_id } from '@api/utils';
//import { useHookstate } from '@hookstate/core';
//import { storeState } from '@models/store';
//
async function onVolunteerProfileUpdateSubmit(volunteer: VolunteerProfile, form: any) {
    let response = await update_volunteer_profile(volunteer.url, JSON.stringify(form))
    if (response.status == 200 || response.status == 204) {
        // store.volunteerProfile.set()

    } else {
        //describeApiErrors()
    }
}

type VolunteerProfileUpdateFormProps = {
    volunteer: VolunteerProfile,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}

export function VolunteerProfileUpdate(props: VolunteerProfileUpdateFormProps) {
    const firstNameState = useState(props.volunteer.first_name);
    const lastNameState = useState(props.volunteer.last_name);
    const contactNumberState = useState(props.volunteer.contact_number);
    const dateOfBirthState = useState(props.volunteer.date_of_birth);
    const nationalityState = useState(props.volunteer.nationality);
    const volunteerTypeState = useState(props.volunteer.category);
    const bloodGroupState = useState(props.volunteer.blood_group);
    const genderState = useState(props.volunteer.gender);

    const selectedTemporaryProvinceState = useState("");
    const selectedTemporaryDistrictState = useState("");
    const selectedTemporaryMunicipalityState = useState(props.volunteer.temporary_municipality);
    const selectedPermanentProvinceState = useState("");
    const selectedPermanentDistrictState = useState("");
    const selectedPermanentMunicipalityState = useState(props.volunteer.permanent_municipality);

    const [firstName,] = firstNameState;
    const [lastName,] = lastNameState;
    const [contactNumber,] = contactNumberState;
    const [dateOfBirth,] = dateOfBirthState;
    const [nationality,] = nationalityState;
    const [volunteerType,] = volunteerTypeState;
    const [bloodGroup,] = bloodGroupState;
    const [gender,] = genderState;
    const [selectedTemporaryMunicipality,] = selectedTemporaryMunicipalityState;
    const [selectedPermanentMunicipality,] = selectedPermanentMunicipalityState;

    let form: any = {
        "volunteer": {
            "first_name": firstName,
            "last_name": lastName,
            "contact_number": contactNumber,
            "date_of_birth": dateOfBirth,
            "blood_group": bloodGroup,
            "gender": gender,
            "nationality": nationality,
            "category": volunteerType,
            "temporary_municipality": selectedTemporaryMunicipality,
            "permanent_municipality": selectedPermanentMunicipality,
        }
    };

    return <Dialog
        header={`${firstName} ${lastName}`}
        visible={props.visible}
        style={{ width: '50vw' }}
        onHide={() => { props.setVisible(false); }}>
        <div className="flex flex-column gap-2">
            <h2> Profile Information </h2>
            <SignupProfileInformation
                firstNameState={firstNameState}
                lastNameState={lastNameState}
                contactNumberState={contactNumberState}
                dateOfBirthState={dateOfBirthState}
                nationalityState={nationalityState}
                volunteerTypeState={volunteerTypeState}
                bloodGroupState={bloodGroupState}
                genderState={genderState}
            />
            <h2> Address Information </h2>
            <SignupAddressInformation
                selectedTemporaryProvinceState={selectedTemporaryProvinceState}
                selectedTemporaryDistrictState={selectedTemporaryDistrictState}
                selectedTemporaryMunicipalityState={selectedTemporaryMunicipalityState}
                selectedPermanentProvinceState={selectedPermanentProvinceState}
                selectedPermanentDistrictState={selectedPermanentDistrictState}
                selectedPermanentMunicipalityState={selectedPermanentMunicipalityState}
            />
            <Button
                className="mt-5 align-self-end"
                label="Save"
                onSubmit={() => { onVolunteerProfileUpdateSubmit(props.volunteer, form); }}
            />
        </div>
    </Dialog>;
}
