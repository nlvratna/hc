import { Show } from "solid-js";
import { useAuth } from "../AuthContext";
import HealthRecord from "./healthRecord/HealthRecord";

export default function LandingPage() {
  const { userLog, user } = useAuth();
  return (
    <>
      <div class="text-green-500 text-3xl text-center"> LandingPage </div>
    </>
  );
}
