import { Show } from "solid-js";
import { useAuth } from "../AuthContext";
import SubmitHealthRecord from "./healthRecord/SubmitHealthRecord";

export default function LandingPage() {
  const { userLog, user } = useAuth();
  return (
    <>
      <Show when={userLog()} fallback={<div> not working </div>}>
        {user()}
        <SubmitHealthRecord />
      </Show>
      <div class="text-green-500 text-3xl text-center"> LandingPage </div>
    </>
  );
}
