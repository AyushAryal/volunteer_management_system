import { useState } from 'react';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Steps } from 'primereact/steps';
import { faUserPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { SignupAddressInformation } from '@components/signup/SignupAddressInformation';
import { SignupBasicInformation } from '@components/signup/SignupBasicInformation';
import { SignupProfileInformation } from '@components/signup/SignupProfileInformation';
import { SignupIdentification } from '@components/signup/SignupIdentification';

import { signup } from '@api/incident';
import { describe_api_errors } from '@api/utils';
import { BloodGroup, Gender, Nationality, VolunteerCategory } from '@models/incident';
import { FormState } from '@api/form.tsx';

const toBase64 = (file: File): Promise<ArrayBuffer | null> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = () => resolve(reader.result as ArrayBuffer | null);
        reader.onerror = (error) => reject(error);
    });

function arrayBufferToBase64(buffer: ArrayBuffer): string {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

type VolunteerSignupForm = {
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
    contactNumber: string,
    dateOfBirth: string,
    nationality: Nationality,
    volunteerType: VolunteerCategory,
    bloodGroup: BloodGroup,
    gender: Gender,
    selectedTemporaryWard: string,
    selectedPermanentWard: string,
    citizenshipId: string,
    citizenshipRegistrationDate: string,
    citizenshipDistrict: string,
    citizenshipUpload: string,
    nationalId: string,
    nationalIdRegistrationDate: string,
    nationalIdUpload: string,
    passportNumber: string,
    passportIssueDate: string,
    passportExpiryDate: string,
    passportUpload: string,
};

async function perform_signup(form: VolunteerSignupForm): Promise<FormState> {
    const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        contactNumber,
        dateOfBirth,
        nationality,
        volunteerType,
        bloodGroup,
        gender,
        selectedTemporaryWard,
        selectedPermanentWard,
        citizenshipId,
        citizenshipRegistrationDate,
        citizenshipDistrict,
        citizenshipUpload,
        nationalId,
        nationalIdRegistrationDate,
        nationalIdUpload,
        passportNumber,
        passportIssueDate,
        passportExpiryDate,
        passportUpload,
    } = form;

    if (!password || !confirmPassword) {
        return FormState.fromError("Password cannot be empty");
    } else if (password != confirmPassword) {
        return FormState.fromError("Password is not the same as confirm password");
    } else {
        let body: any = {
            "email": email,
            "password": password,
            "volunteer": {
                "first_name": firstName,
                "last_name": lastName,
                "contact_number": contactNumber,
                "date_of_birth": dateOfBirth,
                "blood_group": bloodGroup,
                "gender": gender,
                "nationality": nationality,
                "category": volunteerType,
                "temporary_ward": selectedTemporaryWard,
                "permanent_ward": selectedPermanentWard,
            },
            "citizenship": {
                "id": citizenshipId,
                "registration_district": citizenshipDistrict,
                "registration_date": citizenshipRegistrationDate,
                "image": citizenshipUpload,
            },
            "national_id": {
                "id": nationalId,
                "registration_date": nationalIdRegistrationDate,
                "image": nationalIdUpload,
            },
            "passport": {
                "id": passportNumber,
                "issue_date": passportIssueDate,
                "expiry_date": passportExpiryDate,
                "image": passportUpload,
            }
        };

        if (citizenshipId.length + citizenshipDistrict.length + citizenshipRegistrationDate.length === 0) {
            body = Object.fromEntries(Object.entries(body).filter(([k, _]) => k !== "citizenship"));
        }
        if (nationalId.length + nationalIdRegistrationDate.length === 0) {
            body = Object.fromEntries(Object.entries(body).filter(([k, _]) => k !== "national_id"));
        }
        if (passportNumber.length + passportIssueDate.length + passportExpiryDate.length === 0) {
            body = Object.fromEntries(Object.entries(body).filter(([k, _]) => k !== "passport"));
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
}


export function Signup() {
    const emailState = useState("");
    const passwordState = useState("");
    const confirmPasswordState = useState("");

    const firstNameState = useState("");
    const lastNameState = useState("");
    const contactNumberState = useState("");
    const dateOfBirthState = useState("");
    const nationalityState = useState<Nationality>("National");
    const volunteerTypeState = useState<VolunteerCategory>("General");
    const bloodGroupState = useState<BloodGroup>("O Positive");
    const genderState = useState<Gender>("Male");

    const selectedTemporaryProvinceState = useState("");
    const selectedTemporaryDistrictState = useState("");
    const selectedTemporaryMunicipalityState = useState("");
    const selectedTemporaryWardState = useState("");
    const selectedPermanentProvinceState = useState("");
    const selectedPermanentDistrictState = useState("");
    const selectedPermanentMunicipalityState = useState("");
    const selectedPermanentWardState = useState("");

    const citizenshipIdState = useState("");
    const citizenshipRegistrationDateState = useState("")
    const citizenshipUploadState = useState<File>(new File([""], ""));
    const citizenshipDistrictState = useState("");
    const nationalIdState = useState("");
    const nationalIdRegistrationdateState = useState("");
    const nationalIdUploadState = useState<File>(new File([""], ""));
    const passportNumberState = useState("");
    const passportIssueDateState = useState("");
    const passportExpiryDateState = useState("");
    const passportUploadState = useState<File>(new File([""], ""));

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
        const [gender,] = genderState;
        const [selectedTemporaryWard,] = selectedTemporaryWardState;
        const [selectedPermanentWard,] = selectedPermanentWardState;
        const [citizenshipId,] = citizenshipIdState
        const [citizenshipRegistrationDate,] = citizenshipRegistrationDateState
        const [citizenshipDistrict,] = citizenshipDistrictState
        const [citizenshipUpload,] = citizenshipUploadState;
        const [nationalId,] = nationalIdState
        const [nationalIdRegistrationDate,] = nationalIdRegistrationdateState
        const [nationalIdUpload,] = nationalIdUploadState;
        const [passportNumber,] = passportNumberState
        const [passportIssueDate,] = passportIssueDateState
        const [passportExpiryDate,] = passportExpiryDateState
        const [passportUpload,] = passportUploadState;



        setFormState(await perform_signup({
            email,
            password,
            confirmPassword,
            firstName,
            lastName,
            contactNumber,
            dateOfBirth,
            nationality,
            volunteerType,
            bloodGroup,
            gender,
            selectedTemporaryWard,
            selectedPermanentWard,
            citizenshipId,
            citizenshipRegistrationDate,
            citizenshipDistrict,
            citizenshipUpload: arrayBufferToBase64(await toBase64(citizenshipUpload) ?? new ArrayBuffer(0)),
            nationalId,
            nationalIdRegistrationDate,
            nationalIdUpload: arrayBufferToBase64(await toBase64(nationalIdUpload) ?? new ArrayBuffer(0)),
            passportNumber,
            passportIssueDate,
            passportExpiryDate,
            passportUpload: arrayBufferToBase64(await toBase64(passportUpload) ?? new ArrayBuffer(0)),
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
        <SignupProfileInformation
            firstNameState={firstNameState}
            lastNameState={lastNameState}
            contactNumberState={contactNumberState}
            dateOfBirthState={dateOfBirthState}
            nationalityState={nationalityState}
            volunteerTypeState={volunteerTypeState}
            bloodGroupState={bloodGroupState}
            genderState={genderState}
        />,
        <SignupAddressInformation
            selectedTemporaryProvinceState={selectedTemporaryProvinceState}
            selectedTemporaryDistrictState={selectedTemporaryDistrictState}
            selectedTemporaryMunicipalityState={selectedTemporaryMunicipalityState}
            selectedTemporaryWardState={selectedTemporaryWardState}
            selectedPermanentProvinceState={selectedPermanentProvinceState}
            selectedPermanentDistrictState={selectedPermanentDistrictState}
            selectedPermanentMunicipalityState={selectedPermanentMunicipalityState}
            selectedPermanentWardState={selectedPermanentWardState}
        />,
        <SignupIdentification
            citizenshipIdState={citizenshipIdState}
            citizenshipRegistrationDateState={citizenshipRegistrationDateState}
            citizenshipDistrictState={citizenshipDistrictState}
            citizenshipUploadState={citizenshipUploadState}
            nationalIdState={nationalIdState}
            nationalIdRegistrationDateState={nationalIdRegistrationdateState}
            nationalIdUploadState={nationalIdUploadState}
            passportNumberState={passportNumberState}
            passportIssueDateState={passportIssueDateState}
            passportExpiryDateState={passportExpiryDateState}
            passportUploadState={passportUploadState}
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
