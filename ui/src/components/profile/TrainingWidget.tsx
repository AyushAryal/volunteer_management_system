import { FileInput } from "@components/FileInput";
import { VolunteerFormContext } from "@forms/volunteer";
import { Training } from "@models/incident";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useContext } from "react";


type TrainingWidgetProps = {
  training: Training,
  onChange: (training: Training) => void,
}

export function TrainingEditWidget({ training, onChange }: TrainingWidgetProps) {
  const trainingCategories = [
    { value: "Rescue" },
    { value: "Relief Distribution" },
    { value: "Evacuation" },
    { value: "Other" },
    { value: "Health and Safety" },
    { value: "Logistics" },
    { value: "Soft Skills" },
    { value: "Leadership" },
    { value: "Team Training" },
    { value: "Management" },
    { value: "Quality Training" },
    { value: "Humanitarian" },
    { value: "Family Reunification" },
    { value: "Motor Vehicle Operator" },
  ];

  return <div
    className="flex flex-column w-full align-items-stretch pt-3"
    style={{ gap: "2rem" }}
  >
    <span className="p-float-label">
      <InputText
        value={training.name}
        id="training-name"
        className="p-inputtext-sm w-full"
        onChange={(ev) => {
          onChange({
            ...training,
            name: ev.target.value
          });
        }}
      />
      <label htmlFor="training-name">Training Name</label>
    </span>

    <span className="p-float-label">
      <InputText
        value={training.subject}
        id="training-subject"
        className="p-inputtext-sm w-full"
        onChange={(ev) => {
          onChange({
            ...training,
            subject: ev.target.value
          });
        }}
      />
      <label htmlFor="training-name">Training Subject</label>
    </span>

    <Dropdown
      value={training.category}
      onChange={(ev) => onChange({
        ...training,
        category: ev.target.value
      })}
      options={trainingCategories}
      placeholder="Select a category"
      optionLabel="value"
    />

    <FileInput
      file={training.image}
      onChange={(file) => {
        onChange({
          ...training,
          image: file ?? ""
        });
      }}
    />
  </div>
}

export function TrainingListWidget() {
  let { form, setForm } = useContext(VolunteerFormContext);

  let trainingEdit = form.trainings.map((training, index) => (
    <>
      <div className="flex justify-content-end">
        <Button
          size="small"
          outlined
          label="Remove Training"
          severity="danger"
          onClick={() => {
            setForm({
              ...form,
              trainings: form.trainings.filter((t) => t !== training),
            });
          }}
        />
      </div>
      <TrainingEditWidget
        key={index}
        training={training}
        onChange={(training) => {
          let trainings = Object.assign([...form.trainings], {
            [index]: training,
          });
          setForm({ ...form, trainings });
        }}
      />
    </>
  ));

  return <div className="flex flex-column gap-2">
    {...trainingEdit}
    <div className="flex justify-content-start">
      <Button size="small" outlined label="Add Training" onClick={() => {
        setForm({
          ...form, trainings: [...form.trainings, {
            name: "",
            subject: "",
            image: "",
            category: "",
          }]
        });
      }} />
    </div>
  </div>;
}
