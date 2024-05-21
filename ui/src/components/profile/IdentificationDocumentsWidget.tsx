import { StateTuple } from '@models/generics';
import { InputText } from 'primereact/inputtext';
import { DistrictSelector } from '@components/LocationSelector';
import { FileInput } from '@components/FileInput';
import { Calendar } from 'primereact/calendar';

type IdentificationDocumentsWidgetProps = {
    citizenshipIdState: StateTuple<string | undefined>,
    citizenshipRegistrationDateState: StateTuple<Date | undefined>,
    citizenshipDistrictState: StateTuple<string | undefined>,
    citizenshipImageState: StateTuple<string | undefined>,
    nationalIdState: StateTuple<string | undefined>,
    nationalIdRegistrationDateState: StateTuple<Date | undefined>,
    nationalIdImageState: StateTuple<string | undefined>,
    passportNumberState: StateTuple<string | undefined>,
    passportIssueDateState: StateTuple<Date | undefined>,
    passportExpiryDateState: StateTuple<Date | undefined>,
    passportImageState: StateTuple<string | undefined>,
    otherIdentificationDocumentNameState: StateTuple<string | undefined>,
    otherIdentificationDocumentImageState: StateTuple<string | undefined>,
};

export function IdentificationDocumentsWidget(props: IdentificationDocumentsWidgetProps) {
    const {
        citizenshipIdState,
        citizenshipRegistrationDateState,
        citizenshipDistrictState,
        citizenshipImageState,
        nationalIdState,
        nationalIdRegistrationDateState,
        nationalIdImageState: nationalIdImageState,
        passportNumberState,
        passportIssueDateState,
        passportExpiryDateState,
        passportImageState: passportImageState,
        otherIdentificationDocumentNameState,
        otherIdentificationDocumentImageState: otherIdentificationDocumentImageState,
    } = props;


    const [citizenshipId, setCitizenshipId] = citizenshipIdState;
    const [citizenshipRegistrationDate, setCitizenshipRegistrationDate] = citizenshipRegistrationDateState;
    const [citizenshipImage, setCitizenshipImage] = citizenshipImageState;
    const [nationalId, setNationalId] = nationalIdState;
    const [nationalIdRegistrationDate, setNationalIdRegistrationDate] = nationalIdRegistrationDateState;
    const [nationalIdImage, setnationalIdImage] = nationalIdImageState;
    const [passportNumber, setPassportNumber] = passportNumberState;
    const [passportIssueDate, setPassportIssueDate] = passportIssueDateState;
    const [passportExpiryDate, setPassportExpiryDate] = passportExpiryDateState;
    const [passportImage, setpassportImage] = passportImageState;
    const [otherIdentificationDocumentName, setOtherIdentificationDocumentName] = otherIdentificationDocumentNameState;
    const [otherIdentificationDocumentImage, setOtherIdentificationDocumentImage] = otherIdentificationDocumentImageState;

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
                <Calendar
                    id="citizenship-registration-date"
                    value={citizenshipRegistrationDate}
                    onChange={(ev) =>
                        setCitizenshipRegistrationDate(ev.target.value ?? undefined)
                    }
                    dateFormat="yy-mm-dd"
                />
                <label htmlFor="citizenship-registration-date">
                    Citizenship Registration Date
                </label>
            </span>

            <DistrictSelector
                label="Citizenship Issue District"
                districtState={citizenshipDistrictState}
            />

            <FileInput file={citizenshipImage} onChange={(file) => setCitizenshipImage(file)} />

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
                <Calendar
                    id="national-id-registration-date"
                    value={nationalIdRegistrationDate}
                    onChange={(ev) =>
                        setNationalIdRegistrationDate(ev.target.value ?? undefined)
                    }
                    dateFormat="yy-mm-dd"
                />
                <label htmlFor="national-id-registration-date">
                    National Id Registration Date
                </label>
            </span>

            <FileInput file={nationalIdImage} onChange={(file) => setnationalIdImage(file)} />

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
                <Calendar
                    id="passport-issue-date"
                    value={passportIssueDate}
                    onChange={(ev) =>
                        setPassportIssueDate(ev.target.value ?? undefined)
                    }
                    dateFormat="yy-mm-dd"
                />
                <label htmlFor="passport-issue-date">
                    Passport Issue Date
                </label>
            </span>
            <span className="p-float-label">
                <Calendar
                    id="passport-expiry-date"
                    value={passportExpiryDate}
                    onChange={(ev) =>
                        setPassportExpiryDate(ev.target.value ?? undefined)
                    }
                    dateFormat="yy-mm-dd"
                />
                <label htmlFor="passport-expiry-date">
                    Passport Expiry Date
                </label>
            </span>

            <FileInput file={passportImage} onChange={(file) => setpassportImage(file)} />

            <h3> Other Document ID </h3>

            <span className="p-float-label">
                <InputText
                    value={otherIdentificationDocumentName}
                    id="other-id-name"
                    className="p-inputtext-sm w-full"
                    onChange={(ev) => setOtherIdentificationDocumentName(ev.target.value)}
                />
                <label htmlFor="other-id-name">Other ID Name</label>
            </span>

            <FileInput file={otherIdentificationDocumentImage} onChange={(file) => setOtherIdentificationDocumentImage(file)} />

        </div >
    </>
    );
}
