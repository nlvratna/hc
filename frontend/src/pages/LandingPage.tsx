import { Show } from "solid-js";
import HealthRecord from "./HealthRecord";
import { useAuth } from "../AuthContext";

export default function LandingPage() {
  const { userLog } = useAuth();
  return (
    <>
      <Show when={userLog()} fallback={<div> not working </div>}>
        <HealthRecord />
      </Show>
      <div class="text-green-500 text-3xl text-center"> LandingPage </div>
    </>
  );
}
