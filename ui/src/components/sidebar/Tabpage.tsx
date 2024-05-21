import {
  TabPanel,
  TabView,
  TabPanelHeaderTemplateOptions,
} from "primereact/tabview";
import { Visualizations } from '@components/sidebar/Visualizations';
import { Jobs } from '@components/sidebar/Jobs';
import { Incidents } from '@components/sidebar/Incidents';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";

export function Tabpage() {
    const incidentCount = useHookstate(storeState.incidentList).length;
    const jobCount = useHookstate(storeState.jobList).length;

    const counts = {
        incidents: incidentCount,
        jobs: jobCount,
        programs: 0,
    }
    

    const tabIncidentTemplate = (options: TabPanelHeaderTemplateOptions) => {
      return (
        <div
          className={`${options.className} flex flex-column align-items-center text-sm`}
          style={{ cursor: "pointer" }}
          onClick={options.onClick}
        >
          <div className="text-xl">{counts.incidents}</div>
          <span className="white-space-nowrap">{options.titleElement}</span>
        </div>
      );
    };

    const tabJobTemplate = (options: TabPanelHeaderTemplateOptions) => {
      return (
        <div
          className={`${options.className} flex flex-column align-items-center text-sm`}
          style={{ cursor: "pointer" }}
          onClick={options.onClick}
        >
          <div className="text-xl">{counts.jobs}</div>
          <span className="white-space-nowrap">{options.titleElement}</span>
        </div>
      );
    };
    
    const tabVisualizationTemplate = (
      options: TabPanelHeaderTemplateOptions
    ) => {
      return (
        <div
          className={`${options.className} flex flex-column align-items-center text-sm`}
          style={{ cursor: "pointer" }}
          onClick={options.onClick}
        >
          <div className="text-xl">
            <FontAwesomeIcon icon="chart-simple" />
          </div>
          <span className="white-space-nowrap">{options.titleElement}</span>
        </div>
      );
    };

    return (
      <TabView className="flex flex-column overflow-y-hidden">
        <TabPanel header="Visualizations" headerTemplate={tabVisualizationTemplate}>
          <Visualizations />
        </TabPanel>
        <TabPanel header="Incidents" headerTemplate={tabIncidentTemplate}>
          <Incidents />
        </TabPanel>
        <TabPanel header="Jobs" headerTemplate={tabJobTemplate}>
          <Jobs />
        </TabPanel>
      </TabView>
    );
}
