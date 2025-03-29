import { For } from "solid-js";
import { createStore } from "solid-js/store";

enum Gender {
  Male = "male",
  Female = "female",
}

const date = new Date();

//TODO : add submit fucntion to submit healthRecord
export default function SubmitHealthRecord() {
  // interface healthRecord {
  //   age: Date;
  //   gender: Gender;
  //   familyHistory: string[];
  //   medication: medication[];
  // }

  interface medication {
    name: string;
    prescription?: string;
    reportedAt: typeof date;
  }
  const [data, setData] = createStore({
    details: {
      age: "",
      gender: "",
      familyHistory: [] as string[],
      medication: [] as medication[],
    },
    submitted: false,
    err: "",
  });
  const [meidcalData, setMedicalData] = createStore({
    details: { name: "", prescription: "", reportedAt: date },
    add: false,
    delete: false,
    err: "",
  });

  const addFunction = () => {
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

  const deleteFunction = (index: number) => {
    setData("details", "medication", (medications) =>
      medications.filter((_, i) => i !== index),
    );
  };

  return (
    <>
      <div class="flex flex-col justify-center items-center min-h-screen ">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-blue-800 mb-2">Medical History</h2>
          <p class="text-gray-500">Please provide your medical information</p>
        </div>

        <form class="space-y-6">
          {/* Personal Details Section */}
          <div class="grid md:grid-cols-2 gap-6">
            {/* Age Input */}
            <div class="bg-white p-4 rounded-lg shadow-md">
              <label class="block text-gray-700 font-semibold mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2  transition"
                value={data.details.age}
                onInput={(e) => setData("details", "age", e.target.value)}
              />
            </div>

            {/* Gender Selection */}
            <div class="bg-white p-4 rounded-lg shadow-md">
              <label class="block text-gray-700 font-semibold mb-2">
                Gender
              </label>
              <div class="flex space-x-4">
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    class="form-radio text-blue-500"
                    value={data.details.gender}
                    onChange={() =>
                      setData("details", {
                        ...data.details,
                        gender: Gender.Male,
                      })
                    }
                  />
                  <span class="ml-2 text-gray-700">Male</span>
                </label>
                <label class="inline-flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    class="form-radio text-blue-500"
                    value={data.details.gender}
                    onChange={() =>
                      setData("details", {
                        ...data.details,
                        gender: Gender.Female,
                      })
                    }
                  />
                  <span class="ml-2 text-gray-700">Female</span>
                </label>
              </div>
            </div>
          </div>

          {/* Family History Section */}
          <div class="bg-white p-4 rounded-lg shadow-md">
            <label class="block text-gray-700 font-semibold mb-2">
              Family Medical History
            </label>
            <textarea
              placeholder="Describe your family's medical history (e.g., genetic conditions, prevalent diseases)"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[120px] focus:ring-2  transition"
              onInput={(e) =>
                setData("details", "familyHistory", e.target.value)
              }
            />
          </div>

          {/* Medications Section */}
          <div class="bg-white p-4 rounded-lg shadow-md">
            <label class="block text-gray-700 font-semibold mb-2">
              Current Medications
            </label>
            <div class="grid md:grid-cols-3 gap-3 mb-4">
              <input
                type="text"
                placeholder="Medication Name"
                class="px-3 py-2 border border-gray-300 rounded focus:ring-2 "
                onInput={(e) =>
                  setMedicalData("details", "name", e.target.value)
                }
              />
              <input
                type="text"
                placeholder="Dosage"
                class="px-3 py-2 border border-gray-300 rounded focus:ring-2 "
                onInput={(e) =>
                  setMedicalData("details", {
                    ...meidcalData.details,
                    prescription: e.target.value,
                  })
                }
              />
              <input
                type="date"
                class="px-3 py-2 border border-gray-300 rounded focus:ring-2 "
                onInput={(e) =>
                  setMedicalData(
                    "details",
                    "reportedAt",
                    new Date(e.target.value),
                  )
                }
              />
            </div>
            <button
              type="button"
              class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              onClick={addFunction}
            >
              Add Medication
            </button>

            {/* Placeholder for added medications */}
            <For each={data.details.medication}>
              {(data, index) => (
                <div class="mt-4 space-y-2">
                  <div class="bg-green-50 p-2 rounded flex justify-between items-center">
                    <div>
                      <span class="font-semibold">{data.name}</span>
                      <span class="text-gray-500 ml-2">
                        {data.prescription}
                      </span>
                      <span class="text-gray-400 ml-2 text-sm">
                        Started: {data.reportedAt.toDateString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="text-red-500 hover:text-red-700"
                      onClick={() => deleteFunction(index())}
                    >
                      ✕
                    </button>
                  </div>
                  <div class="bg-green-50 p-2 rounded flex justify-between items-center">
                    <div>
                      <span class="font-semibold">Metformin</span>
                      <span class="text-gray-500 ml-2">500mg</span>
                      <span class="text-gray-400 ml-2 text-sm">
                        Started: 2022-06-20
                      </span>
                    </div>
                    <button
                      type="button"
                      class="text-red-500 hover:text-red-700"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </For>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
          >
            Save Medical History
          </button>
        </form>
      </div>
    </>
  );
}
