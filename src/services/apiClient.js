import { refreshAccessToken, logoutUser } from "./authApi";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

/**
 * Wrapper around native fetch that injects the JWT Bearer token
 * and automatically retries requests if 401 Unauthorized occurs by refreshing the access token.
 */
export const authenticatedFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("access_token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (accessToken) {
    headers["Authorization"] = `Bearer ${accessToken}`;
  }

  let response = await fetch(url, { ...options, headers });

  // If unauthorized, attempt silent token refresh once
  if (response.status === 401) {
    try {
      accessToken = await refreshAccessToken();
      headers["Authorization"] = `Bearer ${accessToken}`;
      response = await fetch(url, { ...options, headers });
    } catch (refreshErr) {
      logoutUser();
      window.location.href = "/";
      throw new Error("Session expired. Please log in again.");
    }
  }

  return response;
};

export const generateTripFromBackend = async ({ destination, noOfDays, traveler, budget }) => {
  const response = await fetch(`${BACKEND_URL}/api/v1/generate-trip`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      destination,
      noOfDays: parseInt(noOfDays),
      traveler,
      budget,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`AI generation failed: ${err}`);
  }

  const result = await response.json();
  return result.tripData;
};

export const saveTripToBackend = async (tripData) => {
  const response = await authenticatedFetch(`${BACKEND_URL}/trips`, {
    method: "POST",
    body: JSON.stringify(tripData),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Failed to save trip (${response.status}): ${err}`);
  }
  return response.json();
};

export const fetchTripFromBackend = async (tripId) => {
  const response = await authenticatedFetch(`${BACKEND_URL}/trips/${tripId}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Failed to fetch trip");
  return response.json();
};

export const fetchUserTripsFromBackend = async () => {
  const response = await authenticatedFetch(`${BACKEND_URL}/trips`);
  if (!response.ok) throw new Error("Failed to fetch user trips");
  return response.json();
};

export const deleteTripFromBackend = async (tripId) => {
  const response = await authenticatedFetch(`${BACKEND_URL}/trips/${tripId}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error(`Failed to delete trip (${response.status})`);
  // Clear local cache if present
  localStorage.removeItem("trip_" + tripId);
  return response.json();
};