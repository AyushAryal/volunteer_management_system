import { useState } from 'react';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Steps } from 'primereact/steps';
import { faUserPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { SignupAddressInformation } from '@components/signup/SignupAddressInformation';
import { SignupBasicInformation } from '@components/signup/SignupBasicInformation';
import { SignupProfileInformation } from '@components/signup/SignupProfileInformation';
import { signup } from '@api/incident';
import { describeApiErrors } from '@api/utils';

type VolunteerDetails = {
    email: string,
    password: string,
    confirmPassword: string,
    firstName: string,
    lastName: string,
    contactNumber: string,
    dateOfBirth: string,
    nationality: string,
    volunteerType: string,
    bloodGroup: string,
    gender: string,
    selectedTemporaryMunicipality: string,
    selectedPermanentMunicipality: string,
};

async function perform_signup(details: VolunteerDetails): Promise<string | null> {
    const {
        email,
        password,
        confirmPassword,
        firstName,
        lastName,
        dateOfBirth,
        nationality,
        volunteerType,
        bloodGroup,
        gender,
        selectedTemporaryMunicipality,
        selectedPermanentMunicipality,
    } = details;

    if (!password || !confirmPassword) {
        return "Password cannot be empty";
    } else if (password != confirmPassword) {
        return "Password is not the same as confirm password";
    } else {
        const form = {
            email, password,
            "volunteer": {
                "first_name": firstName,
                "last_name": lastName,
                "date_of_birth": dateOfBirth,
                "blood_group": bloodGroup,
                "gender": gender,
                "nationality": nationality,
                "category": volunteerType,
                "temporary_municipality": selectedTemporaryMunicipality,
                "permanent_municipality": selectedPermanentMunicipality,
            }
        };

        let response = await signup(JSON.stringify(form));
        if (response.status != 201) {
            return describeApiErrors(await response.json());
        } else {
            return null;
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
    const nationalityState = useState("");
    const volunteerTypeState = useState("");
    const bloodGroupState = useState("");
    const genderState = useState("");

    const selectedTemporaryProvinceState = useState("");
    const selectedTemporaryDistrictState = useState("");
    const selectedTemporaryMunicipalityState = useState("");
    const selectedPermanentProvinceState = useState("");
    const selectedPermanentDistrictState = useState("");
    const selectedPermanentMunicipalityState = useState("");

    const [termsAccepted, setTermsAccepted] = useState(false);
    const [formErrors, setFormErrors] = useState<string>();
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
        const [selectedTemporaryMunicipality,] = selectedTemporaryMunicipalityState;
        const [selectedPermanentMunicipality,] = selectedPermanentMunicipalityState;
        const signupFormResult = await perform_signup({
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
            selectedTemporaryMunicipality,
            selectedPermanentMunicipality,
        }) ?? "Network Failure. Please try again.";
        setFormErrors(signupFormResult);
    };

    let response;
    if (formErrors === "") {
        response = <div className="flex flex-row align-items-center">
            <FontAwesomeIcon
                icon={faCheckCircle}
                className="text-green-500"
                style={{ fontSize: "2rem" }}
            />
            &nbsp; <span> Vertification Email Sent </span>
        </div>

    } else if (typeof formErrors === "string") {
        response = <div className="flex flex-row align-items-center">
            <pre style={{ whiteSpace: "pre-wrap", color: "var(--red-600)", fontWeight: "bold" }}>
                {formErrors}
            </pre>
        </div >;
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
                disabled={!termsAccepted === true || formErrors === ""}
                onClick={onSubmit}
            />
        </div>
        {response}
    </div>;

    const sections = [
        { label: "Profile" },
        { label: "Address" },
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
            selectedPermanentProvinceState={selectedPermanentProvinceState}
            selectedPermanentDistrictState={selectedPermanentDistrictState}
            selectedPermanentMunicipalityState={selectedPermanentMunicipalityState}
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
