import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from "react";
import { Job } from '@models/incident';
import { get_job_detail } from '@api/incident';
import { get_id } from '@api/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { JobActionWidget } from './JobActionWidget';
import { faCalendarDay, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { storeState } from '@models/store';
import { useHookstate } from '@hookstate/core';

type JobDetailModalProps = {
    job: string,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}


export function JobDetailModal(props: JobDetailModalProps) {
    const store = useHookstate(storeState);
    let volunteer = store.volunteer.get();

    const id = get_id(props.job);
    let [job, setJob] = useState<Job>();

    useEffect(() => {
        let networkRequest = async () => {
            setJob(await get_job_detail(id));
        }
        networkRequest();
    }, []);

    if (!job) {
        return <ProgressSpinner style={{ width: '50px', height: '50px' }} />;
    }

    let leader_display = job.leader ?
        <div className="flex text-xs align-items-center gap-2 bg-gray-400 text-white pr-2"
            style={{ borderRadius: "500px" }}>
            <img className="border-2 border-green-600"
                src={job.leader?.profile_image}
                style={{
                    width: "2rem",
                    height: "2rem",
                    objectFit: "cover",
                    borderRadius: "50%"
                }}
            />
            <span>
                {job.leader.first_name} {job.leader.last_name}
            </span>
        </div> : "No Leader Assigned";

    return <Dialog
        header={job.name}
        visible={props.visible}
        style={{ width: '65vw' }}
        onHide={() => props.setVisible(false)}
    >
        <div className="flex flex-row p-2 m-1 align-items-center justify-content-between ">
            <div>
                <div className="text-xs">
                    <FontAwesomeIcon icon={faCalendarDay} /> &nbsp;
                    {job.start_date.toDateString()} - {job.end_date.toDateString()}
                </div>
                <span className="text-xs">
                    <FontAwesomeIcon icon={faPeopleGroup} /> &nbsp;
                    Quota filled: {job.filled_positions}/{job.vacancy}
                </span>
            </div>
            {leader_display}
        </div>
        <span>{job.program.name}</span>
        <span>
            <div className="surface-50 border-round-lg p-4" dangerouslySetInnerHTML={{ __html: job.description || "" }} />
        </span>
        <div className="flex justify-content-end p-2">
            {(volunteer === null) ?
                <span className=" font-italic text-xs border-1 border-primary border-round p-1">Login to apply</span> :
                <JobActionWidget
                    job={job}
                    onChange={() => {
                        get_job_detail(id).then((job) => setJob(job));
                    }}
                />}
        </div>
    </Dialog>;
};
