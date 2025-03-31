import { jwtDecode } from "jwt-decode";
import { HOME_URL } from "./Config";

export const apiRequest = async (url: string, option = {}) => {
  try {
    // Check and refresh token if needed
    const tokenValid = await ensureValidToken();
    if (!tokenValid) {
      return { data: null, err: "Authentication required" };
    }

    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      headers: {
        authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      ...option,
    });

    const responseData = await response.json();
    if (!response.ok) {
      return { data: null, err: responseData.err || response.statusText };
    }

    return { data: responseData, err: null };
  } catch (err: any) {
    return { data: null, err: err.message || "Request failed" };
  }
};

// Improved token management
export const ensureValidToken = async (): Promise<boolean> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      return false; // No token available, authentication required
    }

    // Parse token
    const decoded: any = jwtDecode(token);
    if (!decoded || typeof decoded.exp !== "number") {
      localStorage.removeItem("token"); // Invalid token format
      return false;
    }

    // Check expiration
    const expTime = decoded.exp * 1000; // Convert to milliseconds
    const currentTime = Date.now();
    const minutesRemaining = Math.floor((expTime - currentTime) / (1000 * 60));

    // Refresh if less than 3 minutes remaining
    if (minutesRemaining <= 3) {
      return await refreshToken(token);
    }

    return true; // Token is valid and not expiring soon
  } catch (err: any) {
    console.error("Token validation error:", err);
    localStorage.removeItem("token");
    return false;
  }
};

// Separated token refresh logic
async function refreshToken(currentToken: string): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:4840/auth/access-token", {
      headers: {
        authorization: `Bearer ${currentToken}`,
      },
      credentials: "include",
    });

    if (response.status === 303) {
      // Session expired
      localStorage.removeItem("token");
      alert("Session expired, please login again");
      window.location.href = "/login";
      return false;
    }

    if (!response.ok) {
      throw new Error(`Token refresh failed: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.accessToken) {
      throw new Error("No token received from server");
    }

    localStorage.setItem("token", data.accessToken);
    return true;
  } catch (err) {
    console.error("Token refresh failed:", err);
    localStorage.removeItem("token");
    return false;
  }
}
//add jwt decode and fetch new jwt token logic
