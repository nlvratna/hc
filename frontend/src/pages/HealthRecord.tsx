import { createStore } from "solid-js/store";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { createSignal } from "solid-js";

// I like this being part of signup page

enum Gender {
  Male = "male",
  Female = "female",
}

export default function HealthRecord() {
  interface healthRecord {
    age: Date;
    gender: Gender;
    familyHistory: string[];
    medication: medication[];
  }

  interface medication {
    name: string;
    prescription: string;
    reportedAt: Date;
  }
  const [data, setData] = createStore({
    details: { age: "", gender: Gender, familyHistory: [], medication: {} },
    submitted: false,
  });
  const [meidcalData, setMedicalData] = createStore({
    details: { name: "", prescription: "", reportedAt: "" },
    add: false,
    delete: false,
  });

  return (
    <>
      <div class="flex justify-center items-center min-h-screen ">
        <Card class="w-full max-w-2xl shadow-2xl">
          <div class="text-center mb-8">
            <h2 class="text-3xl font-bold text-blue-800 mb-2">
              Medical History
            </h2>
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
                  class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-200 transition"
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
                    />
                    <span class="ml-2 text-gray-700">Male</span>
                  </label>
                  <label class="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      class="form-radio text-blue-500"
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
                class="w-full px-3 py-2 border border-gray-300 rounded-lg min-h-[120px] focus:ring-2 focus:ring-blue-200 transition"
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
                  class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="text"
                  placeholder="Dosage"
                  class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200"
                />
                <input
                  type="date"
                  class="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-200"
                />
              </div>
              <button
                type="button"
                class="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Add Medication
              </button>

              {/* Placeholder for added medications */}
              <div class="mt-4 space-y-2">
                <div class="bg-green-50 p-2 rounded flex justify-between items-center">
                  <div>
                    <span class="font-semibold">Aspirin</span>
                    <span class="text-gray-500 ml-2">100mg</span>
                    <span class="text-gray-400 ml-2 text-sm">
                      Started: 2023-01-15
                    </span>
                  </div>
                  <button type="button" class="text-red-500 hover:text-red-700">
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
                  <button type="button" class="text-red-500 hover:text-red-700">
                    ✕
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              class="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg"
            >
              Save Medical History
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
