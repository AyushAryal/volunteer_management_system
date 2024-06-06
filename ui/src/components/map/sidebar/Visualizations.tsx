import { VolunteerCategoryStats, GenderStats, BloodGroupStats, AcademicQualificationStats, VolunteerByFederal } from "@components/landing/Stats";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useRef } from "react";
import { useTranslation } from "react-i18next";



export function Visualizations() {
  const {t} = useTranslation();
  const tabs = [
    {
      title: t("Federal Region"),
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <VolunteerByFederal />
        </div>
      ),
    },
    {
      title: t("Category"),
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <VolunteerCategoryStats />
        </div>
      ),
    },
    {
      title: t("Academic Qualification"),
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <AcademicQualificationStats />
        </div>
      ),
    },
    {
      title: t("Gender"),
      content: (
        <div className="p-1 my-3 w-30rem" style={{ width: "100%" }}>
          <GenderStats />
        </div>
      ),
    },
    {
      title: t("Blood Group"),
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <BloodGroupStats />
        </div>
      ),
    },
    {
      title: t("Training"),
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <BloodGroupStats />
        </div>
      ),
    },
  ];
  const stepperRef = useRef<any>(null);
  return (
    <div>
      <Stepper ref={stepperRef}>
        {tabs.map((tab) => {
          return (
            <StepperPanel key={tab.title}>
              <div className="flex justify-content-between">
                <Button
                  style={{ scale: "0.5" }}
                  severity="secondary"
                  onClick={() => stepperRef.current.prevCallback()}
                ><FontAwesomeIcon icon={faArrowLeft} /></Button>
                <div>{tab.title}</div>
                <Button
                  style={{ scale: "0.5" }}
                  severity="secondary"
                  onClick={() => stepperRef.current.nextCallback()}
                ><FontAwesomeIcon icon={faArrowRight} /></Button>
              </div>
              <div className="flex justify-content-center">{tab.content}</div>
            </StepperPanel>
          );
        })}
      </Stepper>
    </div>
  );
}

