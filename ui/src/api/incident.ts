import { Incident, Job, Program, VolunteerProfile } from "../models/incident";
import { get_filtered_list } from "./utils";
import { server } from "./api";
import { login, logout, token_aware_fetch } from "./token";
import { State } from "@hookstate/core";
import { Store } from "../models/store";

export interface FederalFilter {
    province?: number,
    district?: number,
    municipality?: number,
}

export interface IncidentFilter extends FederalFilter { }
export interface ProgramFilter extends FederalFilter { }
export interface JobFilter extends FederalFilter { }

export let get_incident_list = get_filtered_list<Incident, IncidentFilter>("/api/incident");
export let get_program_list = get_filtered_list<Program, ProgramFilter>("/api/program");
export let get_job_list = get_filtered_list<Job, IncidentFilter>("/api/job");

export async function get_volunteer_profile(): Promise<VolunteerProfile> {
    const endpoint = "/api/volunteer";
    const url = `${server}${endpoint}`;
    return token_aware_fetch(url).then((response) => response.json());
}
