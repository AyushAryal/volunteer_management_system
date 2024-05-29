import { Dialog } from 'primereact/dialog';
import { useState } from 'react';
import {
    TrainingType,
    Volunteer,
    VolunteerDeserializer,
} from '@models/incident';
import { Button } from 'primereact/button';
import { update_volunteer_profile } from '@api/incident';
import { describe_api_errors } from '@api/utils';
import { useHookstate } from '@hookstate/core';
import { storeState } from '@models/store';
import { VolunteerProfileWidget } from './VolunteerProfileWidget';
import { IdentificationDocumentsWidget } from './IdentificationDocumentsWidget';

async function perform_volunteer_update(volunteer: Volunteer): Promise<string | Volunteer> {
    let form = {
        "volunteer": {
            "first_name": volunteer.volunteer.first_name,
            "last_name": volunteer.volunteer.last_name,
            "contact_number": volunteer.volunteer.contact_number,
            "date_of_birth": volunteer.volunteer.date_of_birth?.toISOString().split('T')[0],
            "nationality": volunteer.volunteer.nationality,
            "category": volunteer.volunteer.category,
            "blood_group": volunteer.volunteer.blood_group,
            "academic_qualification": volunteer.volunteer.academic_qualification,
            "gender": volunteer.volunteer.gender,
            "temporary_ward": volunteer.volunteer.temporary_ward,
            "permanent_ward": volunteer.volunteer.permanent_ward,
            "organization_name": volunteer.volunteer.organization_name,
            "organization_phone_number": volunteer.volunteer.organization_phone_number,
            "organization_website": volunteer.volunteer.organization_website,
            "training_name": volunteer.volunteer.training_name,
            "training_subject": volunteer.volunteer.training_subject,
            "training_type": volunteer.volunteer.training_type,
        },
        "citizenship": {
            "id": volunteer.citizenship?.id,
            "registration_date": volunteer.citizenship?.registration_date.toISOString().split('T')[0],
            "registration_district": volunteer.citizenship?.registration_district,
            "image": volunteer.citizenship?.image,
        },
        "passport": {
            "id": volunteer.passport?.id,
            "issue_date": volunteer.passport?.issue_date.toISOString().split('T')[0],
            "expiry_date": volunteer.passport?.expiry_date.toISOString().split('T')[0],
            "image": volunteer.passport?.image,
        },
        "national_id": {
            "id": volunteer.national_id?.id,
            "registration_date": volunteer.national_id?.registration_date.toISOString().split('T')[0],
            "image": volunteer.national_id?.image,
        },
        "other_identification_document": {
            "name": volunteer.other_identification_document?.name,
            "image": volunteer.other_identification_document?.image,
        },
    }

    let response = await update_volunteer_profile(volunteer.volunteer.url, JSON.stringify(form));
    if (response.status == 200 || response.status == 204) {
        return VolunteerDeserializer(await response.json());
    } else if (response.status == 400) {
        return describe_api_errors(await response.json());
    } else {
        return "Network failure. Please try again";
    }
}


type VolunteerUpdateFormProps = {
    volunteer: Volunteer,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}

export function VolunteerUpdateForm(props: VolunteerUpdateFormProps) {
    const volunteer = useHookstate(storeState.volunteer);

    const firstNameState = useState(props.volunteer.volunteer.first_name);
    const lastNameState = useState(props.volunteer.volunteer.last_name);
    const contactNumberState = useState(props.volunteer.volunteer.contact_number);
    const dateOfBirthState = useState(props.volunteer.volunteer.date_of_birth);
    const nationalityState = useState(props.volunteer.volunteer.nationality);
    const volunteerTypeState = useState(props.volunteer.volunteer.category);
    const bloodGroupState = useState(props.volunteer.volunteer.blood_group);
    const academicQualificationState = useState(props.volunteer.volunteer.academic_qualification);
    const genderState = useState(props.volunteer.volunteer.gender);
    const temporaryWardState = useState<string | null>(props.volunteer.volunteer.temporary_ward);
    const permanentWardState = useState<string | null>(props.volunteer.volunteer.permanent_ward);
    const organizationNameState = useState<string | undefined>(props.volunteer.volunteer.organization_website);
    const organizationPhoneNumberState = useState<string | undefined>(props.volunteer.volunteer.organization_phone_number);
    const organizationWebsiteState = useState<string | undefined>(props.volunteer.volunteer.organization_website);
    const trainingNameState = useState<string | undefined>(props.volunteer.volunteer.training_name);
    const trainingSubjectState = useState<string | undefined>(props.volunteer.volunteer.training_subject);
    const trainingTypeState = useState<TrainingType | undefined>(props.volunteer.volunteer.training_type);

    const citizenshipIdState = useState(props.volunteer.citizenship?.id);
    const citizenshipRegistrationDateState = useState(props.volunteer.citizenship?.registration_date);
    const citizenshipDistrictState = useState(props.volunteer.citizenship?.registration_district);
    const citizenshipImageState = useState(props.volunteer.citizenship?.image);
    const nationalIdState = useState(props.volunteer.national_id?.id);
    const nationalIdRegistrationDateState = useState(props.volunteer.national_id?.registration_date);
    const nationalIdImageState = useState(props.volunteer.national_id?.image);
    const passportNumberState = useState(props.volunteer.passport?.id);
    const passportIssueDateState = useState(props.volunteer.passport?.issue_date);
    const passportExpiryDateState = useState(props.volunteer.passport?.expiry_date);
    const passportImageState = useState(props.volunteer.passport?.image);
    const otherIdentificationDocumentNameState = useState(props.volunteer.other_identification_document?.name);
    const otherIdentificationDocumentImageState = useState(props.volunteer.other_identification_document?.image);

    const [firstName,] = firstNameState;
    const [lastName,] = lastNameState;
    const [contactNumber,] = contactNumberState;
    const [dateOfBirth,] = dateOfBirthState;
    const [nationality,] = nationalityState;
    const [volunteerType,] = volunteerTypeState;
    const [bloodGroup,] = bloodGroupState;
    const [academicQualification,] = academicQualificationState;
    const [gender,] = genderState;
    const [selectedTemporaryWard,] = temporaryWardState;
    const [selectedPermanentWard,] = permanentWardState;
    const [organizationName,] = organizationNameState;
    const [organizationPhoneNumber,] = organizationPhoneNumberState;
    const [organizationWebsite,] = organizationWebsiteState;
    const [trainingName,] = trainingNameState;
    const [trainingSubject,] = trainingSubjectState;
    const [trainingType,] = trainingTypeState;
    const [formErrors, setFormErrors] = useState<string | boolean>(false);

    const [citizenshipId,] = citizenshipIdState;
    const [citizenshipRegistrationDate,] = citizenshipRegistrationDateState;
    const [citizenshipDistrict,] = citizenshipDistrictState;
    const [citizenshipImage,] = citizenshipImageState;
    const [nationalId,] = nationalIdState;
    const [nationalIdRegistrationDate,] = nationalIdRegistrationDateState;
    const [nationalIdImage,] = nationalIdImageState;
    const [passportNumber,] = passportNumberState;
    const [passportIssueDate,] = passportIssueDateState;
    const [passportExpiryDate,] = passportExpiryDateState;
    const [passportImage,] = passportImageState;
    const [otherIdentificationDocumentName,] = otherIdentificationDocumentNameState;
    const [otherIdentificationDocumentImage,] = otherIdentificationDocumentImageState;


    const onSubmit = async () => {
        let citizenship = citizenshipId && citizenshipRegistrationDate && citizenshipImage && citizenshipDistrict ? {
            id: citizenshipId,
            registration_date: citizenshipRegistrationDate,
            registration_district: citizenshipDistrict,
            image: citizenshipImage,
        } : undefined;

        let passport = passportNumber && passportExpiryDate && passportIssueDate && passportImage ? {
            id: passportNumber,
            issue_date: passportIssueDate,
            expiry_date: passportExpiryDate,
            image: passportImage,
        } : undefined;

        let national_id = nationalId && nationalIdRegistrationDate && nationalIdImage ? {
            id: nationalId,
            registration_date: nationalIdRegistrationDate,
            image: nationalIdImage,
        } : undefined;

        let other_identification_document = otherIdentificationDocumentImage && otherIdentificationDocumentName ? {
            name: otherIdentificationDocumentName,
            image: otherIdentificationDocumentImage,
        } : undefined;

        if ((citizenshipDistrict || citizenshipId || citizenshipRegistrationDate || citizenshipImage) && !citizenship) {
            setFormErrors("Citizenship has missing required fields");
            return;
        }

        if ((nationalId || nationalIdImage || nationalIdRegistrationDate) && !national_id) {
            setFormErrors("National Id has missing required fields");
            return;
        }

        if ((passportNumber || passportExpiryDate || passportImage || passportIssueDate) && !passport) {
            setFormErrors("Passport has missing required fields");
            return;
        }

        if ((otherIdentificationDocumentImage || otherIdentificationDocumentName) && !other_identification_document) {
            setFormErrors("Other identification document has missing required fields");
            return;
        }

        let newProfile = await perform_volunteer_update({
            email: "",
            password: "",
            volunteer: {
                url: props.volunteer.volunteer.url,
                user: props.volunteer.volunteer.user,
                profile_image: props.volunteer.volunteer.profile_image,
                first_name: firstName,
                last_name: lastName,
                contact_number: contactNumber,
                date_of_birth: dateOfBirth,
                blood_group: bloodGroup,
                academic_qualification: academicQualification,
                gender,
                nationality,
                category: volunteerType,
                temporary_ward: selectedTemporaryWard ?? "",
                permanent_ward: selectedPermanentWard ?? "",
                organization_name: organizationName,
                organization_phone_number: organizationPhoneNumber,
                organization_website: organizationWebsite,
                training_name: trainingName,
                training_subject: trainingSubject,
                training_type: trainingType,
            },
            citizenship,
            passport,
            national_id,
            other_identification_document,
            certificates: []
        });
        if (typeof newProfile === "object") {
            volunteer.set(newProfile);
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
                        src={props.volunteer.volunteer.profile_image}
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
            <VolunteerProfileWidget
                firstNameState={firstNameState}
                lastNameState={lastNameState}
                contactNumberState={contactNumberState}
                dateOfBirthState={dateOfBirthState}
                nationalityState={nationalityState}
                volunteerTypeState={volunteerTypeState}
                bloodGroupState={bloodGroupState}
                academicQualificationState={academicQualificationState}
                genderState={genderState}
                temporaryWardState={temporaryWardState}
                permanentWardState={permanentWardState}
                organizationNameState={organizationNameState}
                organizationPhoneNumberState={organizationPhoneNumberState}
                organizationWebsiteState={organizationWebsiteState}
                trainingNameState={trainingNameState}
                trainingSubjectState={trainingSubjectState}
                trainingTypeState={trainingTypeState}
            />
            <h2> Identification </h2>
            <IdentificationDocumentsWidget
                citizenshipIdState={citizenshipIdState}
                citizenshipRegistrationDateState={citizenshipRegistrationDateState}
                citizenshipDistrictState={citizenshipDistrictState}
                citizenshipImageState={citizenshipImageState}
                nationalIdState={nationalIdState}
                nationalIdRegistrationDateState={nationalIdRegistrationDateState}
                nationalIdImageState={nationalIdImageState}
                passportNumberState={passportNumberState}
                passportIssueDateState={passportIssueDateState}
                passportExpiryDateState={passportExpiryDateState}
                passportImageState={passportImageState}
                otherIdentificationDocumentNameState={otherIdentificationDocumentNameState}
                otherIdentificationDocumentImageState={otherIdentificationDocumentImageState}
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
