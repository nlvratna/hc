import {
  createContext,
  createSignal,
  onMount,
  ParentComponent,
  useContext,
} from "solid-js";
import { tokenExpire } from "./utils";

interface AuthContextType {
  userLog: () => boolean;
  user: any;
  login: (userData: any) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  userLog: () => false,
  user: "",
  login: () => {},
  logout: () => {},
});

const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal(null);
  const [userLog, setUserLog] = createSignal(false);

  const login = (userData: any) => {
    setUser(userData);
    setUserLog(true);
    console.log(user());
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setUserLog(false);
  };
  const checkUserLog = async () => {
    // may be not useful
    // not useful
    try {
      await tokenExpire();
      setUserLog(true);
    } catch (err: any) {
      setUserLog(false);
    }
  };
  onMount(() => checkUserLog());
  return (
    <AuthContext.Provider value={{ userLog, user, login, logout }}>
      {props.children}
    </AuthContext.Provider>
  );
};

const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
