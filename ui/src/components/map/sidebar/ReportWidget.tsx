import { FormState } from '@api/form';
import { update_job_report } from '@api/incident';
import { describe_api_errors } from '@api/utils';
import { Report } from '@models/incident';
import { Button } from 'primereact/button';
import { Editor } from 'primereact/editor';
import { useState } from 'react';


type ReportViewWidgetProps = {
    report: Report,
}

export function ReportViewWidget({ report }: ReportViewWidgetProps) {
    return <Editor style={{ width: "850px" }} value={report.report} readOnly />
}

export type ReportActionWidgetProps = {
    report: Report,
}

export function ReportActionWidget({ report }: ReportActionWidgetProps) {
    let [content, setContent] = useState<string | undefined>(report.report);
    let [formState, setFormState] = useState<FormState>(FormState.init());

    const onSubmit = async () => {
        let form = JSON.stringify({
            job: report.job.url,
            report: content,
        });
        let response = await update_job_report(report.url, form);
        if (response.status == 200) {
            setFormState(FormState.fromSubmitted(true));
        } else {
            let errors = describe_api_errors(await response.json());
            setFormState(FormState.fromError(errors));
        }
    };

    return <div className="card flex flex-column justify-content-around gap-2 w-full">
        <Editor
            value={content}
            onTextChange={(e) => { setContent(e.htmlValue ?? "") }}
            style={{ height: '320px', width: "100%" }}
        />

        <Button outlined
            size="small"
            className="align-self-end"
            label="Submit Report"
            onClick={onSubmit} />
        {formState.isSubmitted() && !formState.hasErrors() ? "Report Updated!" : null}
    </div>

}
