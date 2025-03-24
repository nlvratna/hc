import { jwtDecode } from "jwt-decode";
import { useAuth } from "./AuthContext";
const { token } = useAuth();

//add jwt decode and fetch new jwt token logic
export const apiRequest = async (url: string, option = {}) => {
  console.log(token);
  if (!token) {
    throw new Error("token is not available");
  }
  const decoded = jwtDecode(token());
  // test this
  const expTime = new Date(decoded.exp! * 100);
  console.log(expTime.toLocaleString());
};
