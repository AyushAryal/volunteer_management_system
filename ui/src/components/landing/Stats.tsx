import { Card } from "primereact/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Chart } from "primereact/chart";

const  GenderStats = () => {
  const data = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        label: "Volunteers",
        data: [5400, 3250, 73],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132)",
          "rgba(75, 192, 192)",
          "rgba(153, 102, 255)",
        ],
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
  
  return <Chart type="pie" data={data} options={options}></Chart>;
}

const VolunteerCategoryStats = () => {
  const data = {
    labels: ["Male", "Female", "Other"],
    datasets: [
      {
        label: "Volunteers",
        data: [5400, 3250, 73],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132)",
          "rgba(75, 192, 192)",
          "rgba(153, 102, 255)",
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
    <section className="w-full mx-auto bg-indigo-700 px-8 py-6">
      <div className="flex justify-content-center">
        <h1 className="text-white text-4xl mb-7">
          Visualizations <FontAwesomeIcon icon="chart-simple" />
        </h1>
      </div>
      <div className="flex flex-row flex-wrap justify-content-around mb-7 gap-5">
        <div className="bg-white border-round p-3 shadow-4 w-4">
          <GenderStats />
        </div>
        <div className="bg-white border-round p-3 shadow-4 w-4">
          <VolunteerCategoryStats />
        </div>
      </div>
      <div className="flex flex-row flex-wrap justify-content-around gap-5 mb-7">
        <div className="bg-white border-round p-3 shadow-4 w-4">
          <VolunteerCategoryStats />
        </div>
        <div className="bg-white border-round p-3 shadow-4 w-4">
          <GenderStats />
        </div>
      </div>
    </section>
  );
}

export default Stats  
