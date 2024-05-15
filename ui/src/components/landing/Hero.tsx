import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";

import { get_site_content_list } from "@api/incident";
import { SiteContent } from "@models/incident";
import {map1, map2} from "@assets/index";

const Hero = () => {
    const navigate = useNavigate();
    const [siteContents, setSiteContents] = useState<SiteContent[]>([]);

    useEffect(() => {
        get_site_content_list().then((response) => {
            setSiteContents(response);
        })
    }, []);

    const hero = siteContents.find((siteContent) => siteContent.label === "hero");
    const heroContent = <div>
        <p
            className="text-white text-xl"
            dangerouslySetInnerHTML={{ __html: hero?.content ?? "" }}
        />
    </div>;

    return (
      <section className="relative w-full h-auto min-h-screen mx-auto bg-indigo-700">
        <div className="mx-auto flex flex-row flex-wrap justify-content-center p-8 py-7">
          <div className="flex-1 min-w-5">
            <h1 className="text-4xl text-white">
              Welcome To
              <br />
              <span className="">Volunteer Management System</span>
            </h1>
            {heroContent}
            <div className="flex flex-wrap align-items-center"></div>
            <Button
              className="my-3 fadeinleft animation-duration-1000 animation-iteration-1 animation-ease-in shadow-4"
              label="Dashboard"
              raised
              onClick={() => navigate("/dashboard")}
            />
          </div>
          <div className="align-self-center pl-6 border-round">
            <img
              className="border-round"
              src={map2}
              alt="dashboard"
              width="550"
            />
          </div>
        </div>
      </section>
    );
};

export default Hero;
