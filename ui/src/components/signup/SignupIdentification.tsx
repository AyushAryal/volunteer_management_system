import { StateTuple } from '@models/generics';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { DistrictSelector } from './LocationSelector';


type SingupIdentificationProps = {
    idTypeState: StateTuple<string>,
    citizenshipIdState: StateTuple<string>,
    citizenshipRegistrationDateState: StateTuple<string>,
    citizenshipDistrictState: StateTuple<string>,
    nationalIdState: StateTuple<string>,
    nationalIdRegistrationDateState: StateTuple<string>,
    passportNumberState: StateTuple<string>,
    passportIssueDateState: StateTuple<string>,
    passportExpiryDateState: StateTuple<string>,
};

export function SignupIdentification(props: SingupIdentificationProps) {
    const { idTypeState,
        citizenshipIdState,
        citizenshipRegistrationDateState,
        citizenshipDistrictState,
        nationalIdState,
        nationalIdRegistrationDateState,
        passportNumberState,
        passportIssueDateState,
        passportExpiryDateState,
    } = props;


    const [idType, setIdType] = idTypeState;
    const [citizenshipId, setCitizenshipId] = citizenshipIdState;
    const [citizenshipRegistrationDate, setCitizenshipRegistrationDate] = citizenshipRegistrationDateState;
    const [nationalId, setNationalId] = nationalIdState;
    const [nationalIdRegistrationDate, setNationalIdRegistrationDate] = nationalIdRegistrationDateState;
    const [passportNumber, setPassportNumber] = passportNumberState;
    const [passportIssueDate, setPassportIssueDate] = passportIssueDateState;
    const [passportExpiryDate, setPassportExpiryDate] = passportExpiryDateState;

    const idTypes = ["Citizenship", "National Id", "Passport", "Document"];

    return <div className="flex flex-column w-full align-items-stretch" style={{ gap: "2rem" }}>
        <Dropdown
            value={idType}
            onChange={(ev) => { setIdType(ev.value); }}
            options={idTypes}
            placeholder="Select a Id type"
        />
        <span className="p-float-label">
            <InputText
                value={citizenshipId}
                id="citizenship-id"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setCitizenshipId(ev.target.value)}
            />
            <label htmlFor="first-name">Citizenship Number</label>
        </span>

        <span className="p-float-label">
            <InputMask
                value={citizenshipRegistrationDate}
                id="citizenship-registration-date"
                mask="9999-99-99"
                placeholder="yyyy-mm-dd"
                className="p-inputtext-sm w-full"
                onChange={(ev) => ev.target.value && setCitizenshipRegistrationDate(ev.target.value)}
            />
            <label htmlFor="citizenship-registration-date">Citizenship Reg. Date (yyyy-mm-dd)</label>
        </span>

        <span className="p-float-label">
            <DistrictSelector selectedDistrictState={citizenshipDistrictState} />
        </span>

        <span className="p-float-label">
            <InputText
                value={nationalId}
                id="national-id"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setNationalId(ev.target.value)}
            />
            <label htmlFor="national-id">National Id Number</label>
        </span>

        <span className="p-float-label">
            <InputMask
                value={nationalIdRegistrationDate}
                id="national-id-registration-date"
                mask="9999-99-99"
                placeholder="yyyy-mm-dd"
                className="p-inputtext-sm w-full"
                onChange={(ev) => ev.target.value && setNationalIdRegistrationDate(ev.target.value)}
            />
            <label htmlFor="national-id-registration-date">National Id Reg. Date (yyyy-mm-dd)</label>
        </span>

        <span className="p-float-label">
            <InputText
                value={passportNumber}
                id="passport-number"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setPassportNumber(ev.target.value)}
            />
            <label htmlFor="passport-number">Passport Number</label>
        </span>

        <span className="p-float-label">
            <InputMask
                value={passportIssueDate}
                id="passport-issue-date"
                mask="9999-99-99"
                placeholder="yyyy-mm-dd"
                className="p-inputtext-sm w-full"
                onChange={(ev) => ev.target.value && setPassportIssueDate(ev.target.value)}
            />
            <label htmlFor="passport-issue-date">Passport Issue Date (yyyy-mm-dd)</label>

        </span><span className="p-float-label">
            <InputMask
                value={passportExpiryDate}
                id="passport-expiry-date"
                mask="9999-99-99"
                placeholder="yyyy-mm-dd"
                className="p-inputtext-sm w-full"
                onChange={(ev) => ev.target.value && setPassportExpiryDate(ev.target.value)}
            />
            <label htmlFor="passport-expiry-date"> Date (yyyy-mm-dd)</label>
        </span>

    </div>;
}
