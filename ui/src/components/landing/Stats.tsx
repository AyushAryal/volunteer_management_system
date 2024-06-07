import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { Chart } from "primereact/chart";
import { ProgressSpinner } from "primereact/progressspinner";
import { useEffect } from "react";
import { get_statistics } from "@api/incident.ts";

import { get_id } from "@api/utils";
import { StatisticsFilter } from "@api/incident.ts";
import { GlobalLocationSelector } from "@components/map/GlobalLocationSelector";
import { useTranslation } from "react-i18next";

function make_dataset(label: string, data: { [key: string]: number }) {
  const styles = getComputedStyle(document.documentElement)
  const lightCoral = styles.getPropertyValue("--light-coral")
  const lapisLazuli = styles.getPropertyValue("--lapis-lazuli")
  const keppel = styles.getPropertyValue("--keppel")
  const turquoise = styles.getPropertyValue("--turquoise")
  const earthYellow = styles.getPropertyValue("--earth-yellow")

  const lightCoral2 = styles.getPropertyValue("--light-coral2")
  const lapisLazuli2 = styles.getPropertyValue("--lapis-lazuli2")
  const keppel2 = styles.getPropertyValue("--keppel2")
  const turquoise2 = styles.getPropertyValue("--turquoise2")
  const earthYellow2 = styles.getPropertyValue("--earth-yellow2")

  const colors2 = [lightCoral2, lapisLazuli2, keppel2, turquoise2, earthYellow2];
  const colors = [lightCoral, lapisLazuli, keppel, turquoise, earthYellow];
  return {
    labels: Object.keys(data),
    datasets: [
      {
        label: label,
        data: Object.values(data),
        backgroundColor: colors2,
        borderColor: colors,
        borderWidth: 2,
      },
    ],
  };
}

export const GenderStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;
  const genderData = make_dataset("Volunteer Gender", statistics.volunteers.gender);
  const genderColors = ["rgba(239, 118, 122, 1)", "rgba(69, 105, 144, 1)", "rgba(73, 190, 170, 1)"];
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
};

export const VolunteerCategoryStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return (
    <Chart
      className="h-full w-full"
      type="bar"
      data={make_dataset("Volunteer Category", statistics.volunteers.category)}
      options={{
        maintainAspectRatio: false,
      }}
    />
  );
};

export const BloodGroupStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return (
    <Chart
      className="h-full w-full"
      type="radar"
      data={make_dataset("Blood Group", statistics.volunteers.blood_group)}
      options={{
        maintainAspectRatio: false,
      }}
    />
  );
};

export const AcademicQualificationStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return (
    <Chart
      className="h-full w-full"
      type="bar"
      data={make_dataset("Academic Qualification", statistics.volunteers.academic_qualification)}
      options={{
        maintainAspectRatio: false,
      }}
    />
  );
};

export const JobStatusStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return (
    <Chart
      className="h-full w-full"
      type="pie"
      data={make_dataset("Job Status", statistics.jobs.status)}
      options={{
        indexAxis: "y",
        maintainAspectRatio: false,
      }}
    />
  );
};

export const IncidentByTimeRangeStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  const data = statistics.incidents.by_time.slice().reduce((o, { date, value }) => {
    return Object.assign(o, { [date.toDateString()]: value });
  }, {});

  return (
    <Chart
      className="h-full w-full"
      type="line"
      data={make_dataset("Incidents By Time Range", data)}
      options={{
        tension: 0.4,
        maintainAspectRatio: false,
      }}
    />
  );
};
export const VolunteerByFederal = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  const data = statistics.volunteers.by_federal;
  const labelCallback = function (this: any, value: string | number) {
    const label = this.getLabelForValue(value as number);
    if (label.includes("-")) {
      return label.slice(-2);
    }
    return label;
  };
  const options = {
    scales: {
      x: {
        ticks: {
          callback: labelCallback,
        },
      },
    },
    maintainAspectRatio: false,
  };

  return (
    <Chart
      className="h-full w-full"
      type="bar"
      data={make_dataset("Volunteers By Federal Region", data)}
      options={options}
    />
  );
};
export const JobByFederal = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  const data = statistics.jobs.by_federal;
  const labelCallback = function (this: any, value: string | number) {
    const label = this.getLabelForValue(value as number);
    if (label.includes("-")) {
      return label.slice(-2);
    }
    return label;
  };
  const options = {
    scales: {
      x: {
        ticks: {
          callback: labelCallback,
        },
      },
    },
    maintainAspectRatio: false,
  };
  return (
    <Chart
      className="h-full w-full"
      type="bar"
      data={make_dataset("Jobs By Federal Region", data)}
      options={options}
    />
  );
};

export const IncidentByFederal = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  const data = statistics.incidents.by_federal;
  const labelCallback = function (this: any, value: string | number) {
    const label = this.getLabelForValue(value as number);
    if (label.includes("-")) {
      return label.slice(-2);
    }
    return label;
  };
  const options = {
    scales: {
      x: {
        ticks: {
          callback: labelCallback,
        },
      },
    },
    maintainAspectRatio: false,
  };
  return (
    <Chart
      className="h-full w-full"
      type="bar"
      data={make_dataset("Incidents By Federal Region", data)}
      options={options}
    />
  );
};

export const JobByTimeRangeStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  const data = statistics.jobs.by_time.slice().reduce((o, { date, value }) => {
    return Object.assign(o, { [date.toDateString()]: value });
  }, {});

  return (
    <Chart
      className="h-full w-full"
      type="line"
      data={make_dataset("Jobs By Time Range", data)}
      options={{
        tension: 0.4,
        maintainAspectRatio: false,
      }}
    />
  );
};
export const VolunteersByStatus = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  const data = {
    labels: ["Active", "Inactive"],
    datasets: [
      {
        label: "Volunteers By Status",
        data: [
          statistics.volunteers.active,
          statistics.volunteers.total - statistics.volunteers.active,
        ],
        backgroundColor: ["rgba(69, 105, 144, 1)", "rgba(239, 118, 122, 0.9)"],
        borderColor: ["rgba(69, 105, 144, 1)", "rgba(239, 118, 122, 1)"],
        borderWidth: 1,
      },
    ],
  };
  return (
    <Chart
      className="h-full w-full"
      type="pie"
      data={data}
      options={{
        indexAxis: "y",
        maintainAspectRatio: false,
      }}
    />
  );
};

export const TrainingStats = () => {
  let statistics = useHookstate(storeState.statistics).get();
  if (!statistics) return <ProgressSpinner />;

  return (
    <Chart
      className="h-full w-full"
      type="radar"
      data={make_dataset("Training", statistics.volunteers.training)}
      options={{
        scales: {
          r: {
            pointLabels: {
              font: {
                weight: "semi-bold",
              }
            }
          },
          
        },
        plugins: {
          legend: {
            labels: {
              font: {
                weight: "bold",
              }
            }
          },
        },
        maintainAspectRatio: false,
      }}
    />
  );
};

const Stats = () => {
  const { t } = useTranslation();
  const store = useHookstate(storeState);
  useEffect(() => {
    let networkRequest = async () => {
      let selectedProvince = store.mapControls.selectedProvince.get();
      let selectedDistrict = store.mapControls.selectedDistrict.get();
      let selectedMunicipality = store.mapControls.selectedMunicipality.get();
      let selectedWard = store.mapControls.selectedWard.get();

      let province = selectedProvince ? get_id(selectedProvince) : undefined;
      let district = selectedDistrict ? get_id(selectedDistrict) : undefined;
      let municipality = selectedMunicipality ? get_id(selectedMunicipality) : undefined;
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
      // style={{
      //   backgroundImage: `url(${volunteering2})`,
      // }}
    >
      <div
        className="px-3 h-auto md:px-8 pb-6 pt-4"
        style={{ backgroundColor: "rgba(200, 200, 220, 0.9)" }}
      >
        <div className="flex flex-column align-items-center mb-7">
          <h1 className="text-indigo-800 text-4xl">
            {t("Visualizations")} <FontAwesomeIcon icon="chart-simple" />
          </h1>
          <div className="p-inputtext-sm">
            <GlobalLocationSelector className="flex-row flex-wrap" />
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
          <div className="bg-white border-round flex flex-column align-items-center w-5 min-w-max">
            <span className="text-lg text-bluegray-900 px-3">
              Volunteers By Academic Qualification
            </span>
            <div className="bg-white border-round p-3 w-full h-24rem">
              <AcademicQualificationStats />
            </div>
          </div>
          <div className="bg-white border-round flex flex-column align-items-center w-5 min-w-max">
            <span className="text-lg text-bluegray-900 px-3">Volunteers By Category</span>
            <div className="bg-white border-round p-3 w-full h-24rem">
              <VolunteerCategoryStats />
            </div>
          </div>
        </div>
        <div className="flex flex-row flex-wrap justify-content-around mb-8 gap-7">
          <div className="bg-white border-round flex flex-column align-items-center w-5 min-w-max">
            <span className="text-lg text-bluegray-900 px-3">Volunteers By Training</span>
            <div className="bg-white border-round p-3 w-full h-24rem">
              <TrainingStats />
            </div>
          </div>
          <div className="bg-white border-round flex flex-column align-items-center w-5 min-w-max">
            <span className="text-lg text-bluegray-900 px-3">Volunteers By Status</span>
            <div className="bg-white border-round p-3 w-full h-24rem">
              <VolunteersByStatus />
            </div>
          </div>
          {/* <div className="bg-indigo-100 border-round flex flex-column align-items-center w-5 min-w-max">
            <span className="text-lg text-bluegray-900 px-3">
              Volunteers By Training
            </span>
            <div className="bg-indigo-100 border-round p-3 w-full h-24rem">
              <VolunteerTrainingStats />
            </div>
          </div> */}
        </div>
        {/* <div className="flex flex-row flex-wrap justify-content-around mb-8 gap-7">
        <div className="bg-indigo-100 border-round flex flex-column align-items-center w-5 min-w-max">
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
};

export default Stats;
