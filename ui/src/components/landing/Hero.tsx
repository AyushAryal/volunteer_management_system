// import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";

// import { get_site_content_list } from "@api/incident";
// import { SiteContent } from "@models/incident";
import { vmsdemo, volunteering } from "@assets/index";
import { useHookstate } from "@hookstate/core";
import { storeState } from "@models/store";
import { useTranslation } from "react-i18next";

const Hero = () => {
  const { t } = useTranslation();
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

  const mapControlsSelectedProvince = useHookstate(storeState.mapControls.selectedProvince);
  const mapControlsSelectedDistrict = useHookstate(storeState.mapControls.selectedDistrict);
  const mapControlsSelectedMunicipality = useHookstate(storeState.mapControls.selectedMunicipality);
  const mapControlsSelectedWard = useHookstate(storeState.mapControls.selectedWard);
  return (
    <section
      className="w-full h-auto min-h-screen mx-auto bg-cover"
      style={{
        backgroundImage: `url(${volunteering})`,
      }}
    >
      <div
        className="mx-auto md:px-7 px-3 h-auto min-h-screen flex align-items-center"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      >
        <div
          className="flex mt-7 pb-4 px-4 border-round-3xl"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="flex flex-row align-content-center flex-wrap">
            <div className="flex-1 px-6">
              <h1 className="text-4xl text-white">
                {t("Welcome To")}
                <br />
                <span className="">{t("Volunteer Management System")}</span>
              </h1>
              <div>
                <p className="text-white text-justify text-lg">{t("Hero")}</p>
              </div>
              {/* {heroContent} */}

              <div>
                <Button
                  className="mt-3 shadow-4 border-red-400 text-white"
                  label={t("Dashboard")}
                  size="small"
                  outlined
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
            </div>

            <div className="flex align-items-center justify-content-center" style={{ width: "50%" }}>
              <img
                className="border-round-lg shadow-5 min-w-15rem"
                style={{ width: "85%" }}
                src={vmsdemo}
                alt="dashboard"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
