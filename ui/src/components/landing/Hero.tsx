// import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";

// import { get_site_content_list } from "@api/incident";
// import { SiteContent } from "@models/incident";
import { map2, volunteering } from "@assets/index";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { useTranslation } from "react-i18next";

const Hero = () => {
    const {t} = useTranslation();
    const navigate = useNavigate();
    // const [siteContents, setSiteContents] = useState<SiteContent[]>([]);

    // useEffect(() => {
    //     get_site_content_list().then((response) => {
    //         setSiteContents(response);
    //     })
    // }, []);
    // const hero = siteContents.find((siteContent) => siteContent.label === "hero");
    // const heroContent = <div>
    //     <p
    //         className="text-white text-xl"
    //         dangerouslySetInnerHTML={{ __html: hero?.content ?? "" }}
    //     />
    // </div>;
    
    const mapControlsSelectedProvince = useHookstate(
      storeState.mapControls.selectedProvince
    );
    const mapControlsSelectedDistrict = useHookstate(
      storeState.mapControls.selectedDistrict
    );
    const mapControlsSelectedMunicipality = useHookstate(
      storeState.mapControls.selectedMunicipality
    );
    const mapControlsSelectedWard = useHookstate(
      storeState.mapControls.selectedWard
    );
    return (
      <section
        className="relative w-full h-auto min-h-screen mx-auto bg-cover"
        style={{
          backgroundImage: `url(${volunteering})`,
        }}
      >
        <div
          className="mx-auto flex flex-row flex-wrap justify-content-center md:p-8 py-7 px-3 h-auto min-h-screen"
          style={{ backgroundColor: "rgba(48, 63, 159, 0.7)", }}
        >
          <div className="flex-1 min-w-5">
            <h1 className="text-4xl text-white">
              {t("Welcome To")}
              <br />
              <span className="">{t("Volunteer Management System")}</span>
            </h1>
            {<div><p className="text-white text-xl">{t("Hero")}</p></div>}
            {/* {heroContent} */}
            <div className="flex flex-wrap align-items-center"></div>
            <Button
              className="my-3 shadow-4"
              label={t("Dashboard")}
              raised
              onClick={() => {
                navigate("/dashboard");
                mapControlsSelectedProvince.set(null);
                mapControlsSelectedDistrict.set(null);
                mapControlsSelectedMunicipality.set(null);
                mapControlsSelectedWard.set(null);
              }}
            />
          </div>
          <div
            className="flex align-self-center pl-6 border-round"
            style={{ width: "50%", minWidth: "300px" }}
          >
            <img
              className="border-round"
              style={{ width: "100%" }}
              src={map2}
              alt="dashboard"
            />
          </div>
        </div>
      </section>
    );
};

export default Hero;
