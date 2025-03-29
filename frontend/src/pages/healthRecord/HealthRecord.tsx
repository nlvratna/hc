import {
  createResource,
  createSignal,
  ErrorBoundary,
  For,
  Match,
  Show,
  Suspense,
  Switch,
} from "solid-js";
import { apiRequest } from "../../utils";
import { HOME_URL } from "../../Config";
import { healthRecord } from "./types";

const getRecord = async () => {
  const { data, err } = await apiRequest(`${HOME_URL}/health-record/record`);
  if (err !== null) {
    console.error(err);
    throw err;
  }
  return data;
};

export default function HealthRecord() {
  const [recordResponse] = createResource(getRecord);
  const [editingField, setEditingField] = createSignal(null);

  const toggleEdit = (field: any) => {
    if (editingField() === field) {
      setEditingField(null);
    } else {
      setEditingField(field);
    }
  };

  // SVG for edit icon
  const EditIcon = () => (
    //todo get that assest
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
      />
    </svg>
  );

  return (
    <>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Switch
          fallback={
            <div class="text-center p-4 w-full">No health record found</div>
          }
        >
          <Match when={recordResponse.error}>
            <div class="p-4 bg-red-100 text-red-700 rounded w-full">
              Something went wrong loading your health record
            </div>
          </Match>
          <Match when={recordResponse()}>
            <div class="flex flex-col justify-center  mt-8 ">
              {/* Header */}
              <div class="bg-green-500 text-white p-4 flex justify-between items-center w-full">
                <h2 class="text-xl font-bold text-center w-full">
                  Health Record
                </h2>
                <button class="bg-white text-green-500 p-2 rounded-full hover:bg-green-100 transition duration-200">
                  <EditIcon />
                </button>
              </div>

              {/* Content */}
              <div class="p-6">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {/* Age/DOB Section */}
                  <div class="bg-white p-6 border border-gray-200 rounded-lg">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-lg font-semibold text-gray-800">
                        Date of Birth
                      </h3>
                      <button
                        class="text-blue-500 p-1 rounded hover:bg-blue-100 transition duration-200"
                        onClick={() => toggleEdit("age")}
                      >
                        <EditIcon />
                      </button>
                    </div>
                    <Show
                      when={editingField() === "age"}
                      fallback={
                        <p class="text-gray-700 text-lg">
                          {recordResponse()?.healthRecord?.age ? (
                            new Date(
                              recordResponse().healthRecord.age,
                            ).toDateString()
                          ) : (
                            <span class="text-gray-400">
                              No date of birth recorded
                            </span>
                          )}
                        </p>
                      }
                    >
                      <div class="flex">
                        <input
                          type="date"
                          class="border rounded p-2 flex-grow"
                          value={
                            recordResponse()?.healthRecord?.age
                              ? new Date(recordResponse().healthRecord.age)
                                  .toISOString()
                                  .split("T")[0]
                              : ""
                          }
                        />
                        <button class="ml-2 bg-green-500 text-white px-4 py-2 rounded">
                          Save
                        </button>
                      </div>
                    </Show>
                  </div>

                  {/* Gender Section */}
                  <div class="bg-white p-6 border border-gray-200 rounded-lg">
                    <div class="flex justify-between items-center mb-4">
                      <h3 class="text-lg font-semibold text-gray-800">
                        Gender
                      </h3>
                      <button
                        class="text-blue-500 p-1 rounded hover:bg-blue-100 transition duration-200"
                        onClick={() => toggleEdit("gender")}
                      >
                        <EditIcon />
                      </button>
                    </div>
                    <Show
                      when={editingField() === "gender"}
                      fallback={
                        <p class="text-gray-700 text-lg">
                          {recordResponse()?.healthRecord?.gender || (
                            <span class="text-gray-400">
                              No gender recorded
                            </span>
                          )}
                        </p>
                      }
                    >
                      <div class="flex">
                        <select class="border rounded p-2 flex-grow">
                          <option value="">Select gender</option>
                          <option
                            value="male"
                            selected={
                              recordResponse()?.healthRecord?.gender === "male"
                            }
                          >
                            Male
                          </option>
                          <option
                            value="female"
                            selected={
                              recordResponse()?.healthRecord?.gender ===
                              "female"
                            }
                          >
                            Female
                          </option>
                          <option
                            value="other"
                            selected={
                              recordResponse()?.healthRecord?.gender === "other"
                            }
                          >
                            Other
                          </option>
                        </select>
                        <button class="ml-2 bg-green-500 text-white px-4 py-2 rounded">
                          Save
                        </button>
                      </div>
                    </Show>
                  </div>
                </div>

                {/* Medications Section - Full Width */}
                <div class="bg-white p-6 border border-gray-200 rounded-lg w-full">
                  <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-800">
                      Medications
                    </h3>
                    <div class="flex gap-2">
                      <button class="flex items-center text-blue-500 border border-blue-500 px-3 py-1 rounded hover:bg-blue-50 transition">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          class="h-5 w-5 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                        Add
                      </button>
                      <button
                        class="text-blue-500 p-1 rounded hover:bg-blue-100 transition duration-200"
                        onClick={() => toggleEdit("medications")}
                      >
                        <EditIcon />
                      </button>
                    </div>
                  </div>

                  <Show
                    when={
                      recordResponse()?.healthRecord?.medication?.length > 0
                    }
                    fallback={
                      <div class="text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                        <p>No medications recorded</p>
                        <button class="mt-3 flex items-center text-blue-500 mx-auto hover:text-blue-700">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-5 w-5 mr-1"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M12 4v16m8-8H4"
                            />
                          </svg>
                          Add medication
                        </button>
                      </div>
                    }
                  >
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <For each={recordResponse().healthRecord.medication}>
                        {(medication, index) => (
                          <div class="border rounded-lg p-4 flex flex-col">
                            <div class="flex justify-between items-start">
                              <div class="font-medium text-gray-800 text-lg">
                                {medication.name}
                              </div>
                              <button
                                class="text-blue-500 p-1 rounded hover:bg-blue-100 transition duration-200"
                                onClick={() =>
                                  toggleEdit(`medication-${index()}`)
                                }
                              >
                                <EditIcon />
                              </button>
                            </div>
                            <div class="text-md mt-2 text-gray-600">
                              {medication.prescription}
                            </div>
                            <div class="text-sm mt-auto pt-3 text-gray-500">
                              Reported:{" "}
                              {new Date(medication.reportedAt).toDateString()}
                            </div>
                            <Show
                              when={editingField() === `medication-${index()}`}
                            >
                              <div class="mt-3 pt-3 border-t border-gray-200">
                                <div class="mb-2">
                                  <input
                                    type="text"
                                    value={medication.name}
                                    class="border rounded p-2 w-full mb-2"
                                    placeholder="Medication name"
                                  />
                                  <textarea
                                    class="border rounded p-2 w-full h-20 mb-2"
                                    placeholder="Prescription details"
                                  >
                                    {medication.prescription}
                                  </textarea>
                                  <input
                                    type="date"
                                    value={
                                      new Date(medication.reportedAt)
                                        .toISOString()
                                        .split("T")[0]
                                    }
                                    class="border rounded p-2 w-full"
                                  />
                                </div>
                                <div class="flex justify-end gap-2">
                                  <button class="px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-50">
                                    Delete
                                  </button>
                                  <button class="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600">
                                    Save
                                  </button>
                                </div>
                              </div>
                            </Show>
                          </div>
                        )}
                      </For>
                    </div>
                  </Show>
                </div>
              </div>
            </div>
          </Match>
        </Switch>
      </ErrorBoundary>
    </>
  );
}

//TODO remove familyHistory maybe yep sure
