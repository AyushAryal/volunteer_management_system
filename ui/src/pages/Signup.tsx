import { useState } from 'react';

import { Button } from 'primereact/button';
import { Checkbox } from 'primereact/checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Steps } from 'primereact/steps';
import { faUserPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';

import { UserBasicInformation } from '@components/profile/UserBasicInformation';

import { FormState } from '@api/form.tsx';
import { VolunteerProfileAddressWidget, VolunteerProfileRequiredWidget } from '@components/profile/VolunteerProfileWidget';
import { IdentificationDocumentsWidget } from '@components/profile/IdentificationDocumentsWidget';
import { VolunteerForm, VolunteerFormContext, perform_signup } from '@forms/volunteer';

export function Signup() {
    let [form, setForm] = useState<VolunteerForm>({
        terms_accepted: false,
        email: "",
        password: "",
        confirm_password: "",
        volunteer: {
            url: "",
            user: "",
            profile_image: "",
            first_name: "",
            last_name: "",
            contact_number: "",
            date_of_birth: undefined,
            blood_group: undefined,
            academic_qualification: undefined,
            gender: undefined,
            nationality: undefined,
            category: undefined,
            temporary_ward: null,
            permanent_ward: null,
            point: undefined,
            organization_name: undefined,
            organization_phone_number: undefined,
            organization_website: undefined,
        },
        citizenship: {
            id: undefined,
            registration_date: undefined,
            registration_district: undefined,
            image: undefined,
        },
        passport: {
            id: undefined,
            expiry_date: undefined,
            issue_date: undefined,
            image: undefined,
        },
        national_id: {
            id: undefined,
            registration_date: undefined,
            image: undefined,
        },
        other_identification_document: {
            name: undefined,
            image: undefined,
        },
        certificates: [],
        trainings: [],
    })

    const [formState, setFormState] = useState(FormState.init());
    const [sectionIndex, setSectionIndex] = useState(0);

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
                    onChange={e => setForm({ ...form, terms_accepted: e.checked ?? false })}
                    checked={form.terms_accepted}
                />
                <span className="ml-2"> Accept Terms & Conditions </span>
            </div>
            <Button
                label="Submit"
                disabled={(!form.terms_accepted || formState.isSubmitted() && !formState.hasErrors())}
                onClick={async () => {
                    setFormState(await perform_signup(form));
                }}
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
        <VolunteerProfileRequiredWidget />,
        <VolunteerProfileAddressWidget />,
        <IdentificationDocumentsWidget />,
        <>
            <UserBasicInformation />
            {submitAndFormErrors}
        </>
    ].map(PaginationWrapper);

    return <VolunteerFormContext.Provider value={{ form, setForm }} >
        <div
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
        </div >
    </VolunteerFormContext.Provider>;
}
