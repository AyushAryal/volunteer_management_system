import {
    Incident, IncidentDeserializer,
    Job, JobDeserializer,
    Program, SiteContent, VolunteerProfile
} from "@models/incident";
import { get_detail, get_filtered_list, get_id } from "@api/utils";
import { endpoints } from "@api/api";
import { token_aware_fetch } from "@api/token";

export interface FederalFilter {
    province?: number,
    district?: number,
    municipality?: number,
}

export interface IncidentFilter extends FederalFilter {
    date_after?: string,
    date_before?: string,
}

export interface ProgramFilter extends FederalFilter {
    incident?: number
    date_after?: string,
    date_before?: string,
}

export interface JobFilter extends FederalFilter {
    incident?: number,
    program?: number,
    end_date_after?: string,
    end_date_before?: string,
}

export let get_incident_list = get_filtered_list<Incident, IncidentFilter>(endpoints.incident, IncidentDeserializer);
export let get_program_list = get_filtered_list<Program, ProgramFilter>(endpoints.program);
export let get_job_list = get_filtered_list<Job, JobFilter>(endpoints.job, JobDeserializer);
export let get_site_content_list = get_filtered_list<SiteContent, {}>(endpoints.site_content);

export let get_incident_detail = get_detail<Incident, number>(endpoints.incident, IncidentDeserializer);
export let get_program_detail = get_detail<Program, number>(endpoints.program);
export let get_job_detail = get_detail<Job, number>(endpoints.job, JobDeserializer);

// -----------------------------------------------------------------------------

export async function get_volunteer_profile(): Promise<VolunteerProfile> {
    return token_aware_fetch(endpoints.volunteer).then((response) => response.json());
}

export async function signup(body: BodyInit): Promise<Response> {
    return token_aware_fetch(endpoints.volunteer, {
        "headers": { "Content-Type": "application/json" },
        "method": "POST",
        "body": body
    });
}

export async function update_volunteer_profile(url: string, body: BodyInit): Promise<Response> {
    let id = get_id(url);
    return token_aware_fetch(`${endpoints.volunteer}/${id}`, {
        "headers": { "Content-Type": "application/json" },
        "method": "PATCH",
        "body": body
    });
}
