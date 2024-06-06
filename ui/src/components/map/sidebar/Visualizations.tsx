import { VolunteerCategoryStats, GenderStats, BloodGroupStats, AcademicQualificationStats, VolunteerByFederal } from "@components/landing/Stats";
import { faArrowLeft, faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "primereact/button";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { useRef } from "react";



export function Visualizations() {
  const tabs = [
    {
      title: "Federal Region",
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <VolunteerByFederal />
        </div>
      ),
    },
    {
      title: "Category",
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <VolunteerCategoryStats />
        </div>
      ),
    },
    {
      title: "Academic Qualification",
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <AcademicQualificationStats />
        </div>
      ),
    },
    {
      title: "Gender",
      content: (
        <div className="p-1 my-3 w-30rem" style={{ width: "100%" }}>
          <GenderStats />
        </div>
      ),
    },
    {
      title: "Blood Group",
      content: (
        <div className="p-1 my-3 w-30rem" style={{ height: "20rem" }}>
          <BloodGroupStats />
        </div>
      ),
    },
    {
      title: "Training",
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
              {tab.content}
            </StepperPanel>
          );
        })}
      </Stepper>
    </div>
  );
}

