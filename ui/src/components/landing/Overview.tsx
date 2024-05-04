import {React} from "react";
import {Card} from "primereact/card";

const Overview = () => {
    return (
      <section className="relative w-full h-auto mx-auto flex flex-col bg-indigo-400">
        <div className="max-w-6xl mx-auto flex flex-row p-8">
          <div className="max-w-2xl mr-6">
            <h1 className="text-4xl text-white">Overview</h1>
            <p className="text-white text-xl">
              The National Volunteer Bureau formation and Mobilization Platform
              is a robust platform that houses records of all volunteers based
              on age, skills, preferences, and availability along with the
              functionality to manage them.
            </p>
          </div>
          <div className="align-self-center border-round w-6 my-6">
            <Card>Counts</Card>
          </div>
        </div>
      </section>
    );
}

export default Overview  