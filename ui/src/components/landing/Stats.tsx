
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { Chart } from "primereact/chart";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect } from "react";
import { get_statistics } from "@api/incident.ts";
import volunteering3 from "@assets/volunteering3.png";
import { get_id } from "@api/utils";
import { StatisticsFilter } from "@api/incident.ts";
import { GlobalLocationSelector } from "@components/map/GlobalLocationSelector";  

function make_dataset(label: string, data: { [key: string]: number }) {
      const color = "rgb(39, 184, 168, 0.8)";
  return {
    labels: Object.keys(data),
    datasets: [
      {
        label: label,
        data: Object.values(data),
        backgroundColor: [color],
        borderWidth: 1,
      },
    ],
  };
}

export const GenderStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;
  const genderData = make_dataset(
    "Volunteer Gender",
    statistics.volunteers.gender
  );
  const genderColors = [
    "rgb(50, 184, 168, 0.8)",
    "rgb(139, 184, 168, 0.8)",
    "rgb(139, 184, 128, 0.8)",
  ];
  genderData.datasets[0].backgroundColor = genderColors.slice(
    0,
    Object.keys(statistics.volunteers.gender).length
  );
  return (
    <Chart
      className="w-full h-full"
      type="pie"
      data={genderData}
      options={{
        maintainAspectRatio: false,
        plugins: { legend: { labels: { usePointStyle: true } } },
      }}
    />
  );
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
      let selectedProvince = store.mapControls.selectedProvince.get();
      let selectedDistrict = store.mapControls.selectedDistrict.get();
      let selectedMunicipality = store.mapControls.selectedMunicipality.get();
      let selectedWard = store.mapControls.selectedWard.get();

      let province = selectedProvince ? get_id(selectedProvince) : undefined;
      let district = selectedDistrict ? get_id(selectedDistrict) : undefined;
      let municipality = selectedMunicipality
        ? get_id(selectedMunicipality)
        : undefined;
      let ward = selectedWard ? get_id(selectedWard) : undefined;

      let statistics_query: StatisticsFilter = {
        province,
        district,
        municipality,
        ward,
      };

      store.loaded.statistics.set(false);
      get_statistics(statistics_query).then((statistics) => {
        store.statistics.set(statistics);
        store.loaded.statistics.set(true);
      });
    };
    networkRequest();
  }, [
    store.mapControls.selectedWard,
    store.mapControls.selectedDistrict,
    store.mapControls.selectedMunicipality,
    store.mapControls.selectedProvince,
  ]);
  return (
    <section
      className="w-full mx-auto bg-cover"
      style={{
        backgroundImage: `url(${volunteering3})`,
      }}
    >
      <div
        className="px-3 h-auto md:px-8 pb-6 pt-4"
        style={{ backgroundColor: "rgba(48, 63, 159, 0.7)" }}
      >
        <div className="flex flex-column align-items-center mb-7">
          <h1 className="text-white text-4xl">
            Visualizations <FontAwesomeIcon icon="chart-simple" />
          </h1>
          <div className="sticky top-0">
            <GlobalLocationSelector />
          </div>
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
