import { createSignal, Show } from "solid-js";
import { A, useNavigate } from "@solidjs/router";

// create context for user
export default function Login() {
  interface Props {
    email: string;
    password: string;
  }

  const [details, setDetails] = createSignal<Props>({
    email: "",
    password: "",
  });
  const [submitting, setSubmitting] = createSignal<boolean>(false);
  const [err, setErr] = createSignal("");
  const navigate = useNavigate();
  async function handleLogin() {
    try {
      const response = await fetch("http://localhost:4840/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(details()),
      });
      const data = await response.json();

      if (!response.ok) {
        console.log(data.payload);
        setErr(data.payload);
        return;
      }
      console.log(data);

      localStorage.setItem("token", data.accessToken);
      navigate("/");
    } catch (err: any) {
      setErr(err.message || "An error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    setSubmitting(true);
    handleLogin();
  };

  return (
    <div class="min-h-screen flex items-center justify-center ">
      <div class="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-xl mb-7">
        <h2 class="text-3xl font-semibold text-center text-green-500">Login</h2>
        <Show when={err()}>
          <p class="text-red-500 bg-red-100 p-3 rounded-lg">{err()}</p>
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
              value={details().email}
              onInput={(e) =>
                setDetails({ ...details(), email: e.target.value })
              }
            />
          </div>

          <div>
            <label class="block text-gray-700 text-lg mb-1" for="password">
              Password
            </label>
            <input
              class="w-full p-3 border border-gray-300 rounded-lg focus:outline-none "
              type="password"
              id="password"
              value={details().password}
              onInput={(e) =>
                setDetails({ ...details(), password: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            class={`w-full py-3 text-white rounded-lg font-medium transition-colors duration-200 ${
              submitting()
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600"
            }`}
            disabled={submitting()}
          >
            {submitting() ? "Loading..." : "Login"}
          </button>
        </form>
        <p class="text-center">
          No account?
          <A href="/">
            <span class="text-green-500  pl-1 hover:cursor-pointer hover:underline hover:text-green-600 ">
              signup
            </span>
          </A>
        </p>
      </div>
    </div>
  );
}
