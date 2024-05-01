import { useState } from 'react';
import { useHookstate } from '@hookstate/core';
import { storeState } from '../models/store';
import { faMap, faUser, faUserPlus, faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { RadioButton } from 'primereact/radiobutton';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';

import {
    Province,
    District,
    Municipality
} from '../models/federal';
import { signup } from '../api/incident';
import { get_id } from '../api/utils';


export function Signup() {
    const bloodGroups = ["O Negative",
        "O Positive",
        "A Negative",
        "A Positive",
        "B Negative",
        "B Positive",
        "Ab Negative",
        "Ab Positive",
    ];
    const nationalities = ["National", "International"];

    const [email, setEmail] = useState<string>();
    const [password, setPassword] = useState<string>();
    const [confirmPassword, setConfirmPassword] = useState<string>();
    const [fullName, setFullName] = useState<string>();
    const [dateOfBirth, setDateOfBirth] = useState<string>();
    const [nationality, setNationality] = useState<string>();
    const [bloodGroup, setBloodGroup] = useState<string>();
    const [termsAccepted, setTermsAccepted] = useState<boolean>(false);
    const [gender, setGender] = useState<string>();
    const [formErrors, setFormErrors] = useState<string>();

    const store = useHookstate(storeState);
    const [selectedDistrict, setDistrict] = useState<string | null>(null);
    const [selectedProvince, setProvince] = useState<string | null>(null);
    const [selectedMunicipality, setMunicipality] = useState<string | null>(null);

    const updateProvince = (province: Province | undefined) => {
        setMunicipality(null);
        setDistrict(null);
        setProvince(province?.url ?? null);
    };

    const updateDistrict = (district: District | undefined) => {
        setMunicipality(null);
        setDistrict(district?.url ?? null);
        let province = store.provinceList.get().find((province) => province.url === district?.province);
        if (province !== undefined) {
            setProvince(province?.url ?? null);
        }
    };

    const updateMunicipality = (municipality: Municipality | undefined) => {
        setMunicipality(municipality?.url ?? null);
        let district = store.districtList.get().find((district) => district.url === municipality?.district);
        if (district !== undefined) {
            setDistrict(district?.url ?? null);
            let province = store.provinceList.get().find((province) => province.url === district?.province);
            setProvince(province?.url ?? null);
        }
    };

    const progressSpinner = <ProgressSpinner style={{ width: '50px', height: '50px' }} />;

    const locationSelector = (
        <div className="flex flex-column justify-content-center align-content-center">
            <Dropdown
                value={store.provinceList.get().find((province) => selectedProvince == province.url)}
                onChange={(ev) => { updateProvince(ev.value); }}
                options={store.provinceList.get() as Province[]}
                emptyMessage={store.provinceList.get().length == 0 ? progressSpinner : null}
                optionLabel="name"
                showClear
                placeholder="Select a province"
            />
            <Dropdown
                value={store.districtList.get().find((district) => selectedDistrict == district.url)}
                onChange={(ev) => { updateDistrict(ev.value); }}
                options={store.districtList.get() as District[]}
                emptyMessage={store.districtList.get().length == 0 ? progressSpinner : null}
                optionLabel="name"
                showClear
                filter
                placeholder="Select a district" />
            <Dropdown
                value={store.municipalityList.get().find((municipality) => selectedMunicipality == municipality.url)}
                onChange={(ev) => { updateMunicipality(ev.value); }}
                options={store.municipalityList.get() as Municipality[]}
                emptyMessage={store.municipalityList.get().length == 0 ? progressSpinner : null}
                optionLabel="name"
                showClear
                filter
                placeholder="Select a municipality"
            />
        </div >
    );

    const onClick = () => {
        if (!password || !confirmPassword) {
            setFormErrors("Password cannot be empty");
        } else if (password != confirmPassword) {
            setFormErrors("Password is not the same as confirm password");
        } else {
            console.log(dateOfBirth);
            const form = {
                email, password,
                "volunteer": {
                    "full_name": fullName,
                    "date_of_birth": dateOfBirth,
                    "blood_group": bloodGroup,
                    gender,
                    nationality,
                    "municipality": selectedMunicipality,
                }
            };

            signup(JSON.stringify(form)).then((response) => {
                if (response.status != 201) {
                    response.json().then((json) => {

                        setFormErrors(JSON.stringify(json));
                    })
                } else {
                    setFormErrors("");
                }
            }).catch((reason) => {
                setFormErrors(reason);
            });
        }

    }

    let response = <> </>;
    if (formErrors === "") {
        response = <div className="flex flex-row align-items-center">
            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" style={{ fontSize: "2rem" }} />
            &nbsp; <span> Vertification Email Sent </span>
        </div>

    } else {
        response = <div className="flex flex-row align-items-center">
            &nbsp; <span>{formErrors}</span>
        </div>;
    }

    return <div
        className="flex py-5"
        style={{ minHeight: "100vh", background: "radial-gradient(var(--red-600) 0%,var(--primary-color) 100%)" }}
    >
        <div
            className="mx-auto border-round p-4 px-5"
            style={{ maxWidth: "90ch", minWidth: "90ch", backgroundColor: "var(--surface-ground)" }}>
            <div className="mx-auto text-center text-2xl mb-5 pb-5 pt-2">
                <span className="font-semibold" style={{ color: "var(--primary-color)" }}>
                    <FontAwesomeIcon icon={faUserPlus} />&nbsp;
                    Sign Up
                </span> As
                <span className="font-semibold" style={{ color: "var(--red-600)", borderBottom: "1px solid var(--red-600)" }}> Volunteers </span>
            </div>
            <div className="flex flex-row justify-content-evenly mx-3" style={{ gap: "2rem" }}>
                <div className="flex flex-column w-full align-items-stretch" style={{ gap: "2rem" }}>
                    <div className="text-xl">
                        <FontAwesomeIcon icon={faUser} />&nbsp;
                        Personal Information
                    </div>
                    <span className="p-float-label">
                        <InputText id="email" className="p-inputtext-sm w-full" onChange={(ev) => setEmail(ev.target.value)} />
                        <label htmlFor="email">Email</label>
                    </span>
                    <span className="p-float-label">
                        <Password feedback={false} id="password" aria-describedby="password-help" onChange={(ev) => setPassword(ev.target.value)} />
                        <label htmlFor="password">Password</label>
                    </span>
                    <span className="p-float-label">
                        <Password feedback={false} id="password-confirm" aria-describedby="password-confirm-help" onChange={(ev) => setConfirmPassword(ev.target.value)} />
                        <label htmlFor="password-confirm">Confirm Password</label>
                    </span>
                    <span className="p-float-label">
                        <InputText id="full-name" className="p-inputtext-sm w-full" onChange={(ev) => setFullName(ev.target.value)} />
                        <label htmlFor="full-name">Full Name</label>
                    </span>
                    <span className="p-float-label">
                        <InputMask id="date-of-birth" mask="9999-99-99" placeholder="yyyy-mm-dd" className="p-inputtext-sm w-full" onChange={(ev) => ev.target.value && setDateOfBirth(ev.target.value)}></InputMask>
                        <label htmlFor="date-of-birth">Date of birth (yyyy-mm-dd)</label>
                    </span>
                    <div className="flex flex-wrap gap-3">
                        <div className="flex align-items-center">
                            <RadioButton inputId="male" name="male" value="Male" checked={gender === "Male"} onChange={(e) => { setGender(e.value) }} />
                            <label htmlFor="male" className="ml-2">Male</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="female" name="female" value="Female" checked={gender === "Female"} onChange={(e) => { setGender(e.value) }} />
                            <label htmlFor="female" className="ml-2">Female</label>
                        </div>
                        <div className="flex align-items-center">
                            <RadioButton inputId="other" name="other" value="Other" checked={gender === "Other"} onChange={(e) => { setGender(e.value) }} />
                            <label htmlFor="other" className="ml-2">Other</label>
                        </div>
                    </div>

                    <Dropdown
                        value={bloodGroup}
                        onChange={(ev) => { setBloodGroup(ev.value); }}
                        options={bloodGroups}
                        placeholder="Select a blood group"
                    />

                    <Dropdown
                        value={nationality}
                        onChange={(ev) => { setNationality(ev.value); }}
                        options={nationalities}
                        placeholder="Select a Nationality"
                    />
                </div>
                <div className="flex flex-column w-full align-items-center">
                    <div className="flex flex-column w-full" style={{ gap: "1rem" }}>
                        <div className="text-xl">
                            <FontAwesomeIcon icon={faMap} />&nbsp;
                            Address Information
                        </div>
                        {locationSelector}
                        <div className="text-sm text-400">
                            <Checkbox onChange={e => setTermsAccepted(e.checked ?? false)} checked={termsAccepted}></Checkbox>
                            <span className="ml-2"> Accept Terms & Conditions </span>
                        </div>
                        <Button label="Submit" disabled={!termsAccepted === true || formErrors === ""} onClick={onClick} />
                        {response}
                    </div>
                </div>
            </div>
        </div>
    </div >;
}
