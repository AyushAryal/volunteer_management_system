import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { Divider } from 'primereact/divider';
import { Incident, Job, JobApplicationStatus, Program } from '@models/incident';
import { get_incident_detail, get_job_list, get_program_list, job_apply, job_cancel, job_withdraw } from '@api/incident';
import { get_id } from '@api/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { Tag } from 'primereact/tag';

type IncidentDetailModalProps = {
    incident: string,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}

type JobActionWidgetProps = {
    job: Job,
    onChange?: (status?: JobApplicationStatus) => void,
}

export function JobActionWidget({ job, onChange }: JobActionWidgetProps) {
    if (job.application_status == "Not applied") {
        return <Button className="flex-shrink-0" label="Apply" onClick={async () => {
            let response = await job_apply(job.url);
            if (response.status == 200) {
                onChange && onChange();
            }
        }} />;
    } else if (job.application_status == "Accepted") {
        return <Button className="flex-shrink-0" label="Cancel" onClick={async () => {
            let response = await job_cancel(job.url);
            if (response.status == 200) {
                onChange && onChange();
            }
        }} />;
    } else if (job.application_status == "Pending") {
        return <Button className="flex-shrink-0" label="Withdraw" onClick={async () => {
            let response = await job_withdraw(job.url);
            if (response.status == 200) {
                onChange && onChange();
            }
        }} />;
    }
    return job.application_status
}

export function IncidentDetailModal(props: IncidentDetailModalProps) {
    const id = get_id(props.incident);
    let [incident, setIncident] = useState<Incident>();
    let [programs, setPrograms] = useState<Program[]>([]);
    let [jobs, setJobs] = useState<Job[]>([]);

    const serverity_color_map = new Map([
        ["Critical", "var(--red-500)"],
        ["High", "var(--yellow-600)"],
        ["Moderate", "var(--purple-500)"],
        ["Low", "var(--gray-500)"],
    ]);

    useEffect(() => {
        let networkRequest = async () => {
            setIncident(await get_incident_detail(id));
            setPrograms(await get_program_list({ incident: id }));
            setJobs(await get_job_list({ incident: id }));
        }
        networkRequest();
    }, []);

    if (incident === undefined) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
    }

    const jobsByProgram = jobs.reduce((acc: { [key: string]: Job[] }, job) => {
        if (!acc[job.program]) {
            acc[job.program] = [];
        }
        acc[job.program].push(job);
        return acc;
    }, {});

    const jobBuilder = (jobs: Job[]) => {
        return jobs.map((job) => <div
            key={job.url}
            className='flex flex-initial p-2 m-1 align-items-center justify-content-between gap-2'
        >
            <div style={{ flexBasis: "100%" }}>{job.name}</div>
            <div style={{ flexBasis: "60%" }}> {job.start_date.toDateString()} <br /> {job.end_date.toDateString()}</div>
            <JobActionWidget job={job} onChange={() => {
                get_job_list({ incident: id }).then((jobs) => setJobs(jobs));
            }} />
        </div>);
    };

    const programList = programs.map((program) => <div key={program.url}>
        {program.name}
        {jobBuilder(jobsByProgram[program.url] ?? [])}
        <Divider />
    </div>);

    return <Dialog
        header={incident.name}
        visible={props.visible}
        style={{ width: '50vw' }}
        onHide={() => props.setVisible(false)}
    >
        <div className="flex flex-row p-2 m-1 align-items-center justify-content-between ">
            <div>
                <FontAwesomeIcon icon={faClock} /> &nbsp;
                {incident.date.toDateString()}
            </div>
            <Tag style={{ backgroundColor: serverity_color_map.get(incident.severity) }} value={incident.severity} />
        </div>
        <span> <div dangerouslySetInnerHTML={{ __html: incident.description || "" }} /></span>
        <Divider type="solid" />
        <h3> Program List</h3>
        {programList}
    </Dialog>;
};
