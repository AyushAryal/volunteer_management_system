import { Button } from "primereact/button";
import { useState, useEffect } from "react";
import { getSiteContents, SiteContent} from "@api/siteContents";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  const [siteContents, setSiteContents] = useState([]);
  useEffect(() => {
    getSiteContents().then((response) => {
      setSiteContents(response.results);
    })
  }, []);
  console.log(siteContents)
  return (
    <section className="relative w-full h-auto min-h-screen mx-auto flex flex-col bg-indigo-700">
      <div className="max-w-6xl mx-auto flex flex-row p-8 pt-7">
        <div className="max-w-2xl">
          <h1 className="text-white text-4xl">
            Welcome To
            <br />
            <span className="">Volunteer Management System</span>
          </h1>
          {siteContents.map((content: SiteContent) => (
            <div key={content.label}>
              {content.label === "Hero_description" && (
                <p
                  className="text-white text-lg"
                  dangerouslySetInnerHTML={{ __html: content.content }}
                />
              )}
            </div>
          ))}
          {/* <p className="text-white text-xl">
            The National Volunteer Bureau formation and Mobilization Platform is
            a robust platform that houses records of all volunteers based on
            age, skills, preferences, and availability along with the
            functionality to manage them. It is built upon the concept of
            creating a national portal embedded with independent platforms for
            national, provincial, district, and municipal governments with a
            bottom-up approach of disaster data partnership focusing on the
            principle of user centric design.
          </p> */}
          <Button
            className="my-3 bg-red-600 border-red-600"
            label="Dashboard"
            raised
            onClick={() => navigate("/dashboard")}
          />
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
