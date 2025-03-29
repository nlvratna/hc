import {
  createEffect,
  onCleanup,
  Show,
  Suspense,
  type Component,
} from "solid-js";
import Header from "./components/Header";
import { Route, Router } from "@solidjs/router";
import { ParentComponent } from "solid-js";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./AuthContext";
import NotFound from "./NotFound";
import LandingPage from "./pages/LandingPage";
import HealthRecord from "./pages/healthRecord/HealthRecord";

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
const App: Component = () => {
  return (
    <Suspense
      fallback={
        <div class="flex justify-center items-center h-64 w-full">
          <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      }
    >
      <AuthProvider>
        <Router root={Layout}>
          <Route path="/" component={LandingPage} />
          <Route path="/login" component={Login} />
          <Route path="/signup" component={SignUp} />
          <Route path="*404" component={NotFound} />
          <Route path="/health-record" component={HealthRecord} />
        </Router>
      </AuthProvider>
    </Suspense>
  );
};

export default App;
