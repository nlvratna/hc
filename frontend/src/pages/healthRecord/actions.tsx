import { date, healthRecordInput, medication, Gender } from "./types";
import { createStore } from "solid-js/store";

export const [data, setData] = createStore<healthRecordInput>({
  details: {
    age: date,
    gender: Gender.Male,
    familyHistory: [] as string[],
    medication: [] as medication[],
  },
  submitted: false,
  err: "",
});
export const [meidcalData, setMedicalData] = createStore({
  details: { name: "", prescription: "", reportedAt: date },
  err: "",
});

export const addFunction = () => {
  const data = meidcalData.details;
  if (!data.name) {
    setMedicalData("err", "name is required for medication details");
  }
  if (!data.reportedAt) {
    setMedicalData("err", `the time ${data.name} is required`);
  }
  setData("details", "medication", (prev) => [
    ...prev,
    {
      name: data.name,
      prescription: data.prescription,
      reportedAt: data.reportedAt as unknown as Date,
    },
  ]);
  setMedicalData("details", { name: "", prescription: "", reportedAt: date });
};

export const deleteFunction = (index: number) => {
  setData("details", "medication", (medications) =>
    medications.filter((_, i) => i !== index),
  );
};
