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
    "Scout" |
    "Retiredapf" |
    "Retiredarmy" |
    "Retiredgovernmentservice" |
    "Seniorcitizen" |
    "Community" |
    "General";

export type AcademicQualification = "Secondarylevel" |
    "Highschool" |
    "Undergrad" |
    "Grad" |
    "Doctorate" |
    "Postdoc";

export type TrainingCategory = "Rescue" | "Reliefdistribution" | "Evacuation" | "Other" |
    "Healthandsafety" | "Logistics" | "Softskills" | "Leadership" |
    "Teamtraining" | "Management" | "Qualitytraining" | "Humanitarian" |
    "Familyreunification" | "Motorvehicleoperator" | "";

export type JobStatus = "Completed" | "In Progress" | "Not Assigned";
export type JobApplicationStatus = "Accepted" | "Rejected" | "Pending" | "Cancelled";

export interface Incident {
    url: string,
    name: string,
    description: string,
    date: Date,
    point: LatLngTuple,
    ward: string,
    severity: string,
    jobs: number,
    programs: number,
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


export interface LeaderProfile {
    first_name: string,
    last_name: string,
    profile_image: string,
}

export interface Job {
    url: string,
    name: string,
    description: string,
    start_date: Date,
    end_date: Date,
    program: string,
    status: JobStatus,
    application_status: JobApplicationStatus | "Not applied",
    vacancy: number,
    filled_positions: number,
    leader: LeaderProfile | null,
}

export const JobDeserializer: IDeserializer<Job> = (json: any) => {
    json.start_date = new Date(json.start_date);
    json.end_date = new Date(json.end_date);
    return json as Job;
}

export interface Report {
    url: string,
    volunteer: ReportVolunteer,
    report: string,
    job: ReportJob,
}

export interface ReportVolunteer {
    url: string,
    first_name: string,
    last_name: string,
    profile_image: string,
}

export interface ReportJob {
    url: string,
    name: string,
    start_date: Date,
    end_date: Date,
}

export const ReportJobDeserializer: IDeserializer<ReportJob> = (json: any) => {
    json.start_date = new Date(json.start_date)
    json.end_date = new Date(json.end_date)
    return json as ReportJob

}

export interface VolunteerProfile {
    url: string,
    user: string,
    first_name: string,
    last_name: string,
    contact_number: string,
    profile_image: string,
    date_of_birth?: Date,
    gender?: Gender,
    category?: VolunteerCategory,
    blood_group?: BloodGroup,
    academic_qualification?: AcademicQualification,
    nationality?: Nationality,
    temporary_ward: string,
    permanent_ward: string,
    point?: LatLngTuple,
    organization_name?: string,
    organization_phone_number?: string,
    organization_website?: string,
}

export const VolunteerProfileDeserializer: IDeserializer<VolunteerProfile> = (json: any) => {
    json.date_of_birth = new Date(json.date_of_birth);
    if (json.point !== null) {
        flip_point(json.point.coordinates);
        json.point = json.point.coordinates;
    }
    return json as VolunteerProfile;
}

export interface VolunteerGeotag {
    point: LatLngTuple
}

export const VolunteerGeotagDeserializer: IDeserializer<VolunteerGeotag> = (json: any) => {
    flip_point(json.point.coordinates);
    json.point = json.point.coordinates;
    return json as VolunteerGeotag;
}

export interface Citizenship {
    id: string,
    registration_date: Date,
    registration_district: string,
    image: string,
}

export const CitizenshipDeserializer: IDeserializer<Citizenship> = (json: any) => {
    json.registration_date = new Date(json.registration_date);
    return json as Citizenship;
}

export interface Passport {
    id: string,
    issue_date: Date,
    expiry_date: Date,
    image: string,
}

export const PassportDeserializer: IDeserializer<Passport> = (json: any) => {
    json.issue_date = new Date(json.issue_date);
    json.expiry_date = new Date(json.expiry_date);
    return json as Passport;
}

export interface NationalId {
    id: string,
    registration_date: Date,
    image: string,
}

export const NationalIdDeserializer: IDeserializer<NationalId> = (json: any) => {
    json.registration_date = new Date(json.registration_date);
    return json as NationalId;
}


export interface OtherIdentificationDocument {
    name: string,
    image: string,
}

export interface Training {
    name: string,
    subject: string,
    category: TrainingCategory,
    image: string,
}

export interface Certificate {
    image: string,
}

export interface Volunteer {
    email: string,
    password: string,
    volunteer: VolunteerProfile,
    citizenship?: Citizenship,
    passport?: Passport,
    national_id?: NationalId,
    other_identification_document?: OtherIdentificationDocument,
    certificates: Certificate[],
    trainings: Training[],
}

export const VolunteerDeserializer: IDeserializer<Volunteer> = (json: any) => {
    json.volunteer = json.volunteer === null ? null : VolunteerProfileDeserializer(json.volunteer);
    json.citizenship = json.citizenship === null ? null : CitizenshipDeserializer(json.citizenship);
    json.passport = json.passport === null ? null : PassportDeserializer(json.passport);
    json.national_id = json.national_id === null ? null : NationalIdDeserializer(json.national_id);
    return json as Volunteer;
}

export interface SiteContent {
    label: string;
    content: string;
}

export interface Statistics {
    volunteers: {
        total: number,
        gender: { [key: string]: number },
        nationality: { [key: string]: number },
        blood_group: { [key: string]: number },
        academic_qualification: { [key: string]: number },
        category: { [key: string]: number },
        by_federal: { [key: string]: number }
    }
    jobs: {
        total: number,
        status: { [key: string]: number },
        by_time: { date: Date, value: number }[]
        by_federal: { [key: string]: number }
    },
    incidents: {
        total: number,
        by_time: { date: Date, value: number }[]
        by_federal: { [key: string]: number }
    },
    programs: {
        total: number,
        by_time: { date: Date, value: number }[]
        by_federal: { [key: string]: number }
    }
}

export const StatisticsDeserializer: IDeserializer<Statistics> = (json: any) => {
    json.incidents.by_time = json.incidents.by_time
        .map(([date, value]: [string, number]) => {
            return { date: new Date(date), value: value }
        });
    json.programs.by_time = json.programs.by_time
        .map(([date, value]: [string, number]) => {
            return { date: new Date(date), value: value }
        });
    json.jobs.by_time = json.jobs.by_time
        .map(([date, value]: [string, number]) => {
            return { date: new Date(date), value: value }
        });
    return json as Statistics;
}

export interface Notification {
    url: string,
    user: string,
    date: Date,
    message: string,
    viewed: boolean,
}

export const NotificationDeserializer: IDeserializer<Notification> = (json: any) => {
    json.date = new Date(json.date);
    return json as Notification;
}
