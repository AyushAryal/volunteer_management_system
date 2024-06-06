import { InputText } from 'primereact/inputtext';
import { DistrictSelector } from '@components/LocationSelector';
import { FileInput } from '@components/FileInput';
import { Calendar } from 'primereact/calendar';
import { TabPanel, TabView } from 'primereact/tabview';
import { VolunteerFormContext } from '@forms/volunteer';
import { useContext } from 'react';
import { useTranslation } from 'react-i18next';

export function IdentificationDocumentsWidget() {
    const {t} = useTranslation();
    let { form, setForm } = useContext(VolunteerFormContext);

    let citizenshipWidget = <div
        className="flex flex-column w-full align-items-stretch pt-3"
        style={{ gap: "2rem" }}
    >
        <span className="p-float-label">
            <InputText
                value={form.citizenship.id}
                id="citizenship-id"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setForm({
                    ...form,
                    citizenship: {
                        ...form.citizenship,
                        id: ev.target.value
                    }
                })}
            />
            <label htmlFor="first-name">{t("Citizenship")} {t("Number")}</label>
        </span>

        <span className="p-float-label">
            <Calendar
                className="w-full"
                id="citizenship-registration-date"
                value={form.citizenship.registration_date}
                onChange={(ev) => setForm({
                    ...form,
                    citizenship: {
                        ...form.citizenship,
                        registration_date: ev.target.value ?? undefined,
                    }
                })}
                dateFormat="yy-mm-dd"
                mask="9999-99-99"
                showIcon
            />
            <label htmlFor="citizenship-registration-date">
                {t("Citizenship Registration Date")}
            </label>
        </span>

        <DistrictSelector
            value={form.citizenship.registration_district}
            onChange={(value) => setForm({
                ...form,
                citizenship: {
                    ...form.citizenship,
                    registration_district: value
                }
            })}
        />

        <FileInput
            file={form.citizenship.image}
            onChange={(file) => setForm({
                ...form,
                citizenship: {
                    ...form.citizenship,
                    image: file,
                }
            })}
        />
    </div>;

    let passportWidget = (
        <div
            className="flex flex-column w-full align-items-stretch pt-3"
            style={{ gap: "2rem" }}
        >
            <span className="p-float-label">
                <InputText
                    value={form.passport.id}
                    id="passport-number"
                    className="p-inputtext-sm w-full"
                    onChange={(ev) => setForm({
                        ...form,
                        passport: {
                            ...form.passport,
                            id: ev.target.value,
                        }
                    })}
                />
                <label htmlFor="passport-number">{t("Passport")} {t("Number")}</label>
            </span>

            <span className="p-float-label">
                <Calendar
                    className="w-full"
                    id="passport-issue-date"
                    value={form.passport.issue_date}
                    onChange={(ev) => setForm({
                        ...form,
                        passport: {
                            ...form.passport,
                            issue_date: ev.target.value ?? undefined,
                        }
                    })}
                    dateFormat="yy-mm-dd"
                    mask="9999-99-99"
                    showIcon
                />
                <label htmlFor="passport-issue-date">{t("Passport")} {t("Issue Date")}</label>
            </span>
            <span className="p-float-label">
                <Calendar
                    className="w-full"
                    id="passport-expiry-date"
                    value={form.passport.expiry_date}
                    onChange={(ev) => setForm({
                        ...form,
                        passport: {
                            ...form.passport,
                            expiry_date: ev.target.value ?? undefined,
                        }
                    })}
                    dateFormat="yy-mm-dd"
                    mask="9999-99-99"
                    showIcon
                />
                <label htmlFor="passport-expiry-date">{t("Passport")} {t("Expiry Date")}</label>
            </span>

            <FileInput
                file={form.passport.image}
                onChange={(file) => setForm({
                    ...form,
                    passport: {
                        ...form.passport,
                        image: file,
                    }
                })}
            />
        </div>
    );

    let nationalIdWidget = (
        <div
            className="flex flex-column w-full align-items-stretch pt-3"
            style={{ gap: "2rem" }}
        >
            <span className="p-float-label">
                <InputText
                    value={form.national_id.id}
                    id="national-id"
                    className="p-inputtext-sm w-full"
                    onChange={(ev) => setForm({
                        ...form,
                        national_id: {
                            ...form.national_id,
                            id: ev.target.value,
                        }
                    })}
                />
                <label htmlFor="national-id">{t("National ID")} {t("Number")}</label>
            </span>

            <span className="p-float-label">
                <Calendar
                    className="w-full"
                    id="national-id-registration-date"
                    value={form.national_id.registration_date}
                    onChange={(ev) => setForm({
                        ...form,
                        national_id: {
                            ...form.national_id,
                            registration_date: ev.target.value ?? undefined,
                        }
                    })}
                    dateFormat="yy-mm-dd"
                    mask="9999-99-99"
                    showIcon
                />
                <label htmlFor="national-id-registration-date">
                    {t("National ID")} {t("Registration Date")}
                </label>
            </span>

            <FileInput
                file={form.national_id.image}
                onChange={(file) => setForm({
                    ...form,
                    national_id: {
                        ...form.national_id,
                        image: file,
                    }
                })}
            />
        </div>
    );

    let otherIdentificationDocumentWidget = <div
        className="flex flex-column w-full align-items-stretch pt-3"
        style={{ gap: "2rem" }}
    >

        <span className="p-float-label">
            <InputText
                value={form.other_identification_document.name}
                id="other-id-name"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setForm({
                    ...form,
                    other_identification_document: {
                        ...form.other_identification_document,
                        name: ev.target.value,
                    }
                })}
            />
            <label htmlFor="other-id-name">{t("Other ID Name")}</label>
        </span>

        <FileInput
            file={form.other_identification_document.image}
            onChange={(file) => setForm({
                ...form,
                other_identification_document: {
                    ...form.other_identification_document,
                    image: file,
                }
            })}

        />
    </div>;

    return (<>
        <i>
            ({t("At least ONE form of identification is mandatory")})
            <span className="text-red-500">*</span>
        </i>
        <TabView className="flex flex-column">
            <TabPanel header={t("Citizenship")}>
                {citizenshipWidget}
            </TabPanel>
            <TabPanel header={t("Passport")}>
                {passportWidget}
            </TabPanel>
            <TabPanel header={t("National ID")}>
                {nationalIdWidget}
            </TabPanel>
            <TabPanel header={t("Other ID")}>
                {otherIdentificationDocumentWidget}
            </TabPanel>
        </TabView>
    </>
    );
}
