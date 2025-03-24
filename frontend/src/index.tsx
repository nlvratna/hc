/* @refresh reload */
import { render } from "solid-js/web";

import "./index.css";
import App from "./App";
import Header from "./components/Header";
import { Route, Router } from "@solidjs/router";
import { ParentComponent } from "solid-js";
import Login from "./Login";
import SignUp from "./SignUp";
import { AuthProvider } from "./AuthContext";
import NotFound from "./NotFound";

const root = document.getElementById("root");

if (import.meta.env.DEV && !(root instanceof HTMLElement)) {
  throw new Error(
    "Root element not found. Did you forget to add it to your index.html? Or maybe the id attribute got misspelled?",
  );
}
render(
  () => (
    // should only be <App />
    <App />
  ),
  root!,
);
