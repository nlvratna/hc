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
              class="text-xl font-medium  hover:underline decoration-green-500"
            >
              Login
            </A>
          </Show>
        </nav>
      </header>
    </>
  );
}
