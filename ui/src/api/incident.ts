import { server } from "./api";
import { Incident, Job, Program } from "../models/incident";

export async function get_incident_list(): Promise<Incident[]> {
    const url = `${server}/api/incident`;
    let response = await fetch(url);
    return await response.json();
}

export async function get_job_list(): Promise<Job[]> {
    const url = `${server}/api/job`;
    let response = await fetch(url);
    return await response.json();
}

export async function get_program_list(): Promise<Program[]> {
    const url = `${server}/api/program`;
    let response = await fetch(url);
    return await response.json();
}
