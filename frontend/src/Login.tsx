//AI sucks
// add authContext file
import { createSignal, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { createStore } from "solid-js/store";

// create context for user
export default function Login() {
  const [clicked, setClick] = createSignal<boolean>(false);
  const [state, setState] = createStore({
    details: { email: "", password: "" },
    err: "",
    submitting: false,
  });
  const navigate = useNavigate();

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    setState("submitting", true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const response = await fetch("http://localhost:4840/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.details),
      });
      const data = await response.json();

      if (!response.ok) {
        console.log(data.payload);
        setState("err", data.payload);
        return;
      }
      console.log(data);
      console.log(data.user);

      localStorage.setItem("token", data.accessToken);
      navigate("/");
    } catch (err: any) {
      setState("err", err || "login failed");
    } finally {
      setState("submitting", false);
    }
  };

  return (
    <div class="min-h-screen flex items-center justify-center ">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl mb-7">
        <h2 class="text-3xl font-semibold text-center text-green-500">Login</h2>
        <Show when={state.err}>
          <p class="text-red-500 bg-red-100 p-3 rounded-lg">{state.err}</p>
        </Show>
        <form class="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label class="block text-gray-700 text-lg mb-1" for="email">
              Email
            </label>
            <input
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 "
              type="email"
              id="email"
              placeholder="example@gmail.com"
              value={state.details.email}
              onInput={(e) =>
                setState("details", { ...state.details, email: e.target.value })
              }
            />
          </div>

          <div>
            <label class="block text-gray-700 text-lg mb-1" for="password">
              Password
            </label>
            <input
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none "
              type={clicked() ? "text" : "password"}
              id="password"
              value={state.details.password}
              onInput={(e) =>
                setState("details", {
                  ...state.details,
                  password: e.target.value,
                })
              }
            />
            <div>
              <input
                type="checkbox"
                class="mr-1"
                onClick={() => setClick((click) => !click)}
              />
              Show password
            </div>
          </div>

          <button
            type="submit"
            class={`w-full py-3 text-white rounded-lg font-medium transition-colors duration-200 ${
              state.submitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={state.submitting}
          >
            {state.submitting ? "Loading..." : "Login"}
          </button>
        </form>
        <p class="text-center">
          No account?
          <A href="/signup">
            <span class="text-green-500  pl-1 hover:cursor-pointer hover:underline hover:text-green-600 ">
              signup
            </span>
          </A>
        </p>
      </div>
    </div>
  );
}
