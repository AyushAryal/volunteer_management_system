import "@styles/overview.css";



const CountsComponent = () => {
  const counts = {
    "Total Volunteers": 10530,
    "Assigned Volunteers": 9452,
    "Total Incidents": 42264,
    "Total Jobs": 42264,
    "Active Programs": 757,
    "Completed Programs": 1642,
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