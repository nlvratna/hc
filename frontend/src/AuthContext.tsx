import {
  createContext,
  createSignal,
  onMount,
  ParentComponent,
  useContext,
} from "solid-js";
import { ensureValidToken } from "./utils";

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

export const AuthProvider: ParentComponent = (props) => {
  const [user, setUser] = createSignal(null);
  const [isLoggedIn, setIsLoggedIn] = createSignal(false);

  const login = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setIsLoggedIn(false);
  };

  // Check login status on mount
  onMount(async () => {
    const hasValidToken = await ensureValidToken();
    setIsLoggedIn(hasValidToken);
  });

  return (
    <AuthContext.Provider
      value={{
        userLog: () => isLoggedIn(),
        user: () => user(),
        login,
        logout,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}; //use createMutable

export const useAuth = () => {
  return useContext(AuthContext);
};
