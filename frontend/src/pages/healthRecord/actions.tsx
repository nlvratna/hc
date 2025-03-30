import { createStore } from "solid-js/store";
import { Gender } from "./types";
import { HOME_URL } from "../../Config";
import { apiRequest } from "../../utils";

// Define the types properly
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
  isNewUser: boolean;
}

// Create an initial empty date to use as default
const defaultDate = new Date();

// Main health record store with isNewUser flag
export const [data, setData] = createStore<HealthRecordInput>({
  details: {
    age: null,
    gender: Gender.Male,
    medication: [],
  },
  submitted: false,
  err: "",
  isNewUser: false,
});

// Temporary store for new medication being added
export const [medicationData, setMedicationData] = createStore({
  details: {
    name: "",
    prescription: "",
    reportedAt: defaultDate,
  },
  err: "",
});

// Initialize data from API response - handle both existing users and new users
export const initializeData = (recordResponse: any) => {
  if (recordResponse?.healthRecord) {
    // Existing user with health record
    setData("isNewUser", false);
    setData("details", {
      age: recordResponse.healthRecord.age
        ? new Date(recordResponse.healthRecord.age)
        : null,
      gender: recordResponse.healthRecord.gender || Gender.Male,
      medication: recordResponse.healthRecord.medication || [],
    });
  } else {
    // New user without health record
    setData("isNewUser", true);
    setData("details", {
      age: null,
      gender: Gender.Male,
      medication: [],
    });
  }
};

// Add medication function
export const addMedication = () => {
  const med = medicationData.details;

  // Validate inputs
  if (!med.name) {
    setMedicationData("err", "Name is required for medication details");
    return false;
  }

  if (!med.reportedAt) {
    setMedicationData("err", `The reported date for ${med.name} is required`);
    return false;
  }

  // Add to medications array
  setData("details", "medication", (prev) => [
    ...prev,
    {
      name: med.name,
      prescription: med.prescription,
      reportedAt: med.reportedAt,
    },
  ]);

  // Reset form
  setMedicationData("details", {
    name: "",
    prescription: "",
    reportedAt: defaultDate,
  });
  setMedicationData("err", "");

  return true;
};

// Delete medication function
export const deleteMedication = (index: number) => {
  setData("details", "medication", (medications) =>
    medications.filter((_, i) => i !== index),
  );
};

// Update existing medication function
export const updateMedication = (index: number, updatedMed: Medication) => {
  setData("details", "medication", (medications) => {
    const newMedications = [...medications];
    newMedications[index] = updatedMed;
    return newMedications;
  });
};

// Submit the entire health record
export const submitHealthRecord = async () => {
  try {
    setData("submitted", true);

    // Choose the appropriate endpoint based on whether it's a new user or not
    const endpoint = data.isNewUser
      ? `${HOME_URL}/health-record/create`
      : `${HOME_URL}/health-record/update`;

    const { err } = await apiRequest(endpoint, {
      method: "POST",
      body: JSON.stringify(data.details),
    });
    if (err) setData("err", err);

    // After successful submission, mark as no longer a new user
    if (data.isNewUser) {
      setData("isNewUser", false);
    }

    return true;
  } catch (error: any) {
    setData("err", error.message || "Failed to submit health record");
    return false;
  } finally {
    setData("submitted", false);
  }
};
