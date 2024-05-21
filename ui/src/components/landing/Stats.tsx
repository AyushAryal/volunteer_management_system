
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chart } from "primereact/chart";

export const  GenderStats = () => {
  const genders = ["Male", "Female", "Other"]
  const data = {
    labels: genders,
    datasets: [
      {
        label: "Volunteers",
        data: [5400, 3250, 170],
        backgroundColor: ["#2f4b7c", "#f95d6a", "#ffa600"],
        borderColor: ["#2f4b7c", "#f95d6a", "#ffa600"],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          usePointStyle: true,
        },
      },
    },
  };
  
  return <Chart className="w-full h-full" type="pie" data={data} options={options}></Chart>;
}

export const VolunteerCategoryStats = () => {
  const volunteerCategories = [
    "Student",
    "RSS",
    "Retired APF",
    "Retired Army",
    "Retired Government Service",
    "Senior Citizen",
    "Community",
    "General",
  ];
  const data = {
    labels: volunteerCategories,
    datasets: [
      {
        label: "Volunteer Categories",  
        data: [1370, 1150, 1840, 1290, 950, 1310, 1350, 1270],
        backgroundColor: [
          "#003f5c",
          "#665191",
          "#a05195",
          "#d45087",
          "#f95d6a",
          "#ff7c43",
          "#ffa600",
          "#2f4b7c",
        ],
        borderColor: [
          "#003f5c",
          "#665191",
          "#a05195",
          "#d45087",
          "#f95d6a",
          "#ff7c43",
          "#ffa600",
          "#2f4b7c",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    indexAxis: "y",
    maintainAspectRatio: false,
  };
  return <Chart className="h-full w-full" type="bar" data={data} options={options}></Chart>;
}
export const VolunteersOnProvinceStats = () => {
  const provinces = [
    "Koshi",
    "Madhesh",
    "Bagmati",
    "Gandaki",
    "Lumbini",
    "Karnali",
    "Sudurpashchim",
  ];
  const data = {
    labels: provinces,
    datasets: [
      {
        label: "Volunteers on  Province",
        data: [1370, 1150, 1840, 1290, 950, 1310, 1350],
        backgroundColor: [
          "#665191",
          "#a05195",
          "#d45087",
          "#f95d6a",
          "#ff7c43",
          "#ffa600",
          "#2f4b7c",
        ],
        borderColor: [
          "#665191",
          "#a05195",
          "#d45087",
          "#f95d6a",
          "#ff7c43",
          "#ffa600",
          "#2f4b7c",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
  };
  return <Chart className="h-full w-full" type="bar" data={data} options={options}></Chart>;
}
export const TrainingStats = () => {
  const trainings = ["Rescue", "Relief Distribution", "Evacuation", "Other"];
  const data = {
    labels: trainings,
    datasets: [
      {
        label: "Volunteers with Trainings",
        data: [1370, 1150, 1840, 1290],
        backgroundColor: [
          "#665191",
          "#a05195",
          "#d45087",
          "#f95d6a",
          "#ff7c43",
          "#ffa600",
          "#2f4b7c",
        ],
        borderColor: [
          "#665191",
          "#a05195",
          "#d45087",
          "#f95d6a",
          "#ff7c43",
          "#ffa600",
          "#2f4b7c",
        ],
        borderWidth: 1,
      },
    ],
  };
  const options = {
    maintainAspectRatio: false,
  };
  return <Chart className="h-full w-full" type="bar" data={data} options={options}></Chart>;
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
        <div className="bg-indigo-100 border-round p-3 shadow-4 w-5 min-w-max h-24rem">
          <VolunteersOnProvinceStats />
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-content-around gap-7 mb-7">
        <div className="bg-indigo-100 border-round p-3 shadow-4 w-5 min-w-max h-24rem">
          <VolunteerCategoryStats />
        </div>
        <div className="bg-indigo-100 border-round p-3 shadow-4 w-5 min-w-max h-24rem">
          <TrainingStats />
        </div>
      </div>
    </section>
  );
}

export default Stats  
