import { VolunteerCategoryStats, GenderStats, BloodGroupStats, JobStatusStats, IncidentByTimeRangeStats, JobByTimeRangeStats, AcademicQualificationStats } from "@components/landing/Stats";
import { Divider } from "primereact/divider";
import { ScrollPanel } from "primereact/scrollpanel";

export function Visualizations() {
  return (
    <ScrollPanel className="w-full" style={{ height: "75vh" }}>
      <div className="flex flex-column">
        <div className="py-5">
          <span className="">Volunteers By Categories</span>
          <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
            <VolunteerCategoryStats />
          </div>
        </div>
        <div className="py-5">
          <span className="">Volunteers By Gender</span>
          <div className="p-1 my-3 w-30rem" style={{ width: "100%" }}>
            <GenderStats />
          </div>
        </div>
        <div className="py-5">
          <span className="">Volunteers By Academic Qualification</span>
          <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
            <AcademicQualificationStats />
          </div>
        </div>
        <div className="py-5">
          <span className="">Volunteers By Blood Group</span>
          <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
            <BloodGroupStats />
          </div>
        </div>
        <div className="py-5">
          <span className="">Jobs By Status</span>
          <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
            <JobStatusStats />
          </div>
        </div>
        <div className="py-5">
          <span className="">Incidents By time range</span>
          <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
            <IncidentByTimeRangeStats />
          </div>
        </div>
        <div className="py-5">
          <span className="">Jobs By time range</span>
          <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
            <JobByTimeRangeStats />
          </div>
        </div>
        <Divider />
      </div>
    </ScrollPanel>
  );
}

