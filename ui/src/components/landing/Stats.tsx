import {React} from "react";
import {Card} from "primereact/card";
import { IncidentByMonth } from "../map/SideBar";

const Stats = () => {
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
              <IncidentByMonth chartType="bar" />
            </Card>
          </div>
          <div className="flex flex-column w-5 min-w-min py-6">
            <Card>
              <IncidentByMonth chartType="line" />
            </Card>
          </div>
        </div>
      </section>
    );
}

export default Stats  