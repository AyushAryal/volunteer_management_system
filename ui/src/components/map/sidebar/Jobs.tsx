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
                <FontAwesomeIcon
                    className="mr-2 hover:bg-bluegray-100 p-2 border-circle"
                    icon={faAngleRight}
                    onClick={() => setVisible(true)}
                />
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
            itemTemplate={(job: Job) => (
                <JobRibbon key={job.url} job={job} />
            )}
            itemSize={75}
            style={{ width: '100%', height: '75vh' }}
        >
        </VirtualScroller>
    );
}


