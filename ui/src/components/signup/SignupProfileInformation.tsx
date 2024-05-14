import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { StateTuple } from '@models/generics';
import { BloodGroup, Gender, Nationality, VolunteerCategory } from '@models/incident';


type SingupProfileInformationProps = {
  firstNameState: StateTuple<string>,
  lastNameState: StateTuple<string>,
  contactNumberState: StateTuple<string>,
  dateOfBirthState: StateTuple<string>,
  nationalityState: StateTuple<Nationality>,
  volunteerTypeState: StateTuple<VolunteerCategory>,
  bloodGroupState: StateTuple<BloodGroup>,
  genderState: StateTuple<Gender>,
};

export function SignupProfileInformation(props: SingupProfileInformationProps) {
  const { firstNameState,
    lastNameState,
    contactNumberState,
    dateOfBirthState,
    nationalityState,
    volunteerTypeState,
    bloodGroupState,
    genderState,
  } = props;

  const [firstName, setFirstName] = firstNameState;
  const [lastName, setLastName] = lastNameState;
  const [contactNumber, setContactNumber] = contactNumberState;
  const [dateOfBirth, setDateOfBirth] = dateOfBirthState;
  const [nationality, setNationality] = nationalityState;
  const [volunteerType, setVolunteerType] = volunteerTypeState;
  const [bloodGroup, setBloodGroup] = bloodGroupState;
  const [gender, setGender] = genderState;

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
        <label htmlFor="first-name">First Name</label>
      </span>
      <span className="p-float-label">
        <InputText
          value={lastName}
          id="last-name"
          className="p-inputtext-sm w-full"
          onChange={(ev) => setLastName(ev.target.value)}
        />
        <label htmlFor="last-name">Last Name</label>
      </span>
      <span className="p-float-label">
        <InputMask
          value={contactNumber}
          id="contact-number"
          mask="+999 9999999999"
          placeholder="+999 9999999999"
          className="p-inputtext-sm w-full"
          onChange={(ev) =>
            ev.target.value && setContactNumber(ev.target.value)
          }
        />
        <label htmlFor="contact-number">Contact Number (+977 xxxxxxxxxx)</label>
      </span>
      <span className="p-float-label">
        <InputMask
          value={dateOfBirth}
          id="date-of-birth"
          mask="9999-99-99"
          placeholder="yyyy-mm-dd"
          className="p-inputtext-sm w-full"
          onChange={(ev) => ev.target.value && setDateOfBirth(ev.target.value)}
        />
        {/* <Calendar
            value={dateOfBirth}
            onChange={(ev) => setDateOfBirth(ev.value!)}
            showIcon
            dateFormat="yy-mm-dd"
            mask="9999-99-99"
            className="w-full"
            formatDateTime
          /> */}
        <label htmlFor="date-of-birth">Date of birth (yyyy-mm-dd)</label>
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
        optionLabel="value"
      />
      <Dropdown
        value={nationality}
        onChange={(ev) => {
          setNationality(ev.value);
        }}
        options={nationalities}
        placeholder="Select a Nationality"
        optionLabel="value"
      />
      <Dropdown
        value={volunteerType}
        onChange={(ev) => {
          setVolunteerType(ev.value);
        }}
        options={volunteerCategories}
        placeholder="Select a category"
        optionLabel="value"
      />
    </div>
  );
}
