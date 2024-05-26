import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from "react";
import { Job } from '@models/incident';
import { get_job_detail } from '@api/incident';
import { get_id } from '@api/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { JobActionWidget } from './JobActionWidget';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';

type JobDetailModalProps = {
    job: string,
    visible: boolean,
    setVisible: (visible: boolean) => void,
}


export function JobDetailModal(props: JobDetailModalProps) {
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

    return <Dialog
        header={job.name}
        visible={props.visible}
        style={{ width: '65vw' }}
        onHide={() => props.setVisible(false)}
    >
        <div className="flex flex-row p-2 m-1 align-items-center justify-content-between ">
            <div className="text-xs font-semibold">
                <FontAwesomeIcon icon={faCalendarDay} /> &nbsp;
                {job.start_date.toDateString()} - {job.end_date.toDateString()}
            </div>
            <span className="font-semibold"> Leader {job.leader ?? "Not assigned"} </span>
            <span> {job.filled_positions}/{job.vacancy} </span>
        </div>
        <span> <div dangerouslySetInnerHTML={{ __html: job.description || "" }} /></span>
        <JobActionWidget
            job={job}
            onChange={() => {
                get_job_detail(id).then((job) => setJob(job));
            }}
        />
    </Dialog>;
};
