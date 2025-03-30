import { Index, Show } from "solid-js";
import { apiRequest } from "../../utils";
import DatePicker from "@rnwonder/solid-date-picker";
import "@rnwonder/solid-date-picker/dist/style.css";
import {
  addFunction,
  data,
  deleteFunction,
  meidcalData,
  setData,
  setMedicalData,
} from "./actions";
import { Gender } from "./types";

export default function SubmitHealthRecord() {
  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setData("submitted", true);
    try {
      // await new Promise((resolve) => setTimeout(resolve, 4000));
      const { err } = await apiRequest(
        `http://localhost:4840/health-record/add-health-record`,
        {
          method: "POST",
          body: JSON.stringify(data.details),
        },
      );
      if (err !== null) {
        console.error(err);
        setData("err", err);
      }
      setData("submitted", true);
    } catch (err: any) {
      console.error(err);
      setData("err", err);
    } finally {
      setData("submitted", false);
    }
  };

  //render HandleRecord when completed  submission create another signal
  return (
    <>
      <div class="flex flex-col justify-center items-center min-h-screen ">
        <div class="text-center mb-8">
          <h2 class="text-3xl font-bold text-blue-800 mb-2">Medical History</h2>
          <p class="text-gray-500">Please provide your medical information</p>
        </div>

        <form class="space-y-6" onSubmit={handleSubmit}>
          {/* Error form  */}
          <Show when={data.err}>
            <div class="bg-red-100 text-red-700 rounded-lg p-3">
              {typeof data.err === "object"
                ? "something went wrong please try again"
                : data.err}
            </div>
          </Show>
          {/* Personal Details Section */}
          <div class="grid md:grid-cols-2 gap-6">
            {/* Age Input */}
            <div class="bg-white p-4 rounded-lg shadow-md">
              <label class="block text-gray-700 font-semibold mb-2">
                Date of Birth
              </label>
              <div class="w-full border rounded border-gray-200 mb-2 ">
                <DatePicker
                  //@ts-ignore
                  onChange={(value) => setData("details", "age", value)}
                />
              </div>
            </div>

            {/* Gender Selection */}
            <div class="bg-white p-4 rounded-lg shadow-md">
              <div class="block text-gray-700 font-semibold mb-2"> Gender</div>
              <select
                class="border rounded p-2 flex-grow w-full"
                onChange={(e) =>
                  setData("details", "gender", e.target.value as Gender)
                }
                value={data.details.gender}
              >
                <option value={Gender.Male}>Male</option>
                <option value={Gender.Female}>Female</option>
                <option value={Gender.Other}>Other</option>
              </select>
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
            <Show when={meidcalData.err}>
              <div class="bg-red-100 text-red-700 rounded-lg p-3">
                {typeof meidcalData.err === "object"
                  ? "something went wrong please try again"
                  : data.err}
              </div>
            </Show>

            <Index each={data.details.medication}>
              {(data, index) => (
                <div class="mt-4 space-y-2">
                  <div class="bg-green-50 p-2 rounded flex justify-between items-center">
                    <div>
                      <span class="font-semibold">{data.name}</span>
                      <span class="text-gray-500 ml-2">
                        {data().prescription}
                      </span>
                      <span class="text-gray-400 ml-2 text-sm">
                        Started: {data().reportedAt.toDateString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      class="text-red-500 hover:text-red-700"
                      onClick={() => deleteFunction(index)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}
            </Index>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            class={` w-full  py-3 rounded-lg text-white
                    ${
                      !data.submitted
                        ? "bg-blue-500 hover:bg-blue-700 cursor-pointer transition duration-300 ease-in-out transform hover:-translate-y-1"
                        : "bg-gray-600 cursor-not-allowed"
                    }
                    `}
            disabled={data.submitted}
          >
            Save Medical History
          </button>
        </form>
      </div>
    </>
  );
}
