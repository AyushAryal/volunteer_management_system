
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { Chart } from "primereact/chart";
import { ProgressSpinner } from "primereact/progressspinner";

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

export const VolunteerTrainingStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return <Chart
    className="h-full w-full"
    type="radar"
    data={make_dataset("Volunteer Training", statistics.volunteers.training_type)}
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
      indexAxis: "y",
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
  return (
    <section className="w-full mx-auto bg-indigo-700 md:px-8 py-6">
      <div className="flex justify-content-center">
        <h1 className="text-white text-4xl mb-7">
          Visualizations <FontAwesomeIcon icon="chart-simple" />
        </h1>
      </div>
      <div className="flex flex-row flex-wrap justify-content-around mb-8 gap-7">
        <div className="bg-indigo-100 border-round p-3 shadow-4 w-5 min-w-max h-24rem">
          <GenderStats />
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-content-around gap-7 mb-7">
        <div className="bg-indigo-100 border-round p-3 shadow-4 w-5 min-w-max h-24rem">
          <VolunteerCategoryStats />
        </div>
        <div className="bg-indigo-100 border-round p-3 shadow-4 w-5 min-w-max h-24rem">
          <VolunteerTrainingStats />
        </div>
      </div>
    </section>
  );
}

export default Stats  
