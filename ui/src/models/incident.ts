import { LatLngTuple } from "leaflet";
import { IDeserializer } from "./deserializer";
import { flip_point } from "./geojson";

export type Gender = "Male" | "Female" | "Other";
export type Nationality = "National" | "International";
export type BloodGroup = "O Negative" | "O Positive"
    | "A Negative" | "A Positive"
    | "B Negative" | "B Positive"
    | "Ab Negative" | "Ab Positive";

export type VolunteerCategory = "Student" |
    "RSS" |
    "Retired APF" |
    "Retired Army" |
    "Retired Government Service" |
    "Senior Citizen" |
    "Community" |
    "General";

export interface Incident {
    url: string,
    name: string,
    description: string,
    date: Date,
    point: LatLngTuple,
    municipality: string,
    severity: string,
}

export const IncidentDeserializer: IDeserializer<Incident> = (json: any) => {
    flip_point(json.point.coordinates);
    json.point = json.point.coordinates;
    json.date = new Date(json.date);
    return json as Incident;
}

export interface Program {
    url: string,
    name: string,
    description: string,
    incident: string,
}

export interface Job {
    url: string,
    name: string,
    description: string,
    start_date: Date,
    end_date: Date,
    program: string,
}

export const JobDeserializer: IDeserializer<Job> = (json: any) => {
    json.start_date = new Date(json.start_date);
    json.end_date = new Date(json.end_date);
    return json as Job;
}

export interface VolunteerProfile {
    url: string,
    user: string,
    first_name: string,
    last_name: string,
    contact_number: string,
    profile_image: string,
    date_of_birth: string,
    gender: Gender,
    category: VolunteerCategory,
    blood_group: BloodGroup,
    nationality: Nationality,
    temporary_municipality: string,
    permanent_municipality: string,
    citizenship_id: string,
    citizenship_issue_date: string,
    citizenship_isssue_district: string,
    national_id_reg_date: string,
    national_id_number: string,
    passport_number: string,
    passport_issue_date: string,
    passpoert_expiry_date: string,
}

export interface SiteContent {
    label: string;
    content: string;
}
