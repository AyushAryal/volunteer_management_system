
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { Chart } from "primereact/chart";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect } from "react";
import { get_statistics } from "@api/incident.ts";
import volunteering3 from "@assets/volunteering3.png";

function make_dataset(label: string, data: { [key: string]: number }) {
  return {
    labels: Object.keys(data),
    datasets: [
      {
        label: label,
        data: Object.values(data),
        borderWidth: 1,
      },
    ],
  };
}

export const GenderStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return <Chart
    className="w-full h-full"
    type="pie"
    data={make_dataset("Volunteer Gender", statistics.volunteers.gender)}
    options={{
      maintainAspectRatio: false,
      plugins: { legend: { labels: { usePointStyle: true } } },
    }}
  />;
}

export const VolunteerCategoryStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return <Chart
    className="h-full w-full"
    type="bar"
    data={make_dataset("Volunteer Category", statistics.volunteers.category)}
    options={{
      indexAxis: "y",
      maintainAspectRatio: false,
    }}
  />;
}

export const BloodGroupStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return <Chart
    className="h-full w-full"
    type="radar"
    data={make_dataset("Blood Group", statistics.volunteers.blood_group)}
    options={{
      maintainAspectRatio: false,
    }}
  />;
}

export const AcademicQualificationStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return <Chart
    className="h-full w-full"
    type="bar"
    data={make_dataset("Academic Qualification", statistics.volunteers.academic_qualification)}
    options={{
      maintainAspectRatio: false,
    }}
  />;
}

export const JobStatusStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return <Chart
    className="h-full w-full"
    type="pie"
    data={make_dataset("Job Status", statistics.jobs.status)}
    options={{
      indexAxis: "y",
      maintainAspectRatio: false,
    }}
  />;
}

export const IncidentByTimeRangeStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  const data = statistics.incidents.by_time
    .slice()
    .reduce((o, { date, value }) => {
      return Object.assign(o, { [date.toDateString()]: value });
    }, {});

  return <Chart
    className="h-full w-full"
    type="line"
    data={make_dataset("Incidents By Time Range", data)}
    options={{
      tension: 0.4,
      maintainAspectRatio: false,
    }}
  />;
}

export const JobByTimeRangeStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  const data = statistics.jobs.by_time
    .slice()
    .reduce((o, { date, value }) => {
      return Object.assign(o, { [date.toDateString()]: value });
    }, {});

  return <Chart
    className="h-full w-full"
    type="line"
    data={make_dataset("Jobs By Time Range", data)}
    options={{
      tension: 0.4,
      maintainAspectRatio: false,
    }}
  />;
}

const Stats = () => {
  const store = useHookstate(storeState);
  useEffect(() => {
    let networkRequest = async () => {
      store.loaded.statistics.set(false);
      get_statistics().then((statistics) => {
        store.statistics.set(statistics);
        store.loaded.statistics.set(true);
      });
    };
    networkRequest();
  }, []);
  return (
    <section
      className="w-full mx-auto bg-cover"
      style={{
        backgroundImage: `url(${volunteering3})`,
      }}
    >
      <div
        className="px-3 h-auto md:px-8 py-6"
        style={{ backgroundColor: "rgba(48, 63, 159, 0.7)" }}
      >
        <div className="flex justify-content-center">
          <h1 className="text-white text-4xl mb-7">
            Visualizations <FontAwesomeIcon icon="chart-simple" />
          </h1>
        </div>
        <div className="flex flex-row flex-wrap justify-content-around mb-8 gap-7">
          {/* <div className="bg-indigo-100 border-round shadow-4 flex flex-column align-items-center w-5 min-w-max">
          <span className="text-lg text-bluegray-900 px-3">
            Volunteers By Gender
          </span>
          <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
            <GenderStats />
          </div>
        </div> */}
          <div className="bg-indigo-100 border-round shadow-4 flex flex-column align-items-center w-5 min-w-max">
            <span className="text-lg text-bluegray-900 px-3">
              Volunteers By Academic Qualification
            </span>
            <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
              <AcademicQualificationStats />
            </div>
          </div>
          <div className="bg-indigo-100 border-round shadow-4 flex flex-column align-items-center w-5 min-w-max">
            <span className="text-lg text-bluegray-900 px-3">
              Volunteers By Category
            </span>
            <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
              <VolunteerCategoryStats />
            </div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-content-around mb-8 gap-7">
          <div className="bg-indigo-100 border-round shadow-4 flex flex-column align-items-center w-5 min-w-max">
            <span className="text-lg text-bluegray-900 px-3">
              Volunteers By Blood Group
            </span>
            <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
              <BloodGroupStats />
            </div>
          </div>
          <div className="bg-indigo-100 border-round shadow-4 flex flex-column align-items-center w-5 min-w-max">
            <span className="text-lg text-bluegray-900 px-3">
              Incidents By Time Range
            </span>
            <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
              <IncidentByTimeRangeStats />
            </div>
          </div>
          {/* <div className="bg-indigo-100 border-round shadow-4 flex flex-column align-items-center w-5 min-w-max">
            <span className="text-lg text-bluegray-900 px-3">
              Volunteers By Training
            </span>
            <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
              <VolunteerTrainingStats />
            </div>
          </div> */}
        </div>
        {/* <div className="flex flex-row flex-wrap justify-content-around mb-8 gap-7">
        <div className="bg-indigo-100 border-round shadow-4 flex flex-column align-items-center w-5 min-w-max">
          <span className="text-lg text-bluegray-900 px-3">Volunteers By Gender</span>
          <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
            <GenderStats />
          </div>
        </div>
        <div className="bg-indigo-100 border-round shadow-4 flex flex-column align-items-center w-5 min-w-max">
          <span className="text-lg text-bluegray-900 px-3">Job Status</span>
          <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
            <JobStatusStats />
          </div>
        </div>
      </div> */}
        {/* <div className="flex flex-row flex-wrap justify-content-around mb-8 gap-7">
        <div className="bg-indigo-100 border-round shadow-4 flex flex-column align-items-center w-5 min-w-max">
          <span className="text-lg text-bluegray-900 px-3">
            Incidents By Time Range
          </span>
          <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
            <IncidentByTimeRangeStats />
          </div>
        </div>
        <div className="bg-indigo-100 border-round shadow-4 flex flex-column align-items-center w-5 min-w-max">
          <span className="text-lg text-bluegray-900 px-3">
            Jobs By Time Range
          </span>
          <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
            <JobByTimeRangeStats />
          </div>
        </div>
      </div> */}
      </div>
    </section>
  );
}

export default Stats  
