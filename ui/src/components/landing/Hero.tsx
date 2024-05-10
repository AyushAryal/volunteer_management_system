import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";

import { get_site_content_list } from "@api/incident";
import { SiteContent } from "@models/incident";

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
        <section className="relative w-full h-auto min-h-screen mx-auto flex flex-col bg-indigo-700">
            <div className="max-w-6xl mx-auto flex flex-row p-8">
                <div className="max-w-2xl">
                    <h1 className="text-4xl text-white">
                        Welcome To
                        <br />
                        <span className="">Volunteer Management System</span>
                    </h1>
                    {heroContent}
                    <Button
                        className="my-3"
                        label="Dashboard"
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
