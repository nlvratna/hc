import { Show } from "solid-js";
import { useAuth } from "../AuthContext";
import HealthRecord from "./healthRecord/HealthRecord";

export default function LandingPage() {
  const { userLog, user } = useAuth();
  return (
    <>
      <Show when={userLog()} fallback={<div> not working </div>}>
        <HealthRecord />
      </Show>
      <div class="text-green-500 text-3xl text-center"> LandingPage </div>
    </>
  );
}
