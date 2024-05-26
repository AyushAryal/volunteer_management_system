import {
    Incident, IncidentDeserializer,
    Job, JobDeserializer,
    Notification, NotificationDeserializer,
    Program, SiteContent,
    Statistics,
    Volunteer, VolunteerDeserializer,
} from "@models/incident";
import { get_detail, get_filtered_list, get_id } from "@api/utils";
import { endpoints } from "@api/api";
import { token_aware_fetch } from "@api/token";

export interface FederalFilter {
    province?: number,
    district?: number,
    municipality?: number,
    ward?: number,
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

export interface StatisticsFilter extends FederalFilter { }

export let get_incident_list = get_filtered_list<Incident, IncidentFilter>(endpoints.incident, IncidentDeserializer);
export let get_program_list = get_filtered_list<Program, ProgramFilter>(endpoints.program);
export let get_job_list = get_filtered_list<Job, JobFilter>(endpoints.job, JobDeserializer);
export let get_site_content_list = get_filtered_list<SiteContent, {}>(endpoints.site_content);
export let get_notification_list = get_filtered_list<Notification, {}>(endpoints.notification, NotificationDeserializer);

export let get_incident_detail = get_detail<Incident, number>(endpoints.incident, IncidentDeserializer);
export let get_program_detail = get_detail<Program, number>(endpoints.program);
export let get_job_detail = get_detail<Job, number>(endpoints.job, JobDeserializer);
export let get_notification_detail = get_filtered_list<Notification, {}>(endpoints.notification);

// -----------------------------------------------------------------------------

export async function get_volunteer(): Promise<Volunteer> {
    let response = await token_aware_fetch(endpoints.volunteer);
    let json = await response.json();
    let des = VolunteerDeserializer(json);
    return des;
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


export async function get_statistics(): Promise<Statistics> {
    return fetch(endpoints.statistics).then(response => response.json());
}

export async function job_apply(job: string) {
    return token_aware_fetch(`${job}/apply`, {
        "headers": { "Content-Type": "application/json" },
        "method": "POST",
    });
}

export async function job_cancel(job: string) {
    return token_aware_fetch(`${job}/cancel`, {
        "headers": { "Content-Type": "application/json" },
        "method": "POST",
    });
}

export async function job_withdraw(job: string) {
    return token_aware_fetch(`${job}/withdraw`, {
        "headers": { "Content-Type": "application/json" },
        "method": "POST",
    });
}

export async function notification_view(notification: string) {
    return token_aware_fetch(`${notification}/view`, {
        "headers": { "Content-Type": "application/json" },
        "method": "POST",
    });
}
