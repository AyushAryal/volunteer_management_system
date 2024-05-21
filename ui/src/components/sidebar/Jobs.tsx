import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHookstate } from "@hookstate/core";
import { Job } from "@models/incident";
import { storeState } from "@models/store";
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { VirtualScroller } from "primereact/virtualscroller";
import { ListSkeleton } from "@components/sidebar/ListSkeleton";

export function Jobs() {
    const jobList = useHookstate(storeState.jobList);
    const loadedJobList = useHookstate(storeState.loaded.jobList);

    if (!loadedJobList.get()) {
        return <ListSkeleton />
    }

    const template = (job: Job) => {
        return <div className="flex flex-column flex-wrap p-2 w-full">
            <div className="m-1"> {job.name}</div>
            <div className="text-sm text-400">
                <FontAwesomeIcon icon={faClock} className="mx-2" />
                {job.start_date.toDateString()} - {job.end_date.toDateString()}
            </div>
        </div>;
    };

    return (
    <VirtualScroller
        items={jobList.get() as Job[]}
        itemTemplate={template}
        itemSize={75}
        style={{ width: '100%', height: '75vh' }}
    >
    </VirtualScroller>
    );
}


