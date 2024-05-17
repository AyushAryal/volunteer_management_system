import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Incident } from "@models/incident";
import { useState } from "react";
import { faAngleRight } from '@fortawesome/free-solid-svg-icons/faAngleRight';
import { faClock } from '@fortawesome/free-regular-svg-icons/faClock';
import { VirtualScroller } from "primereact/virtualscroller";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { IncidentDetailModal } from "@components/map/sidebar/IncidentDetailModal";
import { ListSkeleton } from "@components/map/sidebar/ListSkeleton";

type IncidentRibbonProps = { incident: Incident }

function IncidentRibbon({ incident }: IncidentRibbonProps) {
    let [visible, setVisible] = useState(false);

    const serverity_color_map = new Map([
        ["Critical", "var(--red-300)"],
        ["High", "var(--yellow-300)"],
        ["Moderate", "var(--teal-300)"],
        ["Low", "var(--gray-300)"],
    ]);

    const viewIncidentDetail = <IncidentDetailModal
        incident={incident.url}
        visible={visible}
        setVisible={setVisible}
    />;

    return (<div
        className="flex flex-column p-2 flex-wrap w-full"
        style={{
            borderLeft: `5px solid ${serverity_color_map.get(incident.severity)}`,
        }}>
        <div className="m-1"> {incident.name}</div>
        <div className="text-sm text-400 flex flex-row justify-content-between">
            <div>
                <FontAwesomeIcon icon={faClock} className="mx-2" />
                {incident.date.toDateString()}
            </div>
            <FontAwesomeIcon className="mr-2 hover:bg-bluegray-100 p-2 border-circle" icon={faAngleRight} onClick={() => setVisible(true)} />
            {visible ? viewIncidentDetail : null}
        </div>
    </div>
    );

}

export function Incidents() {
    const incidentList = useHookstate(storeState.incidentList);
    const loadedIncidentList = useHookstate(storeState.loaded.incidentList);

    if (!loadedIncidentList.get()) {
        return <ListSkeleton />;
    }

    return (
      <div>
        <VirtualScroller
          style={{ width: "100%", height: "75vh" , overflowX: "hidden"}}
          items={incidentList.get() as Incident[]}
          itemSize={75}
          itemTemplate={(incident: Incident) => (
            <IncidentRibbon key={incident.url} incident={incident} />
          )}
        ></VirtualScroller>
      </div>
    );
}
