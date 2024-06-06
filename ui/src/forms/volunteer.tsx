import { FormState } from '@api/form';
import { signup, update_volunteer_profile } from '@api/incident';
import { describe_api_errors } from '@api/utils';
import { AcademicQualification, BloodGroup, Certificate, Gender, Nationality, Training, VolunteerCategory } from '@models/incident';
import { LatLngTuple } from 'leaflet';
import { createContext } from 'react';

function serialize_point(point: LatLngTuple | undefined) {
    if (point) {
        return {
            "type": "Point",
            "coordinates": [point[1], point[0]],
        }
    }
    return null;
}

function all_values_logically_present(object: object) {
    return Object.entries(object).reduce((acc, [_, value]) => {
        return (value !== undefined && value !== "") && acc;
    }, true);
}

export async function perform_signup(form: VolunteerForm): Promise<FormState> {
    try {
        if (!form.password || !form.confirm_password) {
            throw Error("Password cannot be empty");
        } else if (form.password != form.confirm_password) {
            throw Error("Password is not the same as confirm password");
        }
    } catch (err) {
        return FormState.fromError((err as Error).message);
    }

    let body: any = {
        "email": form.email,
        "password": form.password,
        "volunteer": {
            "first_name": form.volunteer.first_name,
            "last_name": form.volunteer.last_name,
            "contact_number": form.volunteer.contact_number,
            "date_of_birth": form.volunteer.date_of_birth?.toISOString().split('T')[0],
            "blood_group": form.volunteer.blood_group,
            "active": form.volunteer.active,
            "gender": form.volunteer.gender,
            "nationality": form.volunteer.nationality,
            "academic_qualification": form.volunteer.academic_qualification,
            "category": form.volunteer.category,
            "temporary_ward": form.volunteer.temporary_ward,
            "permanent_ward": form.volunteer.permanent_ward,
            "point": serialize_point(form.volunteer.point),
        },
        "citizenship": {
            "id": form.citizenship?.id,
            "registration_district": form.citizenship.registration_district,
            "registration_date": form.citizenship.registration_date?.toISOString().split('T')[0],
            "image": form.citizenship?.image,
        },
        "national_id": {
            "id": form.national_id?.id,
            "registration_date": form.national_id.registration_date?.toISOString().split('T')[0],
            "image": form.national_id?.image,
        },
        "passport": {
            "id": form.passport?.id,
            "issue_date": form.passport.issue_date?.toISOString().split('T')[0],
            "expiry_date": form.passport.expiry_date?.toISOString().split('T')[0],
            "image": form.passport?.image,
        },
        "other_identification_document": {
            "name": form.other_identification_document?.name,
            "image": form.other_identification_document?.image,
        },
        "certificates": []
    };


    // If all fields is not present we don't send the entire object.
    for (let key of ["citizenship", "passport", "national_id", "other_identification_document"]) {
        if (!all_values_logically_present(body[key])) {
            body = Object.fromEntries(Object.entries(body).filter(([k, _]) => k !== key));
        }
    }

    let response = await signup(JSON.stringify(body));
    if (response.status == 400) {
        return FormState.fromError(describe_api_errors(await response.json()));
    } else if (response.status == 201) {
        return FormState.fromSubmitted(true);
    } else {
        return FormState.fromError("Network failure. Please try again");
    }
}

export async function perform_volunteer_update(form: VolunteerForm): Promise<FormState> {
    let body: any = {
        "email": form.email,
        //"password": form.password == "" ? undefined : form.password,
        "volunteer": {
            "first_name": form.volunteer.first_name,
            "last_name": form.volunteer.last_name,
            "profile_image": form.volunteer.profile_image ?? "",
            "contact_number": form.volunteer.contact_number,
            "date_of_birth": form.volunteer.date_of_birth?.toISOString().split('T')[0],
            "blood_group": form.volunteer.blood_group,
            "active": form.volunteer.active,
            "gender": form.volunteer.gender,
            "nationality": form.volunteer.nationality,
            "academic_qualification": form.volunteer.academic_qualification,
            "category": form.volunteer.category,
            "temporary_ward": form.volunteer.temporary_ward,
            "permanent_ward": form.volunteer.permanent_ward,
            "point": serialize_point(form.volunteer.point),
        },
        "citizenship": {
            "id": form.citizenship?.id,
            "registration_district": form.citizenship.registration_district,
            "registration_date": form.citizenship.registration_date?.toISOString().split('T')[0],
            "image": form.citizenship?.image,
        },
        "national_id": {
            "id": form.national_id?.id,
            "registration_date": form.national_id.registration_date?.toISOString().split('T')[0],
            "image": form.national_id?.image,
        },
        "passport": {
            "id": form.passport?.id,
            "issue_date": form.passport.issue_date?.toISOString().split('T')[0],
            "expiry_date": form.passport.expiry_date?.toISOString().split('T')[0],
            "image": form.passport?.image,
        },
        "other_identification_document": {
            "name": form.other_identification_document?.name,
            "image": form.other_identification_document?.image,
        },
        "certificates": [],
        "trainings": form.trainings,
    };

    // If all fields is not present we don't send the entire object.
    for (let key of ["citizenship", "passport", "national_id", "other_identification_document"]) {
        if (!all_values_logically_present(form[key as keyof typeof form] as object)) {
            body = Object.fromEntries(Object.entries(body).filter(([k, _]) => k !== key));
        }
    }

    let response = await update_volunteer_profile(form.volunteer.url, JSON.stringify(body));
    if (response.ok) {
        return FormState.fromSubmitted(true, response);
    } else if (response.status == 400) {
        return FormState.fromError(describe_api_errors(await response.json()));
    } else {
        return FormState.fromError("Network failure. Please try again");
    }
}

export type VolunteerForm = {
    terms_accepted: boolean,
    email: string,
    password: string,
    confirm_password: string,
    volunteer: {
        url: string,
        user: string,
        profile_image?: string,
        first_name: string,
        last_name: string,
        contact_number: string,
        active: boolean,
        date_of_birth?: Date,
        blood_group?: BloodGroup,
        academic_qualification?: AcademicQualification,
        gender?: Gender,
        nationality?: Nationality,
        category?: VolunteerCategory,
        temporary_ward: string | null,
        permanent_ward: string | null,
        point: LatLngTuple | undefined,
        organization_name?: string,
        organization_phone_number?: string,
        organization_website?: string,
    },
    citizenship: {
        id?: string,
        registration_date?: Date,
        registration_district?: string,
        image?: string,
    },
    passport: {
        id?: string,
        expiry_date?: Date,
        issue_date?: Date,
        image?: string,
    },
    national_id: {
        id?: string,
        registration_date?: Date,
        image?: string,
    },
    other_identification_document: {
        name?: string,
        image?: string,
    },
    certificates: Certificate[],
    trainings: Training[],
}

export type VolunteerFormState = {
    form: VolunteerForm,
    setForm: (form: VolunteerForm) => void
}

export let VolunteerFormContext = createContext<VolunteerFormState>({} as VolunteerFormState);

