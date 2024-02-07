import { LatLngTuple } from "leaflet";

export type Gender = "Male" | "Female" | "Other";
export type Nationality = "National" | "International";
export type BloodGroup = "O Negative" | "O Positive" | "A Negative" | "A Positive" | "B Negative" | "B Positive" | "AB Negative" | "AB Positive";

export interface Incident {
    name: string,
    description: string,
    date: string,
    point: LatLngTuple,
    municipality: string,
}

export interface Program {
    name: string,
    description: string,
    incident: string,
}

export interface Job {
    name: string,
    description: string,
    start_date: string,
    end_date: string,
}

export interface VolunteerProfile {
    user: string,
    full_name: string,
    profile_image: string,
    date_of_birth: string,
    gender: Gender,
    blood_group: BloodGroup,
    nationality: Nationality,
    municipality: string,
}
