import { useGoogleLogin } from "@react-oauth/google"

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/**
 * Registers a new user with Email & Password via backend POST /auth/register.
 */
export const registerWithBackend = async ({ email, password, name }) => {
    const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Registration failed" }));
        throw new Error(errorData.detail || "Registration failed");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
};

/**
 * Logs in an existing user with Email & Password via backend POST /auth/login.
 */
export const loginWithBackend = async ({ email, password }) => {
    const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: "Login failed" }));
        throw new Error(errorData.detail || "Invalid email or password");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
};

/**
 * Exchanges Google Access Token with backend for JWT access_token, refresh_token & user profile.
 */
export const authenticateWithBackend = async (googleAccessToken) => {
    const response = await fetch(`${BACKEND_URL}/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ google_access_token: googleAccessToken }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Authentication failed: ${errorText}`);
    }

    return response.json();
};

/**
 * Refreshes JWT access_token using refresh_token stored in localStorage.
 */
export const refreshAccessToken = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (!refresh_token) throw new Error("No refresh token available");

    const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token }),
    });

    if (!response.ok) {
        logoutUser();
        throw new Error("Session expired. Please log in again.");
    }

    const data = await response.json();
    localStorage.setItem("access_token", data.access_token);
    if (data.refresh_token) {
        localStorage.setItem("refresh_token", data.refresh_token);
    }
    if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
    }
    return data.access_token;
};

/**
 * Logs out user by revoking refresh token on backend and clearing localStorage.
 */
export const logoutUser = async () => {
    const refresh_token = localStorage.getItem("refresh_token");
    if (refresh_token) {
        try {
            await fetch(`${BACKEND_URL}/auth/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ refresh_token }),
            });
        } catch (e) {
            console.warn("Logout notification to backend failed:", e);
        }
    }
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
};

/**
 * React Hook for Google Auth
 */
export const useGoogleAuth = ({ onSuccess, onError }) => {
    return useGoogleLogin({
        onSuccess: async (codeResponse) => {
            try {
                const data = await authenticateWithBackend(codeResponse.access_token);
                
                localStorage.setItem("access_token", data.access_token);
                localStorage.setItem("refresh_token", data.refresh_token);
                localStorage.setItem("user", JSON.stringify(data.user));
                
                onSuccess?.(data.user);
            } catch (err) {
                console.error("Google Auth Backend Sync Error:", err);
                onError?.(err);
            }
        },
        onError: (err) => {
            console.error("Google OAuth Login Failed:", err);
            onError?.(err);
        }
    });
};