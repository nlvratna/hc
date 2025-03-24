import { A, useLocation } from "@solidjs/router";
import { Match, Show, Switch } from "solid-js";
import { useAuth } from "../AuthContext";

export default function Header() {
  // still usable
  const location = useLocation();
  const { userLog } = useAuth();
  return (
    <>
      <header class="w-full flex justify-between items-center py-4">
        <A href="/">
          <h1 class="text-3xl font-semibold">
            <span class="text-green-500">Health</span>Connect
          </h1>
        </A>
        <nav class="flex gap-3">
          <Show when={!userLog()} fallback=<div> profile </div>>
            <div class="relative">
              <A
                href="/login"
                class="text-xl mr-0.5 font-medium border-b-0 hover:border-b-2 border-green-500 transition-all delay-100 ease-in-out hover:text-green-500/85 pb-0.5"
              >
                Login
              </A>
            </div>
            <div class="realtive">
              <A
                href="/signup"
                class="text-xl font-medium border-b-0 hover:border-b-2 border-green-500 transition-all delay-100 ease-in-out hover:text-green-500/85 pb-0.5 "
              >
                SignUp
              </A>
            </div>
          </Show>
        </nav>
      </header>
    </>
  );
}
