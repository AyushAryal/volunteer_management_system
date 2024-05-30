import "@styles/overview.css";
import { Statistics } from "@models/incident";
import { useState, useEffect } from "react";
import { ProgressSpinner } from "primereact/progressspinner";
import { get_statistics } from "@api/incident";


const CountsComponent = () => {
  const [stats, setStats] = useState({} as Statistics);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get_statistics().then((response) => {
      setStats(response);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="flex align-self-center">
      <ProgressSpinner />
    </div>
  );

  const counts = {
    "Total Volunteers": stats.volunteers.total,
    "Male Volunteers": stats.volunteers.gender.Male,
    "Female Volunteers": stats.volunteers.gender.Female,
    "National Volunteers": stats.volunteers.nationality.National,
    "International Volunteers": stats.volunteers.nationality.International,
    "Total Incidents": stats.incidents.total,
    "Total Programs": stats.programs.total,
    "Total Jobs": stats.jobs.total,
  };

  return (
    <div
      className="gap-2"
      style={{
        display: "grid",
        gridTemplateColumns: "auto auto",
      }}
    >
      {Object.entries(counts).map(([label, count]) => (
        <div
          key={label}
          className="flex flex-column justify-content-center align-items-center text-center border-round-sm bg-primary p-5"
        >
          <div className="font-bold text-2xl text-cyan-100">{count}</div>
          <div className="font-semibold">{label}</div>
        </div>
      ))}
    </div>
  );
};


const Overview = () => {
  return (
    <section className="flex flex-wrap flex-row gap-5 align-items-center justify-content-center bg-indigo-100 p-3">
      <div
        className="flex-1"
        style={{ minWidth: "20rem" }}
      >
        <CountsComponent />
      </div>
      <div className="flex-1">
        <h2 className="text-4xl">Overview</h2>
        <p className="text-lg">
          The National Volunteer Bureau formation and Mobilization Platform is a
          robust platform that houses records of all volunteers based on age,
          skills, preferences, and availability along with the functionality to
          manage them.
        </p>
      </div>
    </section>
  );
}

export default Overview  
