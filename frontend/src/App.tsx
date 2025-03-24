import { createEffect, createSignal, type Component } from "solid-js";
import { useAuth } from "./AuthContext";
const App: Component = () => {
  const { user } = useAuth();
  return <h1 class=" text-3xl text-green-500">{user()} world!</h1>;
};

export default App;
