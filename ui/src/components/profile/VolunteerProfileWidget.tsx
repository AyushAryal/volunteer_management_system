import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { LocationSelector } from '@components/LocationSelector';
import { useContext, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { FloatLabel } from 'primereact/floatlabel';
import { VolunteerFormContext } from '@forms/volunteer';

export function VolunteerProfileAddressWidget() {
    let { form, setForm } = useContext(VolunteerFormContext);
    let [selectedTemporaryProvince, setTemporaryProvince] = useState<string | null>(null);
    let [selectedTemporaryDistrict, setTemporaryDistrict] = useState<string | null>(null);
    let [selectedTemporaryMunicipality, setTemporaryMunicipality] = useState<string | null>(null);

    let [selectedPermanentProvince, setPermanentProvince] = useState<string | null>(null);
    let [selectedPermanentDistrict, setPermanentDistrict] = useState<string | null>(null);
    let [selectedPermanentMunicipality, setPermanentMunicipality] = useState<string | null>(null);

    const temporaryLocationSelector = <LocationSelector
        selectedProvince={selectedTemporaryProvince}
        onChangeSelectedProvince={setTemporaryProvince}
        selectedDistrict={selectedTemporaryDistrict}
        onChangeSelectedDistrict={setTemporaryDistrict}
        selectedMunicipality={selectedTemporaryMunicipality}
        onChangeSelectedMunicipality={setTemporaryMunicipality}
        selectedWard={form.volunteer.temporary_ward}
        onChangeSelectedWard={(ward) => setForm({
            ...form,
            volunteer: {
                ...form.volunteer,
                temporary_ward: ward
            }
        })}
    />;

    const permanentLocationSelector = <LocationSelector
        selectedProvince={selectedPermanentProvince}
        onChangeSelectedProvince={setPermanentProvince}
        selectedDistrict={selectedPermanentDistrict}
        onChangeSelectedDistrict={setPermanentDistrict}
        selectedMunicipality={selectedPermanentMunicipality}
        onChangeSelectedMunicipality={setPermanentMunicipality}
        selectedWard={form.volunteer.permanent_ward}
        onChangeSelectedWard={(ward) => setForm({
            ...form,
            volunteer: {
                ...form.volunteer,
                permanent_ward: ward
            }
        })}
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


export function VolunteerProfileOptionalWidget() {
    let { form, setForm } = useContext(VolunteerFormContext);

    return <div
        className="flex flex-column w-full align-items-stretch"
        style={{ gap: "2rem" }}
    >
        <span className="p-float-label">
            <InputText
                value={form.volunteer.organization_name}
                id="organization-name"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setForm({
                    ...form,
                    volunteer: {
                        ...form.volunteer,
                        organization_name: ev.target.value,
                    }
                })}
            />
            <label htmlFor="organization-name">
                Organization Name <span className="text-xs">(optional)</span>
            </label>
        </span>

        <span className="p-float-label">
            <InputMask
                value={form.volunteer.organization_phone_number}
                id="organization-phone-number"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setForm({
                    ...form,
                    volunteer: {
                        ...form.volunteer,
                        organization_phone_number: ev.target.value ?? "",
                    }
                })}
                mask="(+999)-9999999999"
            />
            <label htmlFor="organization-phone-number">
                Organization Phone Number{" "}
                <span className="text-xs">(optional)</span>
            </label>
        </span>

        <span className="p-float-label">
            <InputText
                value={form.volunteer.organization_website}
                id="organization-website"
                className="p-inputtext-sm w-full"
                onChange={(ev) => setForm({
                    ...form,
                    volunteer: {
                        ...form.volunteer,
                        organization_website: ev.target.value,
                    }
                })}
            />
            <label htmlFor="organization-website">
                Organization Website <span className="text-xs">(optional)</span>
            </label>
        </span>
    </div >;

}

export function VolunteerProfileRequiredWidget() {
    let { form, setForm } = useContext(VolunteerFormContext);

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
                        value={form.volunteer.first_name}
                        id="first-name"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setForm({
                            ...form,
                            volunteer: {
                                ...form.volunteer,
                                first_name: ev.target.value
                            }
                        })}
                    />
                    <label htmlFor="first-name">
                        First Name <span className="text-sm text-red-500">*</span>
                    </label>
                </span>
                <span className="p-float-label">
                    <InputText
                        value={form.volunteer.last_name}
                        id="last-name"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setForm({
                            ...form,
                            volunteer: {
                                ...form.volunteer,
                                last_name: ev.target.value
                            }
                        })}
                    />
                    <label htmlFor="last-name">
                        Last Name <span className="text-sm text-red-500">*</span>
                    </label>
                </span>
                <FloatLabel>
                    <InputMask
                        value={form.volunteer.contact_number}
                        id="contact-number"
                        mask="(+999)-9999999999"
                        className="p-inputtext-sm w-full"
                        onChange={(ev) => setForm({
                            ...form,
                            volunteer: {
                                ...form.volunteer,
                                contact_number: ev.target.value ?? ""
                            }
                        })}
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
                        value={form.volunteer.date_of_birth}
                        onChange={(ev) => setForm({
                            ...form,
                            volunteer: {
                                ...form.volunteer,
                                date_of_birth: ev.target.value ?? undefined
                            }
                        })}
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
                            checked={form.volunteer.gender === "Male"}
                            onChange={(ev) => setForm({
                                ...form,
                                volunteer: {
                                    ...form.volunteer,
                                    gender: ev.value,
                                }
                            })}
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
                            checked={form.volunteer.gender === "Female"}
                            onChange={(ev) => setForm({
                                ...form,
                                volunteer: {
                                    ...form.volunteer,
                                    gender: ev.value,
                                }
                            })}
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
                            checked={form.volunteer.gender === "Other"}
                            onChange={(ev) => setForm({
                                ...form,
                                volunteer: {
                                    ...form.volunteer,
                                    gender: ev.value,
                                }
                            })}
                        />
                        <label htmlFor="other" className="ml-2 text-gray-800">
                            Other
                        </label>
                    </div>
                </div>
                <Dropdown
                    value={form.volunteer.blood_group}
                    onChange={(ev) => setForm({
                        ...form,
                        volunteer: {
                            ...form.volunteer,
                            blood_group: ev.value,
                        }
                    })}
                    options={bloodGroups}
                    placeholder="Select a blood group"
                    optionLabel="value"
                />

                <Dropdown
                    value={form.volunteer.academic_qualification}
                    onChange={(ev) => setForm({
                        ...form,
                        volunteer: {
                            ...form.volunteer,
                            academic_qualification: ev.value,
                        }
                    })}
                    options={academicQualifications}
                    placeholder="Select a academic qualification"
                    optionLabel="value"
                />
                <Dropdown
                    value={form.volunteer.nationality}
                    onChange={(ev) => setForm({
                        ...form,
                        volunteer: {
                            ...form.volunteer,
                            nationality: ev.value,
                        }
                    })}
                    options={nationalities}
                    placeholder="Select a Nationality"
                    optionLabel="value"
                />
                <Dropdown
                    value={form.volunteer.category}
                    onChange={(ev) => setForm({
                        ...form,
                        volunteer: {
                            ...form.volunteer,
                            category: ev.value,
                        }
                    })}
                    options={volunteerCategories}
                    placeholder="Select a category"
                    optionLabel="value"
                />

            </div>
        </div>
    );
}


export function VolunteerProfileWidget() {
    return (
        <div>
            <VolunteerProfileRequiredWidget />
            <h2> Optional fields </h2>
            <VolunteerProfileOptionalWidget />
            <h2> Address Information </h2>
            <VolunteerProfileAddressWidget />
        </div>
    );
}
