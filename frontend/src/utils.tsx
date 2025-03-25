import { jwtDecode } from "jwt-decode";
import { HOME_URL } from "./Config";

//add jwt decode and fetch new jwt token logic
export const apiRequest = async (url: string, option = {}) => {
  const token = localStorage.getItem("token");
  console.log(token);
  if (!token) {
    throw new Error("token is not available");
  }
  const decoded = jwtDecode(token);
  const exp = new Date(decoded.exp! * 1000);
  const now = new Date();
  const difference = -now.getTime() + exp.getTime();
  if (difference < 3) {
    const response = await fetch(`${HOME_URL}/auth/access-token`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    localStorage.setItem("token", data.accessToken);
  }
  const response = await fetch(url, {
    headers: { authorization: `Bearer ${token}` },
    ...option,
  });
  const data = await response.json();

  if (!response.ok) {
    return { data: null, err: data.err };
  }
  const jsonData = await data.json();
  return { data: jsonData, err: null };
};
