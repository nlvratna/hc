import { jwtDecode } from "jwt-decode";
import { HOME_URL } from "./Config";

//add jwt decode and fetch new jwt token logic
export const apiRequest = async (url: string, option = {}) => {
  try {
    await tokenExpire();
    const token = localStorage.getItem("token");
    console.log({ url: url, option });
    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      ...option,
    });
    const data = await response.json();

    if (!response.ok) {
      return { data: null, err: data.err };
    }
    return { data: data, err: null };
  } catch (err: any) {
    return { data: null, err: err };
  }
};

export const tokenExpire = async () => {
  try {
    console.log("code was here");
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("token is not available");
    }
    const decoded = jwtDecode(token);
    const exp = new Date(decoded.exp! * 1000);
    const now = new Date();
    //minor major issue
    const difference = Math.floor(
      (-now.getTime() + exp.getTime()) / (1000 * 60),
    );
    if (difference <= 3) {
      console.log("request to get new token is sent");
      const response = await fetch("http://localhost:4840/auth/access-token", {
        headers: {
          authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });
      if (response.status === 303) {
        alert("session expired please login again");
        window.location.href = "/login";
      }
      const data = await response.json();
      console.log(data);
      localStorage.setItem("token", data.accessToken);
    }
  } catch (err: any) {
    throw new Error("cannot create new token");
  }
};
