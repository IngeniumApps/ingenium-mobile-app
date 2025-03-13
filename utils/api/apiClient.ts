// TODO: Important!
//
// 🔹 The frontend is already working correctly. You don't need to change anything here.
// 🔹 The backend must handle the Refresh Token renewal.
//
// How it works:
// 1️⃣ The frontend automatically requests a new Access Token when needed.
// 2️⃣ If the Refresh Token is still valid, the backend should return:
//     - A new Access Token ✅
//     - A new Refresh Token (if it's about to expire) ✅
// 3️⃣ If the Refresh Token is expired, the backend should reject the request,
//     and the frontend will log the user out.
//
// 📌 When implementing the backend, make sure:
// - The backend issues a **new Refresh Token** when the current one is about to expire.
// - The backend tracks user activity through API requests to determine if a new token should be issued.
// - If the Refresh Token is expired, the backend should **not** issue a new one and require re-login.
//
// 🚀 **Result:** The user stays logged in as long as they actively use the app! 🎯

import axios from "axios";
import * as SecureStore from "expo-secure-store";
import authEventEmitter from "@/utils/api/eventEmitter";
import { AuthResponse, UserData } from "@/types/auth";
import {Platform} from "react-native";

// Base URL for the APO (Mock server running on localhost)
// TODO: ⚠️ Change this to your real backend URL when deploying the app

// API_URL Sabrinas Office
const API_BASE_URL = Platform.OS === "ios" ? "http://localhost:3001/ingeapp/api/v1" : "http://10.0.2.2:3001/ingeapp/api/v1"; // Mock-Backend-URLv - for emulator testing

// API-URL Ingenium Office
//const API_BASE_URL = Platform.OS === "ios" ? "http://127.0.0.1:3001/ingeapp/api/v1" : "http://10.0.2.2:3001/ingeapp/api/v1"; // Mock-Backend-URL Ingenium - for device testing - change the IP to your local IP

// Create an Axios instance for making API calls
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json", // Ensure all requests use JSON format
  },
});

// 🔹 **Global variables to handle token refresh state**
let isRefreshing = false; // Flag to track if token refresh is in progress
let refreshSubscribers: ((token: string) => void)[] = []; // Stores pending API requests while refreshing

// 🔹 **Request Interceptor → Automatically add the access token to the Authorization header for all requests**
apiClient.interceptors.request.use(
  async (config) => {
    // Retrieve the access token from the SecureStore
    const accessToken = await SecureStore.getItemAsync("access_token"); // get stored access token
    if (accessToken) {
      // Attach the access token to the request headers
      config.headers.Authorization = `Bearer ${accessToken}`; // set token in header
    }
    return config;
  },
  (error) => {
    // If an error occurs before the request is sent, handle it here
    return Promise.reject(error);
  },
);

// 🔹 **Response Interceptor → Handle 401 errors and refresh the access token automatically**
apiClient.interceptors.response.use(
  (response) => response, // If the request is successful, return the response as is
  async (error) => {
    const originalRequest = error.config;

    // Check if the error is a 401 (Unauthorized) and if we haven't already retried this request already
    if (error.response?.status === 401 && !originalRequest._retry) {
      // If a refresh is already in progress, wait for it to complete and retry the request
      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshSubscribers.push((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      // Mark this request as retried
      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("🔄apiClient.ts - Token abgelaufen, starte Refresh...");

        // Retrieve the refresh token from the SecureStore
        const refreshToken = await SecureStore.getItemAsync("refresh_token");

        if (!refreshToken) {
          console.log(
            "❌apiClient.ts - Kein Refresh-Token, erzwungener Logout.",
          );
          // 🔥 Trigger logout event
          authEventEmitter.emit("session_expired");
          return Promise.reject(error);
        }

        // Request a new access token from the backend
        const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // Store the new tokens in the SecureStore
        await SecureStore.setItemAsync("access_token", data.accessToken);
        await SecureStore.setItemAsync("refresh_token", data.refreshToken);

        // Set new access token in default headers for all upcoming requests
        apiClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;

        // Retry all pending requests with the new token
        refreshSubscribers.forEach((cb) => cb(data.accessToken));
        refreshSubscribers = [];

        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error(
          "❌apiClient.ts - Fehler beim Token-Refresh:",
          refreshError,
        );
        // 🔥 Trigger logout event
        authEventEmitter.emit("session_expired");
        return Promise.reject(refreshError);
      } finally {
        // Reset refreshing flag after token refresh is complete
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

// 📌 API-Functions for authentication based on the backend routes
export const apiAuth = {
  /**
   * Logs in a user with the provided username and password from ILIAS.
   * @param {string} username - The username of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Object>} The response data from the authentication endpoint.
   */
  login: async (username: string, password: string): Promise<AuthResponse> => {
    const response = await apiClient.post("/auth/authenticate", {
      username,
      password,
    });
    return response.data;
  },
  /**
   * Retrieves user data for the specified user ID.
   * @param {number} userID - The ID of the user.
   * @returns {Promise<Object>} The user data.
   */
  getUserData: async (userID: number): Promise<UserData> => {
    const response = await apiClient.get(`/user/getUserData/${userID}`);
    return response.data;
  },
  /**
   * Retrieves calendar data for the specified user ID.
   * @param {number} userID - The ID of the user.
   * @returns {Promise<Object>} The calendar data.
   */
  getCalendarData: async (userID: number): Promise<object> => {
    const response = await apiClient.get(`/user/getIcalData/${userID}`);
    return response.data; // Gibt das `calendar`-Objekt zurück
  },
  /**
   * Retrieves the iCal URL for the specified user ID.
   * @param {number} userID - The ID of the user.
   * @returns {Promise<string>} The iCal URL.
   */
  getIcalUrl: async (userID: number): Promise<string> => {
    const response = await apiClient.get(`/user/getIcalUrl/${userID}`);
    return response.data.url; // Gibt die fertige ICAL-URL zurück
  },
};
