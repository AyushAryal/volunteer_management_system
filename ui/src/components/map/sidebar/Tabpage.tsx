import {
  TabPanel,
  TabView,
  TabPanelHeaderTemplateOptions,
} from "primereact/tabview";
import { Visualizations } from '@components/map/sidebar/Visualizations';
import { Jobs, YourJobs } from '@components/map/sidebar/Jobs';
import { Incidents } from '@components/map/sidebar/Incidents';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { faBell, faBriefcase, faPeopleCarryBox } from "@fortawesome/free-solid-svg-icons";
import { Badge } from "primereact/badge";
import { Notifications } from "./Notifications";
import { Profile } from "./Profile";

export function Tabpage() {
  const volunteer = useHookstate(storeState.volunteer);
  const incidentCount = useHookstate(storeState.incidentList).length;
  const jobCount = useHookstate(storeState.jobList).length;
  const notificationCount = useHookstate(storeState.notificationList)
    .get()
    .filter((notification) => !notification.viewed)
    .length;

  const counts = {
    incidents: incidentCount,
    jobs: jobCount,
    programs: 0,
  }


  const tabIncidentTemplate = (options: TabPanelHeaderTemplateOptions) => {
    return (
      <div
        className={`${options.className} flex flex-column align-items-center text-sm  `}
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
        className={`${options.className} flex flex-column align-items-center text-sm  `}
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <div className="text-xl">{counts.jobs}</div>
        <span className="white-space-nowrap">{options.titleElement}</span>
      </div>
    );
  };

  const yourJobsHeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
    return (
      <div
        className={`${options.className} flex flex-column align-items-center text-sm`}
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <div className="text-xl">
          <FontAwesomeIcon icon={faBriefcase} />
        </div>
        <span className="white-space-nowrap">{options.titleElement}</span>
      </div>
    );
  };

  const tabVisualizationTemplate = (
    options: TabPanelHeaderTemplateOptions
  ) => {
    return (
      <div
        className={`${options.className} flex flex-column align-items-center text-sm  `}
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <div className="text-xl">
          <FontAwesomeIcon icon={faPeopleCarryBox} />
        </div>
        <span className="white-space-nowrap">{options.titleElement}</span>
      </div>
    );
  };

  const notificationHeaderTemplate = (options: TabPanelHeaderTemplateOptions) => {
    return <div
      className={`${options.className} flex flex-column align-items-center text-sm  `}
      style={{ cursor: "pointer" }}
      onClick={options.onClick}
    >
      <div className="text-xl p-overlay-badge">
        <FontAwesomeIcon icon={faBell} />
        {
          notificationCount == 0 ? null :
            <Badge value={notificationCount} severity="danger"></Badge>
        }

      </div>
      <span className="white-space-nowrap">{options.titleElement}</span>
    </div>;

  }
  const profileHeaderTemplate = (
    options: TabPanelHeaderTemplateOptions
  ) => {
    return (
      <div
        className={`${options.className} flex flex-column align-items-center text-sm `}
        style={{ cursor: "pointer" }}
        onClick={options.onClick}
      >
        <div className="text-xl">
          <FontAwesomeIcon icon="user" />
        </div>
        <span className="white-space-nowrap">{options.titleElement}</span>
      </div>
    );
  };


  return (

    <TabView className="flex flex-column overflow-y-hidden">
      <TabPanel header="Incidents" headerTemplate={tabIncidentTemplate}>
        <Incidents />
      </TabPanel>
      <TabPanel header="Jobs" headerTemplate={tabJobTemplate}>
        <Jobs />
      </TabPanel>
      <TabPanel header="Volunteers" headerTemplate={tabVisualizationTemplate}>
        <Visualizations />
      </TabPanel>
      {(volunteer.get() === null) ? <></> :
        <TabPanel header="Your Jobs" headerTemplate={yourJobsHeaderTemplate}>
          <YourJobs />
        </TabPanel>
      }
      {(volunteer.get() === null) ? <></> :
        <TabPanel header="Notifications" headerTemplate={notificationHeaderTemplate}>
          <Notifications />
        </TabPanel>}
      {(volunteer.get() === null) ? <></> :
        <TabPanel header="Profile" headerTemplate={profileHeaderTemplate}>
          <Profile />
        </TabPanel>
      }
    </TabView>
  );
}
