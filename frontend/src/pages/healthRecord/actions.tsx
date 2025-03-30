import { createStore } from "solid-js/store";
import { apiRequest } from "../../utils";
import { HOME_URL } from "../../Config";

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export interface Medication {
  name: string;
  prescription: string;
  reportedAt: Date;
}

export interface HealthRecordInput {
  details: {
    age: Date | null;
    gender: Gender;
    medication: Medication[];
  };
  submitted: boolean;
  err: string;
  isDataAvailable: boolean;
}

const defaultDate = new Date();

// State Management
export const [data, setData] = createStore<HealthRecordInput>({
  details: {
    age: null,
    gender: Gender.Male,
    medication: [],
  },
  submitted: false,
  err: "",
  isDataAvailable: false,
});

export const [medicationData, setMedicationData] = createStore({
  details: {
    name: "",
    prescription: "",
    reportedAt: defaultDate,
  },
  err: "",
});

export const initializeData = (data: null | any) => {
  if (data === null) {
    setData("isDataAvailable", false);
  } else {
    setData("isDataAvailable", true);
    setData("details", {
      age: data.healthRecord.age ? new Date(data.healthRecord.age) : null,
      gender: data.healthRecord.gender || Gender.Male,
      medication: data.healthRecord.medication || [],
    });
  }
};

// Form Management
export const addMedication = () => {
  const med = medicationData.details;

  if (!med.name) {
    setMedicationData("err", "Name is required for medication details");
    return false;
  }

  if (!med.reportedAt) {
    setMedicationData("err", `The reported date for ${med.name} is required`);
    return false;
  }

  setData("details", "medication", (prev) => [...prev, { ...med }]);

  setMedicationData("details", {
    name: "",
    prescription: "",
    reportedAt: new Date(),
  });
  setMedicationData("err", "");

  return true;
};

export const deleteMedication = (index: number) => {
  setData("details", "medication", (medications) =>
    medications.filter((_, i) => i !== index),
  );
};

//send an api request to update in backend
export const updateMedication = (
  index: number,
  medicationId: number,
  updatedMed: Medication,
) => {
  setData("details", "medication", (medications) => {
    const newMedications = [...medications];
    newMedications[index] = updatedMed;
    return newMedications;
  });
};

export const submitHealthRecord = async () => {
  try {
    setData("submitted", true);

    //if user skips the endpoint is going to be the same after handle that
    const endpoint = !data.isDataAvailable
      ? `${HOME_URL}/health-record/create`
      : `${HOME_URL}/health-record/update`;

    const { err } = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data.details),
    });

    if (err) {
      setData("err", err);
      return false;
    }

    setData("isDataAvailable", true);
    return true;
  } catch (error: any) {
    setData("err", error.message || "Failed to submit health record");
    return false;
  } finally {
    setData("submitted", false);
  }
};
