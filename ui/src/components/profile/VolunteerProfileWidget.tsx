import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { StateTuple } from '@models/generics';
import { BloodGroup, Gender, Nationality, TrainingType, VolunteerCategory } from '@models/incident';
import { LocationSelector } from '@components/LocationSelector';
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';

type VolunteerProfileAddressWidgetProps = {
    temporaryWardState: StateTuple<string | null>,
    permanentWardState: StateTuple<string | null>,
};

export function VolunteerProfileAddressWidget(props: VolunteerProfileAddressWidgetProps) {
    const {
        temporaryWardState: temporaryWardState,
        permanentWardState: permanentWardState,
    } = props;


    // TODO: Depending on ward fill this
    const temporaryProvinceState = useState<string | null>(null);
    const temporaryDistrictState = useState<string | null>(null);
    const temporaryMunicipalityState = useState<string | null>(null);
    const permanentProvinceState = useState<string | null>(null);
    const permanentDistrictState = useState<string | null>(null);
    const permanentMunicipalityState = useState<string | null>(null);

    const temporaryLocationSelector = <LocationSelector
        selectedProvinceState={temporaryProvinceState}
        selectedDistrictState={temporaryDistrictState}
        selectedMunicipalityState={temporaryMunicipalityState}
        selectedWardState={temporaryWardState}
    />;

    const permanentLocationSelector = <LocationSelector
        selectedProvinceState={permanentProvinceState}
        selectedDistrictState={permanentDistrictState}
        selectedMunicipalityState={permanentMunicipalityState}
        selectedWardState={permanentWardState}
    />;

    return <div className="flex flex-column w-full" style={{ gap: "1rem" }}>
        <div className="font-semibold">
            Temporary Address <span className="text-red-500">*</span>
        </div>
        {temporaryLocationSelector}
        <div className="font-semibold">
            Permanent Address <span className="text-red-500">*</span>
        </div>
        {permanentLocationSelector}
    </div>;

}

type VolunteerProfileBasicWidgetProps = {
    firstNameState: StateTuple<string>,
    lastNameState: StateTuple<string>,
    contactNumberState: StateTuple<string>,
    dateOfBirthState: StateTuple<Date>,
    nationalityState: StateTuple<Nationality>,
    volunteerTypeState: StateTuple<VolunteerCategory>,
    bloodGroupState: StateTuple<BloodGroup>,
    genderState: StateTuple<Gender>,
    organizationNameState: StateTuple<string | undefined>,
    organizationPhoneNumberState: StateTuple<string | undefined>,
    organizationWebsiteState: StateTuple<string | undefined>,
    trainingNameState: StateTuple<string | undefined>,
    trainingSubjectState: StateTuple<string | undefined>,
    trainingTypeState: StateTuple<TrainingType | undefined>,
};

export function VolunteerProfileBasicWidget(props: VolunteerProfileBasicWidgetProps) {
    const { firstNameState,
        lastNameState,
        contactNumberState,
        dateOfBirthState,
        nationalityState,
        volunteerTypeState,
        bloodGroupState,
        genderState,
        organizationNameState,
        organizationPhoneNumberState,
        organizationWebsiteState,
        trainingNameState,
        trainingSubjectState,
        trainingTypeState,
    } = props;

    const [firstName, setFirstName] = firstNameState;
    const [lastName, setLastName] = lastNameState;
    const [contactNumber, setContactNumber] = contactNumberState;
    const [dateOfBirth, setDateOfBirth] = dateOfBirthState;
    const [nationality, setNationality] = nationalityState;
    const [volunteerType, setVolunteerType] = volunteerTypeState;
    const [bloodGroup, setBloodGroup] = bloodGroupState;
    const [gender, setGender] = genderState;
    const [organizationName, setOrganizationName] = organizationNameState;
    const [organizationPhoneNumber, setOrganizationPhoneNumber] = organizationPhoneNumberState;
    const [organizationWebsite, setOrganizationWebsite] = organizationWebsiteState;
    const [trainingName, setTrainingName] = trainingNameState;
    const [trainingSubject, setTrainingSubject] = trainingSubjectState;
    const [trainingType, setTrainingType] = trainingTypeState;

    const bloodGroups = [
        { value: "O Negative", label: "O Negative" },
        { value: "O Positive", label: "O Positive" },
        { value: "A Negative", label: "A Negative" },
        { value: "A Positive", label: "A Positive" },
        { value: "B Negative", label: "B Negative" },
        { value: "B Positive", label: "B Positive" },
        { value: "Ab Negative", label: "AB Negative" },
        { value: "Ab Positive", label: "AB Positive" },
    ];

    const nationalities = [
        { value: "National", label: "National" },
        { value: "International", label: "International" },
    ];


    const volunteerCategories = [
        { value: "Student", label: "Student" },
        { value: "Rss", label: "RSS" },
        { value: "Retired APF", label: "Retired APF" },
        { value: "Retired Army", label: "Retired Army" },
        { value: "Retired Government Service", label: "Retired Government Service" },
        { value: "Senior Citizen", label: "Senior Citizen" },
        { value: "Community", label: "Community" },
        { value: "General", label: "General" },
    ];

    const trainingTypes = [
        { value: "Rescue", label: "Rescue" },
        { value: "Reliefdistribution", label: "Relief Distribution" },
        { value: "Evacuation", label: "Evacuation" },
        { value: "Other", label: "Other" },
    ];

    return (
        <div>
            <div
                className="flex flex-column w-full align-items-stretch"
                style={{ gap: "2rem" }}
            >
                <span className="p-float-label">
                    <InputText
                        value={firstName}
                        id="first-name"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setFirstName(ev.target.value)}
                    />
                    <label htmlFor="first-name">First Name <span className="text-sm text-red-500">*</span></label>
                </span>
                <span className="p-float-label">
                    <InputText
                        value={lastName}
                        id="last-name"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setLastName(ev.target.value)}
                    />
                    <label htmlFor="last-name">Last Name <span className="text-sm text-red-500">*</span></label>
                </span>
                <span className="p-float-label">
                    <InputText
                        value={contactNumber}
                        id="contact-number"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setContactNumber(ev.target.value)}
                    />
                    <label htmlFor="contact-number">
                        Contact Number (+977xxxxxxxxxx) <span className="text-sm text-red-500">*</span>
                    </label>
                </span>
                <span className="p-float-label">
                    <Calendar
                        id="date-of-birth"
                        value={dateOfBirth}
                        onChange={(ev) =>
                            setDateOfBirth(ev.target.value ?? new Date())
                        }
                        dateFormat="yy-mm-dd"
                    />
                    <label htmlFor="date-of-birth">Date of birth (yyyy-mm-dd) <span className="text-sm text-red-500">*</span></label>
                </span>
                <div className="flex flex-wrap gap-3">
                    <div className="flex align-items-center">
                        <RadioButton
                            inputId="male"
                            name="male"
                            value="Male"
                            checked={gender === "Male"}
                            onChange={(e) => {
                                setGender(e.value);
                            }}
                        />
                        <label htmlFor="male" className="ml-2">
                            Male
                        </label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton
                            inputId="female"
                            name="female"
                            value="Female"
                            checked={gender === "Female"}
                            onChange={(e) => {
                                setGender(e.value);
                            }}
                        />
                        <label htmlFor="female" className="ml-2">
                            Female
                        </label>
                    </div>
                    <div className="flex align-items-center">
                        <RadioButton
                            inputId="other"
                            name="other"
                            value="Other"
                            checked={gender === "Other"}
                            onChange={(e) => {
                                setGender(e.value);
                            }}
                        />
                        <label htmlFor="other" className="ml-2">
                            Other
                        </label>
                    </div>
                </div>
                <Dropdown
                    value={bloodGroup}
                    onChange={(ev) => {
                        setBloodGroup(ev.value);
                    }}
                    options={bloodGroups}
                    placeholder="Select a blood group"
                    optionLabel="label"
                    optionValue="label"
                />
                <Dropdown
                    value={nationality}
                    onChange={(ev) => {
                        setNationality(ev.value);
                    }}
                    options={nationalities}
                    placeholder="Select a Nationality"
                    optionLabel="label"
                    optionValue="value"
                />
                <Dropdown
                    value={volunteerType}
                    onChange={(ev) => {
                        setVolunteerType(ev.value);
                    }}
                    options={volunteerCategories}
                    placeholder="Select a category"
                    optionLabel="label"
                    optionValue="value"
                />

                <h3> Organization </h3>
                <span className="p-float-label">
                    <InputText
                        value={organizationName}
                        id="organization-name"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setOrganizationName(ev.target.value)}
                    />
                    <label htmlFor="organization-name">Organization Name <span className="text-xs">(optional)</span></label>
                </span>

                <span className="p-float-label">
                    <InputText
                        value={organizationPhoneNumber}
                        id="organization-phone-number"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setOrganizationPhoneNumber(ev.target.value)}
                    />
                    <label htmlFor="organization-phone-number">Organization Phone Number <span className="text-xs">(optional)</span></label>
                </span>

                <span className="p-float-label">
                    <InputText
                        value={organizationWebsite}
                        id="organization-website"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setOrganizationWebsite(ev.target.value)}
                    />
                    <label htmlFor="organization-website">Organization Website <span className="text-xs">(optional)</span></label>
                </span>

                <h3> Training </h3>
                <span className="p-float-label">
                    <InputText
                        value={trainingName}
                        id="training-name"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setTrainingName(ev.target.value)}
                    />
                    <label htmlFor="training-name">Training Name <span className="text-xs">(optional)</span></label>
                </span>

                <span className="p-float-label">
                    <InputText
                        value={trainingSubject}
                        id="training-subject"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setTrainingSubject(ev.target.value)}
                    />
                    <label htmlFor="training-subject">Training Subject <span className="text-xs">(optional)</span></label>
                </span>

                <Dropdown
                    value={trainingType}
                    onChange={(ev) => {
                        setTrainingType(ev.value);
                    }}
                    options={trainingTypes}
                    placeholder="Select training type (optional)"
                    optionLabel="label"
                    optionValue="value"
                />
            </div>
        </div>
    );
}

type VolunteerProfileWidgetProps = {
    firstNameState: StateTuple<string>,
    lastNameState: StateTuple<string>,
    contactNumberState: StateTuple<string>,
    dateOfBirthState: StateTuple<Date>,
    nationalityState: StateTuple<Nationality>,
    volunteerTypeState: StateTuple<VolunteerCategory>,
    bloodGroupState: StateTuple<BloodGroup>,
    genderState: StateTuple<Gender>,
    temporaryWardState: StateTuple<string | null>,
    permanentWardState: StateTuple<string | null>,
    organizationNameState: StateTuple<string | undefined>,
    organizationPhoneNumberState: StateTuple<string | undefined>,
    organizationWebsiteState: StateTuple<string | undefined>,
    trainingNameState: StateTuple<string | undefined>,
    trainingSubjectState: StateTuple<string | undefined>,
    trainingTypeState: StateTuple<TrainingType | undefined>,
};

export function VolunteerProfileWidget(props: VolunteerProfileWidgetProps) {
    const { firstNameState,
        lastNameState,
        contactNumberState,
        dateOfBirthState,
        nationalityState,
        volunteerTypeState,
        bloodGroupState,
        genderState,
        temporaryWardState,
        permanentWardState,
        organizationNameState,
        organizationPhoneNumberState,
        organizationWebsiteState,
        trainingNameState,
        trainingSubjectState,
        trainingTypeState,
    } = props;

    return (
        <div>
            <VolunteerProfileBasicWidget
                firstNameState={firstNameState}
                lastNameState={lastNameState}
                contactNumberState={contactNumberState}
                dateOfBirthState={dateOfBirthState}
                nationalityState={nationalityState}
                volunteerTypeState={volunteerTypeState}
                bloodGroupState={bloodGroupState}
                genderState={genderState}
                organizationNameState={organizationNameState}
                organizationPhoneNumberState={organizationPhoneNumberState}
                organizationWebsiteState={organizationWebsiteState}
                trainingNameState={trainingNameState}
                trainingSubjectState={trainingSubjectState}
                trainingTypeState={trainingTypeState}
            />

            <h2> Address Information </h2>

            <VolunteerProfileAddressWidget
                temporaryWardState={temporaryWardState}
                permanentWardState={permanentWardState}
            />
        </div>
    );
}
