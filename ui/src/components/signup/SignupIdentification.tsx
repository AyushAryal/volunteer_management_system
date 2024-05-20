import { StateTuple } from '@models/generics';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { DistrictSelector } from './LocationSelector';
import { FileInput } from '@components/FileInput';

type SingupIdentificationProps = {
    citizenshipIdState: StateTuple<string>,
    citizenshipRegistrationDateState: StateTuple<string>,
    citizenshipDistrictState: StateTuple<string>,
    citizenshipUploadState: StateTuple<File>,
    nationalIdState: StateTuple<string>,
    nationalIdRegistrationDateState: StateTuple<string>,
    nationalIdUploadState: StateTuple<File>,
    passportNumberState: StateTuple<string>,
    passportIssueDateState: StateTuple<string>,
    passportExpiryDateState: StateTuple<string>,
    passportUploadState: StateTuple<File>,
};

export function SignupIdentification(props: SingupIdentificationProps) {
    const {
        citizenshipIdState,
        citizenshipRegistrationDateState,
        citizenshipDistrictState,
        citizenshipUploadState,
        nationalIdState,
        nationalIdRegistrationDateState,
        nationalIdUploadState,
        passportNumberState,
        passportIssueDateState,
        passportExpiryDateState,
        passportUploadState,
    } = props;


    const [citizenshipId, setCitizenshipId] = citizenshipIdState;
    const [citizenshipRegistrationDate, setCitizenshipRegistrationDate] = citizenshipRegistrationDateState;
    const [citizenshipUpload, setCitizenshipUpload] = citizenshipUploadState;
    const [nationalId, setNationalId] = nationalIdState;
    const [nationalIdRegistrationDate, setNationalIdRegistrationDate] = nationalIdRegistrationDateState;
    const [nationalIdUpload, setnationalIdUpload] = nationalIdUploadState;
    const [passportNumber, setPassportNumber] = passportNumberState;
    const [passportIssueDate, setPassportIssueDate] = passportIssueDateState;
    const [passportExpiryDate, setPassportExpiryDate] = passportExpiryDateState;
    const [passportUpload, setpassportUpload] = passportUploadState;

    return (<>
        <i>(At least ONE form of identification is mandatory)</i>
        <div
            className="flex flex-column w-full align-items-stretch"
            style={{ gap: "2rem" }}
        >
            <h3> Citizenship </h3>
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
                    onChange={(ev) =>
                        setCitizenshipRegistrationDate(ev.target.value ?? "")
                    }
                />
                <label htmlFor="citizenship-registration-date">
                    Citizenship Reg. Date (yyyy-mm-dd)
                </label>
            </span>

            <DistrictSelector
                label="Citizenship Issue District"
                selectedDistrictState={citizenshipDistrictState}
            />

            <FileInput file={citizenshipUpload} onChange={(file) => setCitizenshipUpload(file)} />

            <h3> National ID </h3>

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
                    onChange={(ev) =>
                        setNationalIdRegistrationDate(ev.target.value ?? "")
                    }
                />
                <label htmlFor="national-id-registration-date">
                    National Id Reg. Date (yyyy-mm-dd)
                </label>
            </span>

            <FileInput file={nationalIdUpload} onChange={(file) => setnationalIdUpload(file)} />

            <h3> Passport </h3>

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
                    onChange={(ev) =>
                        setPassportIssueDate(ev.target.value ?? "")
                    }
                />
                <label htmlFor="passport-issue-date">
                    Passport Issue Date (yyyy-mm-dd)
                </label>
            </span>
            <span className="p-float-label">
                <InputMask
                    value={passportExpiryDate}
                    id="passport-expiry-date"
                    mask="9999-99-99"
                    placeholder="yyyy-mm-dd"
                    className="p-inputtext-sm w-full"
                    onChange={(ev) =>
                        setPassportExpiryDate(ev.target.value ?? "")
                    }
                />
                <label htmlFor="passport-expiry-date">
                    {" "}
                    Passport Expiry Date (yyyy-mm-dd)
                </label>
            </span>

            <FileInput file={passportUpload} onChange={(file) => setpassportUpload(file)} />
        </div >
    </>
    );
}
