import { createStore } from "solid-js/store";
import { apiRequest } from "../../utils";
import { HOME_URL } from "../../Config";

export enum Gender {
  Male = "Male",
  Female = "Female",
  Other = "Other",
}

export interface Medication {
  id?: number;
  name: string;
  prescription: string;
  reportedAt: Date;
}

export interface HealthRecordInput {
  details: {
    id?: number;
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
    console.log("at initilization");
    console.log(data);
    setData("isDataAvailable", true);
    setData("details", {
      id: data.healthRecord.id ?? 0,
      age: data.healthRecord.age ? new Date(data.healthRecord.age) : null,
      gender: data.healthRecord.gender || Gender.Male,
      medication: data.healthRecord.symptoms || [],
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
export const updateMedication = (index: number, updatedMed: Medication) => {
  setData("details", "medication", (medications) => {
    const newMedications = [...medications];
    newMedications[index] = updatedMed;
    return newMedications;
  });
};

// is the new data available to seee need to check that and may be initialize new one
export const submitHealthRecord = async () => {
  try {
    setData("submitted", true);

    const endpoint = !data.isDataAvailable
      ? `${HOME_URL}/health-record/create`
      : `${HOME_URL}/health-record/update`;

    const method = !data.isDataAvailable ? "POST" : "PUT";
    console.log("at submit method");
    console.log(data.details);
    const response = await apiRequest(endpoint, {
      method: method,
      body: JSON.stringify(data.details),
    });
    if (response.err) {
      setData("err", response.err);
      return { success: false, response: null };
    }

    setData("isDataAvailable", true);
    return { success: true, response: response.data };
  } catch (error: any) {
    setData("err", error.message || "Failed to submit health record");
    return { success: false, response: null };
  } finally {
    setData("submitted", false);
  }
};
