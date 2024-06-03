import { Dialog } from 'primereact/dialog';
import { useEffect, useState } from "react";
import { Job, Report } from '@models/incident';
import { create_job_report, get_job_detail, get_report_list } from '@api/incident';
import { get_id } from '@api/utils';
import { ProgressSpinner } from 'primereact/progressspinner';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { JobActionWidget } from './JobActionWidget';
import { faCalendarDay, faPen, faPeopleGroup } from '@fortawesome/free-solid-svg-icons';
import { storeState } from '@models/store';
import { useHookstate } from '@hookstate/core';
import { ReportActionWidget, ReportViewWidget } from '@components/map/sidebar/ReportWidget';
import { Fieldset } from 'primereact/fieldset';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import default_profile_image from "@assets/default_profile_image.png";

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
    let [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        let networkRequest = async () => {
            setJob(await get_job_detail(id));
        }
        networkRequest();
    }, []);

    useEffect(() => {
        let networkRequest = async () => {
            if (job) {
                setReports(await get_report_list({ job: get_id(job.url) }));
            }
        }
        networkRequest();
    }, [job]);

    let owned_reports = reports.filter((report) => report.volunteer.url == volunteer?.volunteer.url);
    let other_reports = reports.filter((report) => report.volunteer.url !== volunteer?.volunteer.url);

    const reportOwnedBuilder = () => {
        return owned_reports.map((report) => <div
            key={report.url}
            className='flex flex-column flex-initial p-2 m-1 align-items-start justify-content-between gap-2 text-sm'
        >
            <ReportActionWidget report={report} />
        </div>);
    };

    const createReport = <Button
        label="Create Report"
        onClick={async () => {
            let response = await create_job_report(JSON.stringify({
                job: props.job,
                report: "",
            }));

            if (response.status == 201) {
                setJob(await get_job_detail(id));
            } else {
            }
        }}
    />

    const reportOtherBuilder = () => {
        return other_reports.map((report) => <div
            key={report.url}
            className='flex flex-column flex-initial p-2 m-1 align-items-start justify-content-between gap-2 text-sm'
        >
            <Fieldset
                legend={
                    <div className="flex align-items-center surface-100 gap-2 p-2 border-round">
                        <img src={
                            report.volunteer.profile_image == "" ?
                                default_profile_image
                                :
                                report.volunteer.profile_image
                        }
                            style={{
                                width: "2.8rem",
                                height: "2.8rem",
                                objectFit: "cover",
                                borderRadius: "50%"
                            }} />
                        {`${report.volunteer.first_name} ${report.volunteer.last_name}`}
                    </div>
                }
                toggleable>
                <ReportViewWidget report={report} />
            </Fieldset>
            <Divider />
        </div>);
    };

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
        <span>
            <div className="surface-50 border-round-lg p-4" dangerouslySetInnerHTML={{ __html: job.description || "" }} />
        </span>
        <div className="flex justify-content-end p-2">
            {(volunteer === null) ?
                <span className=" font-italic text-xs border-1 border-primary border-round p-1" >Login to apply</span> :
                <div>
                    <JobActionWidget
                        job={job}
                        onChange={() => {
                            get_job_detail(id).then((job) => setJob(job));
                        }}
                    />
                </div>
            }
        </div>
        {
            job.application_status !== "Accepted" ? null :
                <div className='flex flex-column'>
                    <span className="flex align-items-center gap-2 p-2">
                        <FontAwesomeIcon icon={faPen} />
                        <h4>Your Report</h4>
                    </span>
                    {owned_reports.length === 0 ? createReport : reportOwnedBuilder()}
                </div>
        }
        <div className='flex flex-column'>
            <span className="flex align-items-center gap-2 p-2">
                <FontAwesomeIcon icon={faPen} />
                <h4>Reports from other volunteers</h4>
            </span>
            <div className="surface-50">
                {reportOtherBuilder()}
            </div>
        </div>
    </Dialog>;
};
