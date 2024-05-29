import { useState } from 'react';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Steps } from 'primereact/steps';
import { faUserPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { SignupBasicInformation } from '@components/signup/SignupBasicInformation';

import { signup } from '@api/incident';
import { describe_api_errors } from '@api/utils';
import { AcademicQualification, BloodGroup, Gender, Nationality, TrainingType, Volunteer, VolunteerCategory } from '@models/incident';
import { FormState } from '@api/form.tsx';
import { VolunteerProfileAddressWidget, VolunteerProfileBasicWidget } from '@components/profile/VolunteerProfileWidget';
import { IdentificationDocumentsWidget } from '@components/profile/IdentificationDocumentsWidget';

async function perform_signup(form: Volunteer): Promise<FormState> {

    let body: any = {
        "email": form.email,
        "password": form.password,
        "volunteer": {
            "first_name": form.volunteer.first_name,
            "last_name": form.volunteer.last_name,
            "contact_number": form.volunteer.contact_number,
            "date_of_birth": form.volunteer.date_of_birth?.toISOString().split('T')[0],
            "blood_group": form.volunteer.blood_group,
            "gender": form.volunteer.gender,
            "nationality": form.volunteer.nationality,
            "academicQualification": form.volunteer.academic_qualification,
            "category": form.volunteer.category,
            "temporary_ward": form.volunteer.temporary_ward,
            "permanent_ward": form.volunteer.permanent_ward,
        },
        "citizenship": {
            "id": form.citizenship?.id,
            "registration_district": form.citizenship?.registration_district,
            "registration_date": form.citizenship?.registration_date.toISOString().split('T')[0],
            "image": form.citizenship?.image,
        },
        "national_id": {
            "id": form.national_id?.id,
            "registration_date": form.national_id?.registration_date.toISOString().split('T')[0],
            "image": form.national_id?.image,
        },
        "passport": {
            "id": form.passport?.id,
            "issue_date": form.passport?.issue_date.toISOString().split('T')[0],
            "expiry_date": form.passport?.expiry_date.toISOString().split('T')[0],
            "image": form.passport?.image,
        },
        "other_identification_document": {
            "name": form.other_identification_document?.name,
            "image": form.other_identification_document?.image,
        },
        "certificates": []
    };

    if (!(form.citizenship?.id ||
        form.citizenship?.image ||
        form.citizenship?.registration_date ||
        form.citizenship?.registration_district)) {
        body = Object.fromEntries(Object.entries(body).filter(([k, _]) => k !== "citizenship"));
    }

    if (!(form.passport?.id ||
        form.passport?.image ||
        form.passport?.issue_date ||
        form.passport?.expiry_date)) {
        body = Object.fromEntries(Object.entries(body).filter(([k, _]) => k !== "passport"));
    }

    if (!(form.national_id?.id ||
        form.national_id?.image ||
        form.national_id?.registration_date)
    ) {
        body = Object.fromEntries(Object.entries(body).filter(([k, _]) => k !== "national_id"));
    }

    if (!(form.other_identification_document?.name ||
        form.other_identification_document?.image)
    ) {
        body = Object.fromEntries(Object.entries(body).filter(([k, _]) => k !== "other_identification_document"));
    }

    let response = await signup(JSON.stringify(body));
    if (response.status == 400) {
        return FormState.fromError(describe_api_errors(await response.json()));
    } else if (response.status == 201) {
        return FormState.fromSubmitted(true);
    } else {
        return FormState.fromError("Network failure. Please try again");
    }
}


export function Signup() {
    const emailState = useState("");
    const passwordState = useState("");
    const confirmPasswordState = useState("");

    const firstNameState = useState("");
    const lastNameState = useState("");
    const contactNumberState = useState("");
    const dateOfBirthState = useState<Date>();
    const nationalityState = useState<Nationality | undefined>();
    const volunteerTypeState = useState<VolunteerCategory | undefined>();
    const bloodGroupState = useState<BloodGroup | undefined>();
    const academicQualificationState = useState<AcademicQualification | undefined>();
    const genderState = useState<Gender | undefined>();
    const organizationNameState = useState<string | undefined>();
    const organizationPhoneNumberState = useState<string | undefined>();
    const organizationWebsiteState = useState<string | undefined>();
    const trainingNameState = useState<string | undefined>();
    const trainingSubjectState = useState<string | undefined>();
    const trainingTypeState = useState<TrainingType | undefined>();
    const temporaryWardState = useState<string | null>(null);
    const permanentWardState = useState<string | null>(null);

    const citizenshipIdState = useState<string | undefined>();
    const citizenshipRegistrationDateState = useState<Date | undefined>();
    const citizenshipDistrictState = useState<string | undefined>();
    const citizenshipImageState = useState<string | undefined>();
    const nationalIdState = useState<string | undefined>();
    const nationalIdRegistrationDateState = useState<Date | undefined>();
    const nationalIdImageState = useState<string | undefined>();
    const passportNumberState = useState<string | undefined>();
    const passportIssueDateState = useState<Date | undefined>();
    const passportExpiryDateState = useState<Date | undefined>();
    const passportImageState = useState<string | undefined>();
    const otherIdentificationDocumentNameState = useState<string | undefined>();
    const otherIdentificationDocumentImageState = useState<string | undefined>();

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [formState, setFormState] = useState(FormState.init());
    const [sectionIndex, setSectionIndex] = useState(0);

    const onSubmit = async () => {
        const [email,] = emailState;
        const [password,] = passwordState;
        const [confirmPassword,] = confirmPasswordState;
        const [firstName,] = firstNameState;
        const [lastName,] = lastNameState;
        const [contactNumber,] = contactNumberState;
        const [dateOfBirth,] = dateOfBirthState;
        const [nationality,] = nationalityState;
        const [volunteerType,] = volunteerTypeState;
        const [bloodGroup,] = bloodGroupState;
        const [academicQualification,] = academicQualificationState;
        const [gender,] = genderState;
        const [temporaryWard,] = temporaryWardState;
        const [permanentWard,] = permanentWardState;
        const [organizationName,] = organizationNameState;
        const [organizationPhoneNumber,] = organizationPhoneNumberState;
        const [organizationWebsite,] = organizationWebsiteState;
        const [trainingName,] = trainingNameState;
        const [trainingSubject,] = trainingSubjectState;
        const [trainingType,] = trainingTypeState;

        const [citizenshipId,] = citizenshipIdState
        const [citizenshipRegistrationDate,] = citizenshipRegistrationDateState
        const [citizenshipDistrict,] = citizenshipDistrictState
        const [citizenshipImage,] = citizenshipImageState;
        const [nationalId,] = nationalIdState
        const [nationalIdRegistrationDate,] = nationalIdRegistrationDateState
        const [nationalIdImage,] = nationalIdImageState;
        const [passportNumber,] = passportNumberState
        const [passportIssueDate,] = passportIssueDateState
        const [passportExpiryDate,] = passportExpiryDateState
        const [passportImage,] = passportImageState;
        const [otherIdentificationDocumentName,] = otherIdentificationDocumentNameState;
        const [otherIdentificationDocumentImage,] = otherIdentificationDocumentImageState;

        if (!password || !confirmPassword) {
            setFormState(FormState.fromError("Password cannot be empty"));
            return;
        } else if (password != confirmPassword) {
            setFormState(FormState.fromError("Password is not the same as confirm password"));
            return;
        }

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
            setFormState(FormState.fromError("Citizenship has missing required fields"));
            return;
        }

        if ((nationalId || nationalIdImage || nationalIdRegistrationDate) && !national_id) {
            setFormState(FormState.fromError("National Id has missing required fields"));
            return;
        }

        if ((passportNumber || passportExpiryDate || passportImage || passportIssueDate) && !passport) {
            setFormState(FormState.fromError("Passport has missing required fields"));
            return;
        }

        if ((otherIdentificationDocumentImage || otherIdentificationDocumentName) && !other_identification_document) {
            setFormState(FormState.fromError("Other identification document has missing required fields"));
            return;
        }

        setFormState(await perform_signup({
            email,
            password,
            volunteer: {
                url: "",
                user: "",
                profile_image: "",
                first_name: firstName,
                last_name: lastName,
                contact_number: contactNumber,
                date_of_birth: dateOfBirth,
                blood_group: bloodGroup,
                academic_qualification: academicQualification,
                gender: gender,
                nationality: nationality,
                category: volunteerType,
                temporary_ward: temporaryWard ?? "",
                permanent_ward: permanentWard ?? "",
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
        }));
    };

    let response: undefined | JSX.Element;
    if (formState.hasErrors()) {
        response = <div className="flex flex-row align-items-center">
            {formState.getErrorAsElement()}
        </div >;
    } else if (formState.isSubmitted()) {
        response = <div className="flex flex-row align-items-center mt-5 text-sm text-400" style={{ gap: "0.5rem" }}>
            <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500"
                style={{ fontSize: "2.5rem" }}
            />
            &nbsp; <span> A verification link has been sent to your email. <br /> Please use the link to activate your account. </span>
        </div>;
    }

    const submitAndFormErrors = <div className="flex flex-column w-full align-items-center">
        <div className="flex flex-row align-items-center justify-content-between w-full">
            <div className="text-sm text-400">
                <Checkbox
                    onChange={e => setTermsAccepted(e.checked ?? false)}
                    checked={termsAccepted}
                />
                <span className="ml-2"> Accept Terms & Conditions </span>
            </div>
            <Button
                label="Submit"
                disabled={(!termsAccepted || formState.isSubmitted() && !formState.hasErrors())}
                onClick={onSubmit}
            />
        </div>
        {response}
    </div>;

    const sections = [
        { label: "Profile" },
        { label: "Address" },
        { label: "Identification" },
        { label: "Submit" },
    ]

    const PaginationWrapper = (component: JSX.Element) => {
        return <>
            {component}
            <div className="flex flex-row justify-content-between">
                <Button
                    rounded
                    style={{ "visibility": sectionIndex == 0 ? "hidden" : "visible" }}
                    disabled={sectionIndex == 0}
                    onClick={() => { setSectionIndex(sectionIndex - 1); }}
                >
                    <FontAwesomeIcon icon="arrow-left" />
                </Button>
                <Button
                    rounded
                    style={{ "visibility": sectionIndex >= sections.length - 1 ? "hidden" : "visible" }}
                    disabled={sectionIndex >= sections.length - 1}
                    onClick={() => { setSectionIndex(sectionIndex + 1); }}
                >
                    <FontAwesomeIcon icon="arrow-right" />
                </Button>
            </div>
        </>;
    };

    const sectionComponents = [
        <VolunteerProfileBasicWidget
            firstNameState={firstNameState}
            lastNameState={lastNameState}
            contactNumberState={contactNumberState}
            dateOfBirthState={dateOfBirthState}
            nationalityState={nationalityState}
            volunteerTypeState={volunteerTypeState}
            bloodGroupState={bloodGroupState}
            academicQualificationState={academicQualificationState}
            genderState={genderState}
            organizationNameState={organizationNameState}
            organizationPhoneNumberState={organizationPhoneNumberState}
            organizationWebsiteState={organizationWebsiteState}
            trainingNameState={trainingNameState}
            trainingSubjectState={trainingSubjectState}
            trainingTypeState={trainingTypeState}
        />,
        <VolunteerProfileAddressWidget
            temporaryWardState={temporaryWardState}
            permanentWardState={permanentWardState}
        />,
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
        />,
        <>
            <SignupBasicInformation
                emailState={emailState}
                passwordState={passwordState}
                confirmPasswordState={confirmPasswordState} />
            {submitAndFormErrors}
        </>
    ].map(PaginationWrapper);

    return <div
        className="flex align-items-center py-5"
        style={{
            minHeight: "100vh",
            background: "radial-gradient(var(--red-600) 0%,var(--primary-color) 100%)"
        }}
    >
        <div
            className="mx-auto border-round p-4 px-5"
            style={{
                maxWidth: "60ch",
                minWidth: "60ch",
                backgroundColor: "var(--surface-ground)"
            }}>
            <div className="mx-auto text-center text-2xl mb-5 pb-5 pt-2">
                <span className="font-semibold" style={{ color: "var(--primary-color)" }}>
                    <FontAwesomeIcon icon={faUserPlus} />&nbsp;
                    Sign Up
                </span> As &nbsp;
                <span
                    className="font-semibold"
                    style={{
                        color: "var(--red-600)",
                        borderBottom: "1px solid var(--red-600)"
                    }}
                >
                    Volunteer
                </span>
            </div>
            <div className="flex flex-column justify-content-evenly mx-3" style={{ gap: "2rem" }}>
                <Steps
                    model={sections}
                    activeIndex={sectionIndex}
                    onSelect={(e) => setSectionIndex(e.index)}
                    readOnly={false}
                    pt={{ action: { style: { background: "none" } } }}
                />
                {sectionComponents[sectionIndex]}
            </div>
        </div>
    </div >;
}
