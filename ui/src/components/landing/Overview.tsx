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

  const {
    volunteers,
    gender,
    nationality,
    total_incidents,
    total_programs,
    total_jobs,
  } = stats

  const counts = {
    "Total Volunteers": volunteers,
    "Male Volunteers": gender.find((g:any) => g.gender === 0)?.count,
    "Female Volunteers": gender.find((g:any) => g.gender === 1)?.count,
    "Local Volunteers": nationality.find((n:any) => n.nationality === 0)?.count,
    "Foreign Volunteers": nationality.find((n:any) => n.nationality === 1)?.count,
    "Total Incidents": total_incidents,
    "Total Programs": total_programs,
    "Total Jobs": total_jobs,
  };

  // const counts = {
  //   "Total Volunteers": 10456,
  //   "Assigned Volunteers": 9452,
  //   "Total Incidents": 42640,
  //   "Total Jobs": 10600,
  //   "Active Programs": 757,
  //   "Completed Programs": 1642,
  // };
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
          <div className="font-bold text-2xl">{count}</div>
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