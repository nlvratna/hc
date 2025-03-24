import { createEffect, onCleanup, type Component } from "solid-js";
import Header from "./components/Header";
import { Route, Router } from "@solidjs/router";
import { ParentComponent } from "solid-js";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthProvider, useAuth } from "./AuthContext";
import NotFound from "./NotFound";

const Layout: ParentComponent = (props) => {
  return (
    <>
      <div class=" relative flex flex-col max-w-[1400] sm:px-4 lg:px-6">
        <Header />
        <main>{props.children}</main>
      </div>
    </>
  );
};
const Test = () => {
  onCleanup(() => {
    localStorage.clear;
  });
  const { token } = useAuth();
  return (
    <>
      <div>{JSON.stringify(token)} </div>
    </>
  );
};
const App: Component = () => {
  return (
    <AuthProvider>
      <Router root={Layout}>
        <Route path="/" component={Test} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="*404" component={NotFound} />
      </Router>
    </AuthProvider>
  );
};

export default App;
