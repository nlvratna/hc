import { useNavigate } from "@solidjs/router";
import { createSignal, Show } from "solid-js";
import { HOME_URL } from "./Config";

// create context for the user
// add zod validation
export default function SignUp() {
  interface Props {
    name: string;
    email: string;
    password: string;
  }

  const [data, setData] = createSignal<Props>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = createSignal<boolean>(false);
  const [err, setErr] = createSignal<string>("");
  const navige = useNavigate();

  const register = async () => {
    try {
      const response = await fetch(`${HOME_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data()),
      });
      const details = await response.json();
      if (!response.ok) {
        setErr(details.payload || "error");
      }
      localStorage.setItem("token", details.accessToken);
      console.log(details);
      navige("/"); // should be medical record input
      // return user - context
    } catch (err: any) {
      setErr(err);
    } finally {
      setLoading(false);
    }
  };
  function hadleSubmission(e: SubmitEvent) {
    e.preventDefault();
    setLoading(true);
    register();
  }

  return (
    <>
      <div class="min-h-screen flex justify-center items-center">
        <div class="shadow-lg rounded-xl space-y-6 w-full max-w-md mb-7 p-8 ">
          <h2 class="text-3xl font-semibold text-center text-green-500/75">
            Register
          </h2>
          <Show when={err()}>
            <p class="bg-red-100 text-red-500 rounded-lg p-3 "> {err()}</p>
          </Show>
          <form class="space-y-4" onSubmit={hadleSubmission}>
            <div>
              <label for="name" class="block text-lg text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                class="block w-full border border-gray-300 rounded-lg p-3"
                placeholder="Enter your name"
                onInput={(e) => setData({ ...data(), name: e.target.value })}
              />
            </div>
            <div>
              <label for="email" class="block text-lg text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                class="block w-full border border-gray-300 rounded-lg p-3"
                placeholder="Enter your email"
                onInput={(e) => setData({ ...data(), email: e.target.value })}
              />
            </div>
            <div>
              <label for="password" class="block text-lg text-gray-700 mb-1">
                password
              </label>
              <input
                type="password"
                class="block w-full border border-gray-300 rounded-lg p-3"
                placeholder="Enter your password"
                onInput={(e) =>
                  setData({ ...data(), password: e.target.value })
                }
              />
              <p class="mt-1.5">*Passowrd must be atleast 8 characters </p>
            </div>

            <button
              type="submit"
              class={`w-full py-3 text-white rounded-lg font-medium transition-colors duration-200 ${
                loading()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600"
              }`}
              disabled={loading()}
            >
              {loading() ? "Registering.." : "Signup"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
