import {
    Incident, IncidentDeserializer,
    Job, JobDeserializer,
    Program, SiteContent, VolunteerProfile
} from "@models/incident";
import { get_detail, get_filtered_list, get_id } from "@api/utils";
import { server } from "@api/api";
import { token_aware_fetch } from "@api/token";

export interface FederalFilter {
    province?: number,
    district?: number,
    municipality?: number,
}

export interface IncidentFilter extends FederalFilter { }
export interface ProgramFilter extends FederalFilter {
    incident?: number
}
export interface JobFilter extends FederalFilter {
    incident?: number,
    program?: number,
}

export let get_incident_list = get_filtered_list<Incident, IncidentFilter>("/api/incident", IncidentDeserializer);
export let get_program_list = get_filtered_list<Program, ProgramFilter>("/api/program");
export let get_job_list = get_filtered_list<Job, JobFilter>("/api/job", JobDeserializer);
export let get_site_content_list = get_filtered_list<SiteContent, {}>("/api/site_content");

export let get_incident_detail = get_detail<Incident, number>("/api/incident");
export let get_program_detail = get_detail<Program, number>("/api/program");
export let get_job_detail = get_detail<Job, number>("/api/job");

// -----------------------------------------------------------------------------

export async function get_volunteer_profile(): Promise<VolunteerProfile> {
    const endpoint = "/api/volunteer";
    const url = `${server}${endpoint}`;
    return token_aware_fetch(url).then((response) => response.json());
}

export async function signup(body: BodyInit): Promise<Response> {
    const endpoint = "/api/volunteer";
    const url = `${server}${endpoint}`;
    return token_aware_fetch(url, {
        "headers": { "Content-Type": "application/json" },
        "method": "POST",
        "body": body
    });
}

export async function update_volunteer_profile(url: string, body: BodyInit): Promise<Response> {
    let id = get_id(url);
    const endpoint = `/api/volunteer/${id}`;
    const url_ = `${server}${endpoint}`;
    return token_aware_fetch(url_, {
        "headers": { "Content-Type": "application/json" },
        "method": "PATCH",
        "body": body
    });
}
function depaginate<T>(arg0: string) {
    throw new Error("Function not implemented.");
}

