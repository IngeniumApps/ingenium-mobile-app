import axios from "axios";
import * as SecureStore from "expo-secure-store";

const API_BASE_URL = "http://localhost:3001/ingeapp/api/v1"; // Mock-Backend-URL

export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// 🔹 **Request Interceptor → Hängt Access Token automatisch an**
apiClient.interceptors.request.use(
    async (config) => {
        const accessToken = await SecureStore.getItemAsync("access_token"); // get stored access token
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`; // set token in header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 🔹 Response Interceptor → 401 abfangen & Refresh-Token-Callback aufrufen
apiClient.interceptors.response.use(
    (response) => response, // Erfolgreiche Requests einfach weitergeben (keine Änderung)
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                console.log("🔄apiClient.ts - Token abgelaufen, starte Refresh...");
                const refreshToken = await SecureStore.getItemAsync("refresh_token");

                if (!refreshToken) {
                    console.log("❌apiClient.ts - Kein Refresh-Token, erzwungener Logout.");
                    // Logge den Benutzer aus - TODO: Implementierung
                    return Promise.reject(error);
                }

                const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });

                await SecureStore.setItemAsync("access_token", data.accessToken);
                await SecureStore.setItemAsync("refresh_token", data.refreshToken);

                originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                return apiClient(originalRequest);
            } catch (refreshError) {
                console.error("❌apiClient.ts - Fehler beim Token-Refresh:", refreshError);
                // Logge den Benutzer aus - TODO: Implementierung
                return Promise.reject(refreshError);
            }
        }
        return Promise.reject(error);
    }
);

// 📌 API-Funktionen (angepasst für neues Backend)
export const apiAuth = {
    login: async (username: string, password: string) => {
        const response = await apiClient.post("/auth/authenticate", { username, password });
        return response.data;
    },
    getUserData: async (userID: number) => {
        const response = await apiClient.get(`/user/getUserData/${userID}`);
        return response.data;
    },
    getCalendarData: async (userID: number) => {
        const response = await apiClient.get(`/user/getIcalData/${userID}`);
        return response.data; // Gibt das `calendar`-Objekt zurück
    },
    getIcalUrl: async (userID: number) => {
        const response = await apiClient.get(`/user/getIcalUrl/${userID}`);
        return response.data.url; // Gibt die fertige ICAL-URL zurück
    },
};
