import "@styles/overview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";



const CountsComponent = () => {
  const counts = {
    "Total Volunteers": 10000,
    "Assigned Volunteers": 10000,
    "Total Incidents": 10000,
    "Total Jobs": 10000,
    "Active Programs": 10000,
    "Completed Programs": 10000,
  }
  return (
    <div
      className="gap-2"
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto",
      }}
    >
      {Object.entries(counts).map(([label, count]) => (
        <div key={label}
          className="flex flex-column justify-content-center align-items-center text-center border-round-sm bg-primary p-5"
        >
          <div className="font-bold">{count}</div>
          <div className="font-semibold">{label}</div>
        </div>
      ))}
    </div>
  );
};


const Overview = () => {
  const navigate = useNavigate();
  return (
    <section className="flex flex-wrap flex-row gap-5 align-items-center justify-content-center bg-indigo-100 p-3">
      <div className="flex-1" style={{ minWidth: "20rem" }}>
        <CountsComponent />
      </div>
      <div className="flex-1">
        <h2 className="text-4xl">Overview</h2>
        <p className="text-lg">
          The National Volunteer Bureau formation and Mobilization Platform
          is a robust platform that houses records of all volunteers based
          on age, skills, preferences, and availability along with the
          functionality to manage them.
        </p>
      </div>
    </section>
  );
}

export default Overview  