import { VolunteerCategoryStats, GenderStats, BloodGroupStats, AcademicQualificationStats } from "@components/landing/Stats";
import { TabView, TabPanel } from "primereact/tabview";

export function Visualizations() {
  const scrollableTabs = [
    {
      title: "Category",
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <VolunteerCategoryStats />
        </div>
      ),
    },
    {
      title: "Gender",
      content: (
        <div className="p-1 my-3 w-30rem" style={{ width: "100%" }}>
          <GenderStats />
        </div>
      ),
    },
    {
      title: "Blood Group",
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <AcademicQualificationStats />
        </div>
      ),
    },
    {
      title: "Academic Qualification",
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <BloodGroupStats />
        </div>
      ),
    },
    { title: "Training", content: "" },
  ];
  console.log(scrollableTabs);
  return (
    <div className="my-3 pl-3 ayushw-30rem">
      <TabView className="">
        {scrollableTabs.map((tab) => {
          return (
            <TabPanel key={tab.title} header={tab.title}>
              {tab.content}
            </TabPanel>
          );
        })}
      </TabView>
    </div>
  );
}

