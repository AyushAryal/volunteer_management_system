import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { StateTuple } from '@models/generics';
import { AcademicQualification, BloodGroup, Gender, Nationality, VolunteerCategory } from '@models/incident';
import { LocationSelector } from '@components/LocationSelector';
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';

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
    dateOfBirthState: StateTuple<Date | undefined>,
    nationalityState: StateTuple<Nationality | undefined>,
    volunteerTypeState: StateTuple<VolunteerCategory | undefined>,
    bloodGroupState: StateTuple<BloodGroup | undefined>,
    academicQualificationState: StateTuple<AcademicQualification | undefined>,
    genderState: StateTuple<Gender | undefined>,
    organizationNameState: StateTuple<string | undefined>,
    organizationPhoneNumberState: StateTuple<string | undefined>,
    organizationWebsiteState: StateTuple<string | undefined>,
};

export function VolunteerProfileBasicWidget(props: VolunteerProfileBasicWidgetProps) {
    const { firstNameState,
        lastNameState,
        contactNumberState,
        dateOfBirthState,
        nationalityState,
        volunteerTypeState,
        academicQualificationState,
        bloodGroupState,
        genderState,
        organizationNameState,
        organizationPhoneNumberState,
        organizationWebsiteState,
    } = props;

    const [firstName, setFirstName] = firstNameState;
    const [lastName, setLastName] = lastNameState;
    const [contactNumber, setContactNumber] = contactNumberState;
    const [dateOfBirth, setDateOfBirth] = dateOfBirthState;
    const [nationality, setNationality] = nationalityState;
    const [volunteerType, setVolunteerType] = volunteerTypeState;
    const [bloodGroup, setBloodGroup] = bloodGroupState;
    const [academicQualification, setAcademicQualification] = academicQualificationState;
    const [gender, setGender] = genderState;
    const [organizationName, setOrganizationName] = organizationNameState;
    const [organizationPhoneNumber, setOrganizationPhoneNumber] = organizationPhoneNumberState;
    const [organizationWebsite, setOrganizationWebsite] = organizationWebsiteState;

    const bloodGroups = [
        { value: "O Negative" },
        { value: "O Positive" },
        { value: "A Negative" },
        { value: "A Positive" },
        { value: "B Negative" },
        { value: "B Positive" },
        { value: "AB Negative" },
        { value: "AB Positive" },
    ];

    const academicQualifications = [
        { value: "Secondary Level" },
        { value: "High School" },
        { value: "Under Grad" },
        { value: "Grad" },
        { value: "Doctorate" },
        { value: "Post Doc" }
    ]

    const nationalities = [
        { value: "National" },
        { value: "International" },
    ];


    const volunteerCategories = [
        { value: "Student" },
        { value: "RSS" },
        { value: "Retired APF" },
        { value: "Retired Army" },
        { value: "Retired Government Service" },
        { value: "Senior Citizen" },
        { value: "Community" },
        { value: "General" },
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
            <label htmlFor="first-name">
              First Name <span className="text-sm text-red-500">*</span>
            </label>
          </span>
          <span className="p-float-label">
            <InputText
              value={lastName}
              id="last-name"
              className="p-inputtext-sm w-full"
              onChange={(ev) => setLastName(ev.target.value)}
            />
            <label htmlFor="last-name">
              Last Name <span className="text-sm text-red-500">*</span>
            </label>
          </span>
          <FloatLabel>
            <InputMask
              value={contactNumber}
              id="contact-number"
              mask="(+999)-9999999999"
              className="p-inputtext-sm w-full"
              onChange={(ev) => setContactNumber(ev.target.value ?? "")}
            />
            <label htmlFor="contact-number">
              Contact Number (+977xxxxxxxxxx){" "}
              <span className="text-sm text-red-500">*</span>
            </label>
          </FloatLabel>
          <FloatLabel>
            <Calendar
              className="w-full"
              id="date-of-birth"
              value={dateOfBirth}
              onChange={(ev) => setDateOfBirth(ev.target.value ?? undefined)}
              dateFormat="yy-mm-dd"
              showIcon
              mask="9999-99-99"
            />
            <label htmlFor="date-of-birth">
              Date of birth (yyyy-mm-dd){" "}
              <span className="text-sm text-red-500">*</span>
            </label>
          </FloatLabel>
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
              <label htmlFor="male" className="ml-2 text-gray-800">
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
              <label htmlFor="female" className="ml-2 text-gray-800">
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
              <label htmlFor="other" className="ml-2 text-gray-800">
                Other
              </label>
            </div>
          </div>
          <Dropdown
            className="p-inputtext-sm"
            value={bloodGroup}
            onChange={(ev) => {
              setBloodGroup(ev.value);
            }}
            options={bloodGroups}
            placeholder="Select a blood group"
            optionLabel="value"
          />

          <Dropdown
            className="p-inputtext-sm"
            value={academicQualification}
            onChange={(ev) => {
              setAcademicQualification(ev.value);
            }}
            options={academicQualifications}
            placeholder="Select a academic qualification"
            optionLabel="value"
          />
          <Dropdown
            className="p-inputtext-sm"
            value={nationality}
            onChange={(ev) => {
              setNationality(ev.value);
            }}
            options={nationalities}
            placeholder="Select a Nationality"
            optionLabel="value"
          />
          <Dropdown
            className="p-inputtext-sm"
            value={volunteerType}
            onChange={(ev) => {
              setVolunteerType(ev.value);
            }}
            options={volunteerCategories}
            placeholder="Select a category"
            optionLabel="value"
          />

          <div className="font-semibold"> Organization </div>
          <span className="p-float-label">
            <InputText
              value={organizationName}
              id="organization-name"
              className="p-inputtext-sm w-full"
              onChange={(ev) => setOrganizationName(ev.target.value)}
            />
            <label htmlFor="organization-name">
              Organization Name <span className="text-xs">(optional)</span>
            </label>
          </span>

          <span className="p-float-label">
            <InputMask
              value={organizationPhoneNumber}
              id="organization-phone-number"
              className="p-inputtext-sm w-full"
              onChange={(ev) =>
                setOrganizationPhoneNumber(ev.target.value ?? "")
              }
              mask="(+999)-9999999999"
            />
            <label htmlFor="organization-phone-number">
              Organization Phone Number{" "}
              <span className="text-xs">(optional)</span>
            </label>
          </span>

          <span className="p-float-label">
            <InputText
              value={organizationWebsite}
              id="organization-website"
              className="p-inputtext-sm w-full"
              onChange={(ev) => setOrganizationWebsite(ev.target.value)}
            />
            <label htmlFor="organization-website">
              Organization Website <span className="text-xs">(optional)</span>
            </label>
          </span>
        </div>
      </div>
    );
}

type VolunteerProfileWidgetProps = {
    firstNameState: StateTuple<string>,
    lastNameState: StateTuple<string>,
    contactNumberState: StateTuple<string>,
    dateOfBirthState: StateTuple<Date | undefined>,
    nationalityState: StateTuple<Nationality | undefined>,
    volunteerTypeState: StateTuple<VolunteerCategory | undefined>,
    bloodGroupState: StateTuple<BloodGroup | undefined>,
    academicQualificationState: StateTuple<AcademicQualification | undefined>,
    genderState: StateTuple<Gender | undefined>,
    temporaryWardState: StateTuple<string | null>,
    permanentWardState: StateTuple<string | null>,
    organizationNameState: StateTuple<string | undefined>,
    organizationPhoneNumberState: StateTuple<string | undefined>,
    organizationWebsiteState: StateTuple<string | undefined>,
};

export function VolunteerProfileWidget(props: VolunteerProfileWidgetProps) {
    const { firstNameState,
        lastNameState,
        contactNumberState,
        dateOfBirthState,
        nationalityState,
        volunteerTypeState,
        bloodGroupState,
        academicQualificationState,
        genderState,
        temporaryWardState,
        permanentWardState,
        organizationNameState,
        organizationPhoneNumberState,
        organizationWebsiteState,
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
                academicQualificationState={academicQualificationState}
                genderState={genderState}
                organizationNameState={organizationNameState}
                organizationPhoneNumberState={organizationPhoneNumberState}
                organizationWebsiteState={organizationWebsiteState}
            />

            <h2> Address Information </h2>

            <VolunteerProfileAddressWidget
                temporaryWardState={temporaryWardState}
                permanentWardState={permanentWardState}
            />
        </div>
    );
}
