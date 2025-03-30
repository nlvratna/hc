import { createSignal, Show, Suspense } from "solid-js";
import { HOME_URL } from "../Config";
import { Card } from "../components/Card";
import { Input } from "../components/Input";
import { useAuth } from "../AuthContext";
import HealthRecord from "./healthRecord/HealthRecord";

// add zod validation
export default function SignUp() {
  interface Props {
    userName: string;
    email: string;
    password: string;
  }
  const { login } = useAuth();
  const [data, setData] = createSignal<Props>({
    userName: "",
    email: "",
    password: "",
  });
  const [clicked, setClick] = createSignal<boolean>(false);
  const [loading, setLoading] = createSignal<boolean>(false);
  const [err, setErr] = createSignal<string>("");
  const [signUpComplete, setSignUp] = createSignal(false);

  const register = async () => {
    try {
      const response = await fetch(`${HOME_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data()),
      });
      const details = await response.json();
      if (!response.ok) {
        setErr(details.err || "error");
      }
      localStorage.setItem("token", details.accessToken);
      login(details.user);
      setSignUp(true);
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

  const signup = (
    <Card>
      <h2 class="text-3xl font-semibold text-center text-green-500/75">
        Register
      </h2>
      <Show when={err()}>
        <p class="bg-red-100 text-red-500 rounded-lg p-3 "> {err()}</p>
      </Show>
      <form class="space-y-4" onSubmit={hadleSubmission}>
        <Input
          type="name"
          label="Name"
          value={data().userName}
          onInput={(e) => setData({ ...data(), userName: e.target.value })}
        />
        <Input
          type="email"
          label="Email"
          placeholder="example@gmail.com"
          value={data().email}
          onInput={(e) => setData({ ...data(), email: e.target.value })}
        />
        <div>
          <Input
            type={clicked() ? "text" : "password"}
            label="password"
            value={data().password}
            onInput={(e) => setData({ ...data(), password: e.target.value })}
          />
          <input
            type="checkbox"
            class="mr-1"
            onClick={() => setClick((click) => !click)}
          />
          Show password
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
          {loading() ? "Loading..." : "Login"}
        </button>
      </form>
    </Card>
  );

  return (
    <>
      <div class="min-h-screen flex justify-center items-center">
        <Show when={signUpComplete()} fallback={signup}>
          <Suspense fallback={<div>loading...</div>}>
            <HealthRecord />
          </Suspense>
        </Show>
      </div>
    </>
  );
}
