import {
  createContext,
  createSignal,
  ParentComponent,
  useContext,
} from "solid-js";

interface AuthContextType {
  userLog: () => boolean;
  user: any;
  login: (userData: any) => void;
  logout: () => void;
  token: any;
}

const AuthContext = createContext<AuthContextType>({
  userLog: () => false,
  user: "",
  login: () => {},
  logout: () => {},
  token: "",
});

const AuthProvider: ParentComponent = (props) => {
  // setToken is used to remove the token
  // reactivity is needed here
  const token = localStorage.getItem("token");
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

  return (
    <AuthContext.Provider value={{ token, userLog, user, login, logout }}>
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
