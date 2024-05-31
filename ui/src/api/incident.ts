import {
    Incident, IncidentDeserializer,
    Job, JobDeserializer,
    Notification, NotificationDeserializer,
    Program, SiteContent,
    Report,
    Statistics,
    StatisticsDeserializer,
    Volunteer, VolunteerDeserializer,
    JobApplicationStatus,
} from "@models/incident";
import { get_detail, get_filtered_endpoint, get_filtered_list, get_id } from "@api/utils";
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

export interface ReportFilter {
    job?: number,
}

export interface StatisticsFilter extends IncidentFilter { }

export let get_incident_list = get_filtered_list<Incident, IncidentFilter>(endpoints.incident, IncidentDeserializer);
export let get_program_list = get_filtered_list<Program, ProgramFilter>(endpoints.program);
export let get_job_list = get_filtered_list<Job, JobFilter>(endpoints.job, JobDeserializer);
export let get_report_list = get_filtered_list<Report, ReportFilter>(endpoints.report);
export let get_site_content_list = get_filtered_list<SiteContent, {}>(endpoints.site_content);
export let get_notification_list = get_filtered_list<Notification, {}>(endpoints.notification, NotificationDeserializer);

export let get_incident_detail = get_detail<Incident, number>(endpoints.incident, IncidentDeserializer);
export let get_program_detail = get_detail<Program, number>(endpoints.program);
export let get_job_detail = get_detail<Job, number>(endpoints.job, JobDeserializer);
export let get_notification_detail = get_filtered_list<Notification, {}>(endpoints.notification);

export let get_statistics = get_filtered_endpoint<Statistics, StatisticsFilter>(endpoints.statistics, StatisticsDeserializer);

// -----------------------------------------------------------------------------

export async function get_volunteer(): Promise<Volunteer> {
    let response = await token_aware_fetch(endpoints.volunteer);
    if (response.status == 200) {
        return VolunteerDeserializer(await response.json());
    } else {
        return Promise.reject(await response.json());
    }
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

export async function create_job_report(body: BodyInit) {
    return token_aware_fetch(endpoints.report, {
        "headers": { "Content-Type": "application/json" },
        "method": "POST",
        "body": body
    });
}

export async function update_job_report(url: string, body: BodyInit) {
    return token_aware_fetch(`${endpoints.report}/${get_id(url)}`, {
        "headers": { "Content-Type": "application/json" },
        "method": "PUT",
        "body": body
    });
}

export async function notification_view(notification: string) {
    return token_aware_fetch(`${notification}/view`, {
        "headers": { "Content-Type": "application/json" },
        "method": "POST",
    });
}
