import { type Component } from "solid-js";
import Header from "./components/Header";
import { Route, Router } from "@solidjs/router";
import { ParentComponent } from "solid-js";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { AuthProvider } from "./AuthContext";
import NotFound from "./NotFound";
import LandingPage from "./pages/LandingPage";
import HealthRecord from "./pages/healthRecord/HealthRecord";
import Chat from "./pages/Chat";

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
    <AuthProvider>
      <Router root={Layout}>
        <Route path="/" component={LandingPage} />
        <Route path="/login" component={Login} />
        <Route path="/signup" component={SignUp} />
        <Route path="*404" component={NotFound} />
        <Route path="/health-record" component={HealthRecord} />
        <Route path="/chat" component={Chat} />
      </Router>
    </AuthProvider>
  );
};

export default App;
