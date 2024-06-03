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
import { faChartLine, faList, faLocation } from "@fortawesome/free-solid-svg-icons";
import { IncidentByFederal, IncidentByTimeRangeStats } from "@components/landing/Stats";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";

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
        <div className="text-xs text-400 flex flex-row justify-content-between align-items-center">
            <div className="flex gap-2">
                <div>
                    <FontAwesomeIcon icon={faClock} className="mx-2" />
                    {incident.date.toDateString()}
                </div>
                <div>
                    <FontAwesomeIcon icon={faLocation} className="mx-2" />
                    {incident.point[0].toFixed(4)}°N, {incident.point[1].toFixed(4)}°E
                </div>
            </div>
            <div className="flex align-items-center gap-2">
                <span className="border-1 text-primary border-round px-2"> {incident.programs} Programs </span>
                <span className="border-1 text-red-600 border-round px-2"> {incident.jobs} Jobs </span>
                <FontAwesomeIcon className="mr-2 hover:bg-bluegray-100 p-2 border-circle" style={{ cursor: "pointer" }} icon={faAngleRight} onClick={() => setVisible(true)} />
            </div>
            {visible ? viewIncidentDetail : null}
        </div>
    </div >
    );

}

export function Incidents() {
    const incidentList = useHookstate(storeState.incidentList);
    const loadedIncidentList = useHookstate(storeState.loaded.incidentList);
    const [showChart, setShowChart] = useState(false)
    const icon = showChart ? faList : faChartLine;
    if (!loadedIncidentList.get()) {
        return <ListSkeleton />;
    }
    const tabs = [
      {
        title: "Time Range",
        content: (
          <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
            <IncidentByTimeRangeStats />
          </div>
        ),
      },
      {
        title: "Federal Region",
        content: (
          <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
            <IncidentByFederal />
          </div>
        ),
      },
    ];

    return (
      <div>
        <div className="flex justify-content-end">
          <FontAwesomeIcon
            icon={icon}
            onClick={() => setShowChart(!showChart)}
          />
        </div>
        {showChart && (
          <div>
            <Stepper>
              {tabs.map((tab) => {
                return (
                  <StepperPanel key={tab.title} header={tab.title}>
                    {tab.content}
                  </StepperPanel>
                );
              })}
            </Stepper>
          </div>
        )}
        {!showChart && (
          <VirtualScroller
            style={{ width: "100%", height: "65vh", overflowX: "hidden" }}
            items={incidentList.get() as Incident[]}
            itemSize={70}
            itemTemplate={(incident: Incident) => (
              <IncidentRibbon key={incident.url} incident={incident} />
            )}
          ></VirtualScroller>
        )}
      </div>
    );
}
