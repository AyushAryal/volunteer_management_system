import { Job, JobApplicationStatus } from '@models/incident';
import { job_apply, job_cancel, job_withdraw } from '@api/incident';
import { Button } from "primereact/button";
import { useState } from 'react';
import { describe_api_errors } from '@api/utils';

export type JobActionWidgetProps = {
    job: Job,
    onChange?: (status?: JobApplicationStatus) => void,
}

export function JobActionWidget({ job, onChange }: JobActionWidgetProps) {
    let today = new Date(Date.now());
    let [formState, setFormState] = useState<FormState>(FormState.init());

    let button: JSX.Element;

    if (job.application_status == "Not applied" && job.vacancy - job.filled_positions > 0 && job.end_date > today) {
        button = <Button
            outlined
            loading={formState.isLoading()}
            className="flex-shrink-0"
            size="small"
            label="Apply"
            onClick={async () => {
                setFormState(FormState.fromLoading(true));
                let response = await job_apply(job.url);
                if (response.status == 200) {
                    onChange && onChange();
                    setFormState(FormState.fromSubmitted(true));
                } else if (response.status == 400) {
                    setFormState(FormState.fromError(describe_api_errors(await response.json())));
                }
            }} />;
    } else if (job.application_status == "Accepted") {
        // once the application is accpted user can CANCEL it.
        // once Cancelled the user CANNOT apply to the same job
        if (job.end_date > today) {
            button = <div className="flex gap-3 align-items-center">
                <span className="font-italic text-green-400">{job.application_status}</span>
                <Button
                    outlined
                    loading={formState.isLoading()}
                    className="flex-shrink-0"
                    size="small"
                    label="Cancel"
                    onClick={async () => {
                        setFormState(FormState.fromLoading(true));
                        let response = await job_cancel(job.url);
                        if (response.status == 200) {
                            onChange && onChange();
                            setFormState(FormState.fromSubmitted(true));
                        } else if (response.status == 400) {
                            setFormState(FormState.fromError(describe_api_errors(await response.json())));
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
            button = <div className="flex gap-3 align-items-center">
                <span className="font-italic text-yellow-600">{job.application_status}</span>
                <Button
                    outlined
                    loading={formState.isLoading()}
                    className="flex-shrink-0"
                    size="small"
                    label="Withdraw"
                    onClick={async () => {
                        setFormState(FormState.fromLoading(true));
                        let response = await job_withdraw(job.url);
                        if (response.status == 200) {
                            onChange && onChange();
                            setFormState(FormState.fromSubmitted(true));
                        } else if (response.status == 400) {
                            setFormState(FormState.fromError(describe_api_errors(await response.json())));
                        }
                    }} />
            </div>
        }
        else {
            return <span className="font-italic text-yellow-600">{job.application_status}</span>
        }
    } else if (job.application_status == "Cancelled") {
        return <span className="font-italic text-red-600">{job.application_status}</span>;
    } else {
        // job application: rejected state
        return <span className="font-italic text-red-500">{job.application_status}</span>
    }

    return <div className="flex align-items-center gap-2">
        {formState.getErrorAsElement()}
        {button}
    </div>
}
