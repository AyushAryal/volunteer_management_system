import { useState } from "react";
import { useHookstate } from "@hookstate/core";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { faAngleRight, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";
import { VirtualScroller } from "primereact/virtualscroller";
import { Divider } from "primereact/divider";

import { Job } from "@models/incident";
import { storeState } from "@models/store";
import { ListSkeleton } from "@components/map/sidebar/ListSkeleton";
import { JobDetailModal } from "@components/map/sidebar/JobDetailModal";


export type JobRibbonProps = { job: Job }

export function JobRibbon({ job }: JobRibbonProps) {
    let [visible, setVisible] = useState(false);

    const viewJobDetail = <JobDetailModal
        job={job.url}
        visible={visible}
        setVisible={setVisible}
    />;

    const application_status_color_map = {
        "Accepted": "green",
        "Rejected": "#d94f3a",
        "Pending": "#d9b124",
        "Cancelled": "#d94f3a",
        "Not applied": "#748ddc"
    }

    const job_status_color_map = {
        "Completed": "green",
        "In Progress": "#d9b124",
        "Not Assigned": "#748ddc",
    }

    const store = useHookstate(storeState);
    let volunteer = store.volunteer.get();

    return <div>
        <div className="flex flex-column flex-wrap p-2 w-full">
            <div className="m-1"> {job.name}</div>
            <div className="flex justify-content-between">
                <div className="text-xs text-400 ">
                    <FontAwesomeIcon icon={faClock} className="mx-2" />
                    {job.start_date.toDateString()} - {job.end_date.toDateString()}

                </div>
                <div className="flex-column">
                    <div className="text-xs">
                        <FontAwesomeIcon icon={faPeopleGroup} />
                        &nbsp;{job.filled_positions} / {job.vacancy}
                    </div>
                </div>
                <div className="flex align-items-center gap-2">
                    <span style={{ "color": job_status_color_map[job.status] }}
                        className="border-1 text-xs border-round px-2">
                        {job.status}
                    </span>
                    {volunteer === null ? <></> :
                        <span style={{ "color": application_status_color_map[job.application_status] }}
                            className="border-1 font-italic font-semibold text-xs border-round px-2">
                            {job.application_status}
                        </span>}
                    <FontAwesomeIcon
                        className="mr-2 hover:bg-bluegray-100 p-2 border-circle"
                        icon={faAngleRight}
                        onClick={() => setVisible(true)}
                    />
                </div>
            </div>
        </div>
        <Divider />
        {visible ? viewJobDetail : null}
    </div>;
}

export function Jobs() {
    const jobList = useHookstate(storeState.jobList);
    const loadedJobList = useHookstate(storeState.loaded.jobList);

    if (!loadedJobList.get()) {
        return <ListSkeleton />
    }

    return (
      <VirtualScroller
        items={jobList.get() as Job[]}
        itemTemplate={(job: Job) => <JobRibbon key={job.url} job={job} />}
        itemSize={70}
        style={{ width: "100%", height: "65vh", overflowX: "hidden" }}
      ></VirtualScroller>
    );
}


