import { createResource, Match, Show, Switch } from "solid-js";
import { apiRequest } from "../../utils";
import { HOME_URL } from "../../Config";

const getRecord = async () => {
  const { data, err } = await apiRequest(`${HOME_URL}/health-record/record`);
  if (data === null) {
    return err;
  }
  console.log(data);
  return data;
};
export default function HealthRecord() {
  const [record] = createResource(getRecord);
  return (
    <>
      <Switch>
        <Match when={record.error}>
          <div> Loading </div>
        </Match>
        <Match when={record().err}>
          <p>
            {typeof record().err === "object"
              ? "something went wrong"
              : record().err}{" "}
          </p>
        </Match>
        <Match when={record()}>
          <div>{JSON.stringify(record().data)}</div>
        </Match>
      </Switch>
    </>
  );
}

// fix the createResource or remove it
