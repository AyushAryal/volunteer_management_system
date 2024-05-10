import "@styles/overview.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";

const CountsComponent = ({ counts:{} }) => {
  return (
    <div className="grid my-gutter flex">
      {Object.entries(counts).map(([label, count]) => (
        <div key={label} className="col-6">
          <div className="h-full text-center py-3 px-2 border-round-sm bg-primary">
            <div className="font-bold">{count}</div>
            <div className="font-semibold">{label}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

const counts = {
  "Total Volunteers": 10000,
  "Assigned Volunteers": 10000,
  "Total Incidents": 10000,
  "Total Jobs": 10000,
  "Active Programs": 10000,
  "Completed Programs": 10000,
}

const Overview = () => {
  const navigate = useNavigate();
    return (
      <section className="relative w-full h-auto mx-auto flex flex-column bg-indigo-100">
        <div className="mx-auto flex flex-row px-8 pt-7">
          <div className="w-11 text-gray-800 mr-6">
            <h1 className="text-4xl">Overview</h1>
            <p className="text-lg">
              The National Volunteer Bureau formation and Mobilization Platform
              is a robust platform that houses records of all volunteers based
              on age, skills, preferences, and availability along with the
              functionality to manage them.
            </p>
          </div>
          <div className="align-self-center border-round w-full p-2 mt-6 ml-6">
            <CountsComponent counts={counts} />
          </div>
        </div>
        <div className="mx-auto flex flex-row px-8 pb-8 pt-4 mx-8 mt-6">
          <p className="text-xl align-self-center mr-8">
            Are you ready to be a{" "}
            <span className="text-red-600">VOLUNTEER</span> ? <br />
            <span className="text-lg text-gray-800">
              You can help your community and the country in the event of a
              disaster.Just sign up to be a volunteer and help make a
              difference.
            </span>
          </p>
          <Button
            className="mt-"
            style={{
              width: "10rem",
              height: "9rem",
              objectFit: "cover",
              borderRadius: "100%",
            }}
            onClick={() => navigate("/signup")}
          >
            <FontAwesomeIcon
              className="p-1 mt-4 text-red-500 align-self-center"
              icon="user-plus"
              size="6x"
            ></FontAwesomeIcon>
          </Button>
        </div>
      </section>
    );
}

export default Overview  