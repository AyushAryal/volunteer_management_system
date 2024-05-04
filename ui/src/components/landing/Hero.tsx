import { React } from "react";
import { styles } from "./styles";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full h-auto min-h-screen mx-auto flex flex-col bg-indigo-700">
      
      <div className="max-w-6xl mx-auto flex flex-row p-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl text-white">
            Welcome to <br />
            <span className="">Volunteer Management System</span>
          </h1>
          <p className="text-white text-xl">
            The National Volunteer Bureau formation and Mobilization Platform is
            a robust platform that houses records of all volunteers based on
            age, skills, preferences, and availability along with the
            functionality to manage them. It is built upon the concept of
            creating a national portal embedded with independent platforms for
            national, provincial, district, and municipal governments with a
            bottom-up approach of disaster data partnership focusing on the
            principle of user centric design.
          </p>
          <Button className="my-3" label="Dashboard" onClick={() => navigate("/dashboard")}/>
        </div>
        <div className="align-self-center pl-6 border-round">
          
          <img
            className="border-round"
            src="/src/assets/map_preview.jpg"
            alt="dashboard"
            width="550"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
