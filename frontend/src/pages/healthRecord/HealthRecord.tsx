//still some methods like add new medication for an exising one delete medication  that is existing update the update medication function
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
import {
  data,
  setData,
  medicationData,
  setMedicationData,
  addMedication,
  deleteMedication,
  updateMedication,
  submitHealthRecord,
  initializeData,
} from "./actions";
import { Gender } from "./types";
import { useLocation } from "@solidjs/router";

const getRecord = async () => {
  try {
    console.log("get record is called ...");
    const { data, err } = await apiRequest(`${HOME_URL}/health-record/record`);
    if (err !== null) {
      if (err == "No Health Record is found") {
        initializeData(null);
        return;
      } else {
        console.log("right before console log err");
        console.error(err);
        throw err;
      }
    }
    console.log(data);
    initializeData(data);
    return data;
  } catch (error) {
    console.error("Error fetching health record:", error);
    throw error;
  }
};

// SVG for edit icon
const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="h-5 w-5 cursor-pointer"
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

export default function HealthRecord() {
  const location = useLocation();
  const [recordResponse] = createResource(getRecord);
  const [editing, setEditing] = createSignal(false);
  const [addingMedication, setAddingMedication] = createSignal(false);
  const [saving, setSaving] = createSignal(false);
  const [editingMedication, setEditingMedication] = createSignal(false);
  const [skip, setSkip] = createSignal(false);

  //working and add skip button later
  if (location.state == "signup") {
    setEditing(true);
    setSkip(true);
  }
  const handleSave = async () => {
    setSaving(true);
    try {
      const success = await submitHealthRecord();
      //add here something
      if (success) {
        setEditing(false);
        setAddingMedication(false);
      }
    } catch (error) {
      console.error("Error saving health record:", error);
      setData("err", "Failed to save health record");
    } finally {
      setSaving(false);
    }
  };

  //only users with already exisitng data while eiditng can do that new users will have a option to skip and go the chatpage
  const handleCancel = () => {
    if (recordResponse()) {
      initializeData(recordResponse());
      setEditing(false);
      setAddingMedication(false);
      setEditingMedication(false);
    }
  };

  return (
    <>
      <ErrorBoundary fallback={<div>Something went wrong</div>}>
        <Suspense
          fallback={
            <div class="flex justify-center items-center h-64 w-full">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
          }
        >
          <Switch>
            <Match when={recordResponse.error && !data.isDataAvailable}>
              <div class="p-4 bg-red-100 text-red-700 rounded w-full">
                Something went wrong loading your health record
              </div>
            </Match>

            <Match when={recordResponse() || !data.isDataAvailable}>
              <div class="flex flex-col justify-evenly m-8">
                {/* Header */}
                <div class="bg-green-500 text-white p-4 flex justify-between items-center w-full">
                  <h2 class="text-xl font-bold text-center w-full">
                    {!data.isDataAvailable
                      ? "Create Health Record"
                      : "Health Record"}
                  </h2>
                  <Show
                    when={!editing() && data.isDataAvailable}
                    fallback={
                      <div class="flex gap-2">
                        <Show when={data.isDataAvailable}>
                          <button
                            class="cursor-pointer bg-white text-red-500 p-2 rounded hover:bg-red-100 transition duration-200"
                            onClick={handleCancel}
                          >
                            Cancel
                          </button>
                        </Show>
                        <button
                          class=" cursor-pointer bg-white text-green-500 p-2 rounded hover:bg-green-100 transition duration-200"
                          onClick={handleSave}
                          disabled={saving()}
                        >
                          {skip() ? "skip" : "save"}
                        </button>
                      </div>
                    }
                  >
                    <button
                      class="bg-white cursor-pointer text-green-500 p-2 rounded-full hover:bg-green-100 transition duration-200"
                      onClick={() => setEditing(true)}
                    >
                      <EditIcon />
                    </button>
                  </Show>
                </div>

                {/* Show error message if there's an error */}
                <Show when={data.err}>
                  <div class="p-4 bg-red-100 text-red-700 rounded w-full mt-4">
                    {data.err}
                  </div>
                </Show>

                {/* Content */}
                <div class="p-6">
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Age/DOB Section */}
                    <div class="bg-white p-6 border border-gray-200 rounded-lg">
                      <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">
                          Date of Birth
                        </h3>
                      </div>
                      <Show
                        when={editing()}
                        fallback={
                          <p class="text-gray-700 text-lg">
                            {data.details.age ? (
                              new Date(data.details.age).toDateString()
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
                              data.details.age
                                ? new Date(data.details.age)
                                    .toISOString()
                                    .split("T")[0]
                                : ""
                            }
                            onChange={(e) =>
                              setData(
                                "details",
                                "age",
                                e.target.value
                                  ? new Date(e.target.value)
                                  : null,
                              )
                            }
                          />
                        </div>
                      </Show>
                    </div>

                    {/* Gender Section */}
                    <div class="bg-white p-6 border border-gray-200 rounded-lg">
                      <div class="flex justify-between items-center mb-4">
                        <h3 class="text-lg font-semibold text-gray-800">
                          Gender
                        </h3>
                      </div>
                      <Show
                        when={editing()}
                        fallback={
                          <p class="text-gray-700 text-lg">
                            {data.details.gender || (
                              <span class="text-gray-400">
                                No gender recorded
                              </span>
                            )}
                          </p>
                        }
                      >
                        <div class="flex">
                          <select
                            class="border rounded p-2 flex-grow w-full"
                            onChange={(e) =>
                              setData(
                                "details",
                                "gender",
                                //@ts-ignore
                                //for now
                                e.target.value as Gender,
                              )
                            }
                            value={data.details.gender}
                          >
                            <option value={Gender.Male}>Male</option>
                            <option value={Gender.Female}>Female</option>
                            <option value={Gender.Other}>Other</option>
                          </select>
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
                      <Show when={editing()}>
                        <div class="flex gap-2">
                          <button
                            class="cursor-pointer flex items-center text-blue-500 border border-blue-500 px-3 py-1 rounded hover:bg-blue-50 transition"
                            onClick={() => setAddingMedication(true)}
                          >
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
                        </div>
                      </Show>
                    </div>

                    {/* this is an seperate api for eidting existing data */}
                    {/* Add Medication Form */}
                    <Show when={addingMedication()}>
                      <div class="border rounded-lg p-4 mb-6 bg-gray-50">
                        <h4 class="font-medium text-gray-800 mb-4">
                          Add New Medication
                        </h4>
                        <div class="mb-2">
                          <input
                            type="text"
                            value={medicationData.details.name}
                            class="border rounded p-2 w-full mb-2"
                            placeholder="Medication name"
                            onChange={(e) =>
                              setMedicationData(
                                "details",
                                "name",
                                e.target.value,
                              )
                            }
                          />
                          <textarea
                            class="border rounded p-2 w-full h-20 mb-2"
                            placeholder="Prescription details"
                            value={medicationData.details.prescription}
                            onChange={(e) =>
                              setMedicationData(
                                "details",
                                "prescription",
                                e.target.value,
                              )
                            }
                          />
                          <input
                            type="date"
                            value={
                              new Date(medicationData.details.reportedAt)
                                .toISOString()
                                .split("T")[0]
                            }
                            class="border rounded p-2 w-full"
                            onChange={(e) =>
                              setMedicationData(
                                "details",
                                "reportedAt",
                                new Date(e.target.value),
                              )
                            }
                          />
                        </div>
                        <Show when={medicationData.err}>
                          <p class="text-red-500 mb-2">{medicationData.err}</p>
                        </Show>
                        <div class="flex justify-end gap-2">
                          <button
                            class=" cursor-pointer px-3 py-1 text-gray-500 border border-gray-500 rounded hover:bg-gray-50"
                            onClick={() => {
                              setAddingMedication(false);
                              setMedicationData("details", {
                                name: "",
                                prescription: "",
                                reportedAt: new Date(),
                              });
                              setMedicationData("err", "");
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            class="px-3 py-1 text-white bg-green-500 rounded hover:bg-green-600"
                            onClick={() => {
                              if (addMedication()) {
                                setAddingMedication(false);
                              }
                            }}
                          >
                            Add Medication
                          </button>
                        </div>
                      </div>
                    </Show>
                    <Show
                      when={data.details.medication.length > 0}
                      fallback={
                        <div class="text-gray-400 text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
                          <p>No medications recorded</p>
                          <Show when={editing()}>
                            <button
                              class="cursor-pointer mt-3 flex items-center text-blue-500 mx-auto hover:text-blue-700"
                              onClick={() => setAddingMedication(true)}
                            >
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
                          </Show>
                        </div>
                      }
                    >
                      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Show when={data.details.medication.length > 0}>
                          <For each={data.details.medication}>
                            {(medication, index) => (
                              <div class="border rounded-lg p-4 flex flex-col">
                                <div class="flex justify-between items-start">
                                  <div class="font-medium text-gray-800 text-lg">
                                    {medication.name}
                                  </div>
                                  <Show when={editing()}>
                                    <button
                                      class="text-blue-500"
                                      onClick={() => setEditingMedication(true)}
                                    >
                                      <EditIcon />
                                    </button>
                                  </Show>
                                </div>
                                <div class="text-md mt-2 text-gray-600">
                                  {medication.prescription}
                                </div>
                                <div class="text-sm mt-auto pt-3 text-gray-500">
                                  Reported:
                                  {new Date(
                                    medication.reportedAt,
                                  ).toDateString()}
                                </div>
                                <Show when={editing() && editingMedication()}>
                                  <div class="mt-3 pt-3 border-t border-gray-200">
                                    <div class="mb-2">
                                      <input
                                        type="text"
                                        value={medication.name}
                                        class="border rounded p-2 w-full mb-2"
                                        placeholder="Medication name"
                                        onChange={(e) => {
                                          const updated = {
                                            ...medication,
                                            name: e.target.value,
                                          };
                                          updateMedication(
                                            index(),
                                            medication.id,
                                            updated,
                                          );
                                        }}
                                      />
                                      <textarea
                                        class="border rounded p-2 w-full h-20 mb-2"
                                        placeholder="Prescription details"
                                        value={medication.prescription}
                                        onChange={(e) => {
                                          const updated = {
                                            ...medication,
                                            prescription: e.target.value,
                                          };
                                          updateMedication(
                                            index(),
                                            medication.id,
                                            updated,
                                          );
                                        }}
                                      ></textarea>
                                      <input
                                        type="date"
                                        value={
                                          new Date(medication.reportedAt)
                                            .toISOString()
                                            .split("T")[0]
                                        }
                                        class="border rounded p-2 w-full"
                                        onChange={(e) => {
                                          const updated = {
                                            ...medication,
                                            reportedAt: new Date(
                                              e.target.value,
                                            ),
                                          };
                                          updateMedication(
                                            index(),
                                            medication.id,
                                            updated,
                                          );
                                        }}
                                      />
                                    </div>
                                    <div class="flex justify-end gap-2">
                                      <button
                                        class="px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-50"
                                        onClick={() =>
                                          deleteMedication(index())
                                        }
                                      >
                                        Delete
                                      </button>
                                      <button
                                        class="px-3 py-1 text-gray-500 border border-gray-500 rounded hover:bg-gray-50"
                                        onClick={() =>
                                          setEditingMedication(false)
                                        }
                                      >
                                        Done
                                      </button>
                                    </div>
                                  </div>
                                </Show>
                              </div>
                            )}
                          </For>
                        </Show>
                      </div>
                    </Show>
                  </div>
                </div>

                {/* New User Call-to-Action  skip button should be here*/}
                <Show when={!data.isDataAvailable}>
                  <div class="p-4 bg-blue-50 text-blue-700 rounded w-full mt-4 mb-6 text-center">
                    <p class="mb-2">
                      Please complete your health record to continue.
                    </p>
                    <button
                      class="inline-block px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
                      onClick={handleSave}
                      disabled={saving()}
                    >
                      {saving() ? "Creating Record..." : "Create Health Record"}
                    </button>
                  </div>
                </Show>
              </div>
            </Match>
          </Switch>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}
