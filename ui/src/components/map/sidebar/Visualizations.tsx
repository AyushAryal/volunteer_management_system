import { VolunteerCategoryStats, GenderStats, VolunteersOnProvinceStats } from "@components/landing/Stats";
import { ScrollPanel } from "primereact/scrollpanel";

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
          </div>
        </div>
      </ScrollPanel>
    );
}

