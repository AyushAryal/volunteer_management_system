import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import { Divider } from 'primereact/divider';
import { Incident, Job, Program } from '@models/incident';
import { get_incident_detail, get_job_list, get_program_list } from '@api/incident';
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

export function IncidentDetailModal(props: IncidentDetailModalProps) {
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
            const id = get_id(props.incident);
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
            className='flex flex-initial p-2 m-1 align-items-center justify-content-between gap-2'
        >
            <div style={{ flexBasis: "100%" }}>{job.name}</div>
            <div style={{ flexBasis: "60%" }}> {new Date(job.start_date).toDateString()} <br /> {new Date(job.end_date).toDateString()}</div>
            <Button className="flex-shrink-0" label="Apply" onClick={() => { }} />
        </div>);
    };

    const programList = programs.map((program) => <div>
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
                {new Date(incident.date).toDateString()}
            </div>
            <Tag style={{ backgroundColor: serverity_color_map.get(incident.severity) }} value={incident.severity} />
        </div>
        <span> <div dangerouslySetInnerHTML={{ __html: incident.description || "" }} /></span>
        <Divider type="solid" />
        <h3> Program List</h3>
        {programList}
    </Dialog>;
};
