import { A, useLocation } from "@solidjs/router";
import { Show } from "solid-js";

export default function Header() {
  const location = useLocation();
  return (
    <>
      <header class="w-full flex justify-between items-center py-4">
        <A href="/">
          <h1 class="text-3xl font-semibold">
            <span class="text-green-500">Health</span>Connect
          </h1>
        </A>
        <nav>
          <Show when={location.pathname === "/"} fallback={<div>Profile</div>}>
            <A
              href="/login"
              class="text-xl font-medium border-b-0 hover:border-b-2 border-green-500 transition-all delay-100 ease-in-out hover:text-green-500/85 pb-0.5"
            >
              Login
            </A>
          </Show>
        </nav>
      </header>
    </>
  );
}
