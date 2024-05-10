import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import { SignupProfileInformation } from '@components/signup/SignupProfileInformation';
import { SignupAddressInformation } from '@components/signup/SignupAddressInformation';
import { BloodGroup, Gender, Nationality, VolunteerCategory, VolunteerProfile } from '@models/incident';
import { Button } from 'primereact/button';
import { update_volunteer_profile } from '@api/incident';
import { describe_api_errors } from '@api/utils';
import { useHookstate } from '@hookstate/core';
import { storeState } from '@models/store';

type VolunteerProfileForm = {
    firstName: string,
    lastName: string,
    contactNumber: string,
    dateOfBirth: string,
    nationality: Nationality,
    volunteerType: VolunteerCategory,
    bloodGroup: BloodGroup,
    gender: Gender,
    temporaryMunicipality: string,
    permanentMunicipality: string,
}

async function perform_volunteer_profile_update(url: string, form: VolunteerProfileForm): Promise<string | VolunteerProfile> {
    let response = await update_volunteer_profile(url, JSON.stringify({
        "volunteer": {
            "first_name": form.firstName,
            "last_name": form.lastName,
            "contact_number": form.contactNumber,
            "date_of_birth": form.dateOfBirth,
            "nationality": form.nationality,
            "volunteer_type": form.volunteerType,
            "blood_group": form.bloodGroup,
            "gender": form.gender,
            "temporary_municipality": form.temporaryMunicipality,
            "permanent_municipality": form.permanentMunicipality,
        }
    }));
    if (response.status == 200 || response.status == 204) {
        return await response.json();
    } else if (response.status == 400) {
        return describe_api_errors(await response.json());
    } else {
        return "Network failure. Please try again";
    }
}

type VolunteerProfileUpdateFormProps = {
    volunteer: VolunteerProfile,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}

export function VolunteerProfileUpdate(props: VolunteerProfileUpdateFormProps) {
    const volunteerProfile = useHookstate(storeState.volunteerProfile);

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
    const [formErrors, setFormErrors] = useState<string | boolean>(false);

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


    const onSubmit = async () => {
        let newProfile = await perform_volunteer_profile_update(props.volunteer.url, {
            firstName,
            lastName,
            contactNumber,
            dateOfBirth,
            bloodGroup,
            gender,
            nationality,
            volunteerType,
            temporaryMunicipality: selectedTemporaryMunicipality,
            permanentMunicipality: selectedPermanentMunicipality,
        });
        if (typeof newProfile === "object") {
            volunteerProfile.set(newProfile);
            setFormErrors(true);
        } else {
            setFormErrors(newProfile);
        }
    };

    let response;
    if (formErrors === true) {
        response = <div
            style={{ color: "var(--green-600)", fontWeight: "bold" }}
            className="my-2"
        >
            <span>Profile Updated!</span>
        </div>
    } else if (typeof formErrors === "string") {
        response = <div className="flex flex-row align-items-center">
            <pre style={{ whiteSpace: "pre-wrap", color: "var(--red-600)", fontWeight: "bold" }}>
                {formErrors}
            </pre>
        </div >;
    }

    return <Dialog
        visible={props.visible}
        style={{ width: '50vw' }}
        onHide={() => { props.setVisible(false); }}>
        <div className="flex flex-column gap-2">
            <div className="flex gap-5 align-items-center mb-4">
                <div className="flex flex-column justify-content-center align-items-center">
                    <img
                        onClick={() => { alert("Change image not implemented") }}
                        className="shadow-4 mb-2"
                        src={props.volunteer.profile_image}
                        style={{
                            width: "8rem",
                            height: "8rem",
                            objectFit: "cover",
                            borderRadius: "100%"
                        }}
                    />
                </div>
                <h1>{`${firstName} ${lastName}`}</h1>
            </div>

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
            <div className="flex gap-4 align-self-end align-items-center mt-5">
                {response}
                <Button
                    label="Save"
                    onClick={onSubmit}
                />
            </div>
        </div>
    </Dialog>;
}
