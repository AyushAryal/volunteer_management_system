import { Dialog } from 'primereact/dialog';
import {
    Volunteer,
    VolunteerDeserializer,
} from '@models/incident';
import { Button } from 'primereact/button';
import { useHookstate } from '@hookstate/core';
import { storeState } from '@models/store';
import { VolunteerProfileWidget } from './VolunteerProfileWidget';
import { IdentificationDocumentsWidget } from './IdentificationDocumentsWidget';
import { VolunteerForm, VolunteerFormContext, perform_volunteer_update } from '@forms/volunteer';
import { useState } from 'react';
import { FormState } from '@api/form';
import { ProfileImageUpload } from './ProfileImageUpload';


type VolunteerUpdateFormProps = {
    visible: boolean,
    setVisible: (visible: boolean) => void,
}

export function VolunteerUpdateForm(props: VolunteerUpdateFormProps) {
    const volunteerState = useHookstate(storeState.volunteer);
    const volunteer = volunteerState.get() as Volunteer;
    if (volunteer == null) return null;

    const [formState, setFormState] = useState<FormState>(FormState.init());
    let [form, setForm] = useState<VolunteerForm>({
        terms_accepted: true,
        email: volunteer.email,
        password: volunteer.password,
        confirm_password: volunteer.password,
        volunteer: {
            url: volunteer.volunteer.url,
            user: volunteer.volunteer.user,
            profile_image: volunteer.volunteer.profile_image ?? null,
            first_name: volunteer.volunteer.first_name,
            last_name: volunteer.volunteer.last_name,
            contact_number: volunteer.volunteer.contact_number,
            date_of_birth: volunteer.volunteer.date_of_birth,
            blood_group: volunteer.volunteer.blood_group,
            academic_qualification: volunteer.volunteer.academic_qualification,
            gender: volunteer.volunteer.gender,
            nationality: volunteer.volunteer.nationality,
            category: volunteer.volunteer.category,
            temporary_ward: volunteer.volunteer.temporary_ward,
            permanent_ward: volunteer.volunteer.permanent_ward,
            point: volunteer.volunteer.point,
            organization_name: volunteer.volunteer.organization_name,
            organization_phone_number: volunteer.volunteer.organization_phone_number,
            organization_website: volunteer.volunteer.organization_website,
        },
        citizenship: {
            id: volunteer.citizenship?.id,
            registration_date: volunteer.citizenship?.registration_date,
            registration_district: volunteer.citizenship?.registration_district,
            image: volunteer.citizenship?.image,
        },
        passport: {
            id: volunteer.passport?.id,
            expiry_date: volunteer.passport?.expiry_date,
            issue_date: volunteer.passport?.issue_date,
            image: volunteer.passport?.image,
        },
        national_id: {
            id: volunteer.national_id?.id,
            registration_date: volunteer.national_id?.registration_date,
            image: volunteer.national_id?.image,
        },
        other_identification_document: {
            name: volunteer.other_identification_document?.name,
            image: volunteer.other_identification_document?.image,
        },
        certificates: [],
        trainings: [],
    });


    let response;
    if (formState.isSubmitted() && !formState.hasErrors()) {
        response = <div
            style={{ color: "var(--green-600)", fontWeight: "bold" }}
            className="my-2"
        >
            <span>Profile Updated!</span>
        </div>
    } else if (formState.hasErrors()) {
        response = formState.getErrorAsElement();
    }

    return <VolunteerFormContext.Provider value={{ form, setForm }} >
        <Dialog
            visible={props.visible}
            style={{ width: '50vw' }}
            onHide={() => { props.setVisible(false); }}>
            <div className="flex flex-column gap-2">
                <div className="flex gap-5 align-items-center mb-4">
                    <div className="flex flex-column justify-content-center align-items-center">
                        <ProfileImageUpload
                            file={form.volunteer.profile_image}
                            onChange={(file) => setForm({
                                ...form,
                                volunteer: {
                                    ...form.volunteer,
                                    profile_image: file,
                                }
                            })}
                        />
                    </div>
                    <h1>{`${form.volunteer.first_name} ${form.volunteer.last_name}`}</h1>
                </div>
            </div>

            <h2> Profile Information </h2>
            <VolunteerProfileWidget />
            <h2> Identification </h2>
            <IdentificationDocumentsWidget />
            <div className="flex gap-4 align-self-end align-items-center mt-5">
                {response}
                <Button
                    label="Save"
                    onClick={async () => {
                        let newFormState = await perform_volunteer_update(form)
                        if (!newFormState.hasErrors() && newFormState.response) {
                            volunteerState.set(VolunteerDeserializer(await newFormState.response.json()));
                        }
                        setFormState(await perform_volunteer_update(form));
                    }}
                />
            </div>
        </Dialog>
    </VolunteerFormContext.Provider >;
}
