
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { FileInput } from "@components/FileInput";
import { Training, TrainingCategory } from "@models/incident";
import { StateTuple } from "@models/generics";

const trainingCategories: { value: TrainingCategory; label: string }[] = [
  { value: "Rescue", label: "Rescue" },
  { value: "Reliefdistribution", label: "Relief Distribution" },
  { value: "Evacuation", label: "Evacuation" },
  { value: "Other", label: "Other" },
  { value: "Healthandsafety", label: "Health and Safety" },
  { value: "Logistics", label: "Logistics" },
  { value: "Softskills", label: "Soft Skills" },
  { value: "Leadership", label: "Leadership" },
  { value: "Teamtraining", label: "Team Training" },
  { value: "Management", label: "Management" },
  { value: "Qualitytraining", label: "Quality Training" },
  { value: "Humanitarian", label: "Humanitarian" },
  { value: "Familyreunification", label: "Family Reunification" },
  { value: "Motorvehicleoperator", label: "Motor Vehicle Operator" },
];

type TrainingWidgetProps = {
  trainingsState: StateTuple<Training[]>;
}
export function TrainingWidget(props: TrainingWidgetProps) {
  const {trainingsState,}=props;
  const [trainings, setTrainings] = trainingsState;

  const addTraining = () => {
    setTrainings([
      ...trainings,
      { name: "", subject: "", category: "Other", image: "" },
    ]);
  };

  const updateTraining = (index: number, field: keyof Training, value: any) => {
    const updatedTrainings = [...trainings];
    updatedTrainings[index][field] = value;
    setTrainings(updatedTrainings);
  };

  const removeTraining = (index: number) => {
    setTrainings(trainings.filter((_: any, i: number) => i !== index));
  };

  return (
    <div>
      {trainings.map((training: Training, index: number) => (
        <div key={index}>
          <div
            className="flex flex-column w-full align-items-stretch"
            style={{ gap: "1.5rem" }}
          >
            <span className="p-float-label">
              <InputText
                className="w-full p-inputtext-sm"
                id={`name-${index}`}
                value={training.name}
                onChange={(e) => updateTraining(index, "name", e.target.value)}
              />
              <label htmlFor={`name-${index}`}>Name</label>
            </span>

            <span className="p-float-label">
              <InputText
                className="w-full p-inputtext-sm"
                id={`subject-${index}`}
                value={training.subject}
                onChange={(e) =>
                  updateTraining(index, "subject", e.target.value)
                }
              />
              <label htmlFor={`subject-${index}`}>Subject</label>
            </span>

            <Dropdown
              className="w-full p-inputtext-sm"
              id={`category-${index}`}
              value={training.category}
              options={trainingCategories}
              onChange={(e) => updateTraining(index, "category", e.value)}
              placeholder="Select a category"
              optionLabel="label"
            />
          </div>
          <div className="flex flex-row justify-content-between">
            <FileInput
              file={training.image}
              onChange={(file) => updateTraining(index, "image", file)}
            />
            <div>
              <Button
                label="Remove Training"
                className="p-button-danger mt-4"
                size="small"
                onClick={() => removeTraining(index)}
              ></Button>
            </div>
          </div>
        </div>
      ))}

      <Button label="Add Training" onClick={addTraining} />
    </div>
  );
}
