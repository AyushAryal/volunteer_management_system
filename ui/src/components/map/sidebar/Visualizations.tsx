import { endpoints, server } from "@api/api";
import { token_aware_fetch } from "@api/token";
import { VolunteerCategoryStats, GenderStats, VolunteersOnProvinceStats } from "@components/landing/Stats";
import { Chart } from "primereact/chart";
import { ScrollPanel } from "primereact/scrollpanel";


async function foo() {
  let response = await token_aware_fetch(endpoints.statistics);
  if (!response.ok) {
    return [];
  }
  return await response.json();
}


export const VolunteerStats = () => {
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

export function Visualizations() {
  return (
    <ScrollPanel className="w-full" style={{ height: "75vh" }}>
      <div className="flex flex-column align-items-center">
        <div className="m-1 w-30rem" style={{ height: "75vh" }}>
          <VolunteersOnProvinceStats />
        </div>
        <div className="p-1 my-3 w-30rem" style={{ height: "75vh" }}>
          <VolunteerCategoryStats />
        </div>
        <div className="my-3">
          <GenderStats />
          <VolunteerStats />

        </div>
      </div>
    </ScrollPanel>
  );
}

