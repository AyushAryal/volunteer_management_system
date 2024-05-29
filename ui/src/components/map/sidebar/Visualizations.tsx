import { VolunteerCategoryStats, GenderStats, VolunteerTrainingStats, BloodGroupStats, JobStatusStats, IncidentByTimeRangeStats, JobByTimeRangeStats, AcademicQualificationStats } from "@components/landing/Stats";
import { Divider } from "primereact/divider";
import { ScrollPanel } from "primereact/scrollpanel";

export function Visualizations() {
  return (
    <ScrollPanel className="w-full" style={{ height: "75vh" }}>
      <div className="flex flex-column">
        <span className="">Volunteers By Categories</span>
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <VolunteerCategoryStats />
        </div>
        <span className="">Volunteers By Gender</span>
        <div className="p-1 my-3 w-30rem" style={{ width: "100%" }}>
          <GenderStats />
        </div>
        <span className="">Volunteers By Training</span>
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <VolunteerTrainingStats />
        </div>
        <span className="">Volunteers By Academic Qualification</span>
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <AcademicQualificationStats />
        </div>
        <span className="">Volunteers By Blood Group</span>

        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <BloodGroupStats />
        </div>
        <span className="">Jobs By Status</span>
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <JobStatusStats />
        </div>
        <span className="">Incident by time range</span>
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <IncidentByTimeRangeStats />
        </div>
        <span className="">Jobs by time range</span>
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <JobByTimeRangeStats />
        </div>
        <Divider />

      </div>
    </ScrollPanel>
  );
}

