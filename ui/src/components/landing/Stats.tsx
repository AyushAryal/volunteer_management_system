import {Card} from "primereact/card";
import { IncidentByMonth } from "../map/SideBar";
import { useHookstate } from "@hookstate/core";
import { get_incident_list} from "@api/incident";

import { storeState } from "@models/store";
import { useEffect } from "react";

const Stats = () => {
    const store = useHookstate(storeState);

    useEffect(() => {
      let networkRequest = async () => {
        let query = {}
        get_incident_list(query).then((incidents) => {
          store.incidentList.set(incidents);
        });
      };
      networkRequest();
    }, []);

    return (
      <section className="w-full mx-auto bg-indigo-700 px-8 py-6">
        <div className="flex justify-content-center">
          <h1 className="text-white text-4xl">Visualizations</h1>
        </div>
        <div className="flex flex-wrap justify-content-around px-8">
          <div className="flex flex-column w-5 min-w-min py-6">
            <Card>
              <IncidentByMonth chartType="bar" />
            </Card>
          </div>
          <div className="flex flex-column w-5 min-w-min py-6">
            <Card>
              <IncidentByMonth chartType="line" />
            </Card>
          </div>
        </div>
        <div className="flex flex-wrap justify-content-around px-8">
          <div className="flex flex-column w-5 min-w-min py-6">
            <Card>
              <IncidentByMonth chartType="line" />
            </Card>
          </div>
          <div className="flex flex-column w-5 min-w-min py-6">
            <Card>
              <IncidentByMonth chartType="bar" />
            </Card>
          </div>
        </div>
      </section>
    );
}

export default Stats  