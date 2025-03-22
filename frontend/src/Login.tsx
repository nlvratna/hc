import { createResource, createSignal, Show } from "solid-js";
import { HOME_URL } from "./Config";
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

  async function handleLogin() {
    try {
      const response = await fetch(`${HOME_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(details()),
      });
      const json = await response.json();
      console.log(json);
      return await json;
    } catch (err) {
      console.error(err);
    }
  }
  const [loginResult] = createResource(submitting, handleLogin);
  const handleSubmit = (e: SubmitEvent) => {
    e.preventDefault();
    setSubmitting(true);
  };
  return (
    <>
      <div class="w-full min-h-screen flex justify-center items-center">
        <form
          class="shadow-md w-full rounded-lg p-8 max-w-md"
          onSubmit={handleSubmit}
        >
          <h2 class="text-2xl font-semibold mb-5"> Login </h2>
          <div class="mb-5">
            <label class="block text-gray-700 mb-2 text-lg"> Email </label>
            <input
              class="border rounded-md w-full px-3 py-1"
              type="email"
              placeholder="example@gmail.com"
              value={details().email}
              onInput={(e) =>
                setDetails({ ...details(), email: e.target.value })
              }
            />
          </div>
          <div class="mb-5">
            <label class="block text-gray-700 mb-2 text-lg">Password</label>
            <input
              class="border rounded-md w-full px-3 py-1"
              type="password"
              value={details().password}
              onInput={(e) =>
                setDetails({ ...details(), password: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            class="bg-green-500  w-full border rounded-sm md-2 py-[0.25rem] text-white cursor-pointer"
            disabled={loginResult.loading}
          >
            Login
          </button>
          <Show when={loginResult()}>
            <div> Login sucessful </div>
          </Show>
        </form>
      </div>
    </>
  );
}
