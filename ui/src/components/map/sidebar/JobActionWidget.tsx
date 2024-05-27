import { Job, JobApplicationStatus } from '@models/incident';
import { job_apply, job_cancel, job_withdraw } from '@api/incident';
import { Button } from "primereact/button";

export type JobActionWidgetProps = {
    job: Job,
    onChange?: (status?: JobApplicationStatus) => void,
}

export function JobActionWidget({ job, onChange }: JobActionWidgetProps) {
    let today = new Date(Date.now());
    if (job.application_status == "Not applied" && job.vacancy - job.filled_positions > 0 && job.end_date > today) {
        return <Button
            outlined
            className="flex-shrink-0"
            size="small"
            label="Apply"
            onClick={async () => {
                let response = await job_apply(job.url);
                if (response.status == 200) {
                    onChange && onChange();
                }
            }} />;
    } else if (job.application_status == "Accepted") {
        // once the application is accpted user can CANCEL it.
        // once Cancelled the user CANNOT apply to the same job
        if (job.end_date > today) {
            return <div className="flex gap-3 align-items-center">
                <span className="font-italic text-green-400">{job.application_status}</span>
                <Button
                    outlined
                    className="flex-shrink-0"
                    size="small"
                    label="Cancel"
                    onClick={async () => {
                        let response = await job_cancel(job.url);
                        if (response.status == 200) {
                            onChange && onChange();
                        }
                    }}
                />
            </div>
        }
        else {
            return <span className="font-italic text-green-400">{job.application_status}</span>
        }
    } else if (job.application_status == "Pending") {
        if (job.end_date > today) {
            return <div className="flex gap-3 align-items-center">
                <span className="font-italic text-yellow-600">{job.application_status}</span>
                <Button
                    outlined
                    className="flex-shrink-0"
                    size="small"
                    label="Withdraw"
                    onClick={async () => {
                        let response = await job_withdraw(job.url);
                        if (response.status == 200) {
                            onChange && onChange();
                        }
                    }} />
            </div>
        }
        else {
            return <span className="font-italic text-yellow-600">{job.application_status}</span>
        }
    } else if (job.application_status == "Cancelled") {
        return <span className="font-italic text-red-600">{job.application_status}</span>;
    }
    // job application: rejected state
    return <span className="font-italic text-red-500">{job.application_status}</span>

}
