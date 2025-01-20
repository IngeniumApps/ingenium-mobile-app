import { create } from "zustand";
import { authService } from "@/services/authService";
import { tokenService } from "@/services/tokenService";
import { userService, UserData } from "@/services/userService";
import { decodeJWT } from "@/utils/jwtUtils";

interface AuthState {
    isAuthenticated: boolean; // Indicates if the user is logged in
    expiresAt: string | null; // Expiration time of the access token
    userId: string | null; // User ID retrieved from user details
    userData: UserData | null; // Full user details object
    initialized: boolean; // Indicates if authentication initialization is complete
    loading: boolean; // Indicates if a loading process is happening
    error: string | null; // Stores error messages if any
}

interface AuthActions {
    initializeAuth: () => Promise<void>; // Initializes the authentication state
    login: (username: string, password: string) => Promise<void>; // Logs the user in
    logout: () => Promise<void>; // Logs the user out
    refreshAccessToken: () => Promise<void>; // Refreshes the access token using the refresh token
    fetchUserDetails: () => Promise<UserData | null>; // Fetches user details
    isTokenValid: () => boolean; // Checks if the access token is still valid
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    // Initial state
    isAuthenticated: false,
    expiresAt: null,
    userId: null,
    userData: null,
    initialized: false,
    loading: false,
    error: null,

    /**
     * Initializes the authentication state by loading tokens from secure storage.
     * Verifies the access token or refreshes it if needed. Fetches user details on success.
     */
    initializeAuth: async () => {
        set({ loading: true });

        try {
            console.log("🔄(authStore.ts) - Initialisierung der Authentifizierung gestartet...");

            // Load tokens from secure storage
            const token = await tokenService.getAccessToken();
            const refreshToken = await tokenService.getRefreshToken();

            console.log("📦(authStore.ts) - Geladener Access Token:", token);
            console.log("📦(authStore.ts) - Geladener Refresh Token:", refreshToken);

            if (!token || !refreshToken) {
                console.log("❌ (authStore.ts) - Keine gültigen Tokens gefunden.");
                set({ initialized: true, isAuthenticated: false });
                return;
            }

            // Decode and validate the access token
            const decodedToken = decodeJWT(token);
            if (!decodedToken || !decodedToken.exp || decodedToken.exp * 1000 < Date.now()) {
                console.log("⏳ (authStore.ts) - Access Token abgelaufen. Versuche Refresh Token...");
                await get().refreshAccessToken();
                return;
            }

            console.log("⏳ (authStore.ts) - Access Token gültig bis:", new Date(decodedToken.exp * 1000).toISOString());

            // Fetch user details
            const userData = await get().fetchUserDetails();

            // Update state with authentication data
            set({
                isAuthenticated: true,
                expiresAt: new Date(decodedToken.exp * 1000).toISOString(),
                userId: userData?.userId || null,
                userData,
                error: null,
            });

            console.log("✅ (authStore.ts) - Authentifizierung erfolgreich initialisiert.");
        } catch (error) {
            console.error("❌(authStore.ts) - Fehler bei der Initialisierung der Authentifizierung:", error);
            set({ error: "Fehler bei der Initialisierung", isAuthenticated: false });
        } finally {
            set({ initialized: true, loading: false });
        }
    },

    /**
     * Logs the user in by calling the login API, saving tokens, and fetching user details.
     * @param username - The username provided by the user.
     * @param password - The password provided by the user.
     */
    login: async (username, password) => {
        set({ loading: true, error: null });

        try {
            console.log("🔑(authStore.ts) - Login gestartet für Benutzer:", username);

            // Call login API
            const response = await authService.login(username, password);
            console.log("📦(authStore.ts) - Login-Response:", response);

            // Save tokens
            await tokenService.saveTokens(response.token, response.refreshToken);

            // Decode and validate the access token
            const decodedToken = decodeJWT(response.token);
            if (!decodedToken || !decodedToken.exp) {
                console.error("❌(authStore.ts) - Ungültiges Token: Fehlende oder ungültige Ablaufzeit.");
                return;
            }

            console.log("📜(authStore.ts) - Dekodierter Token:", decodedToken);

            // Fetch user details
            const userData = await get().fetchUserDetails();

            // Update state with authentication data
            set({
                isAuthenticated: true,
                expiresAt: new Date(decodedToken.exp * 1000).toISOString(),
                userId: userData?.userId || null,
                userData,
                error: null,
            });

            console.log("✅ (authStore.ts) - Login erfolgreich.");
        } catch (error: any) {
            console.error("❌(authStore.ts) - Fehler beim Login:", error.message);
            set({ error: error.message, isAuthenticated: false });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    /**
     * Logs the user out by clearing tokens and resetting the authentication state.
     */
    logout: async () => {
        set({ loading: true });

        try {
            console.log("🔓(authStore.ts) - Logout gestartet...");

            // Delete tokens
            await tokenService.deleteTokens();

            // Reset authentication state
            set({
                isAuthenticated: false,
                expiresAt: null,
                userId: null,
                userData: null,
            });

            console.log("✅ (authStore.ts) - Logout erfolgreich.");
        } catch (error) {
            console.error("❌(authStore.ts) - Fehler beim Logout:", error);
            set({ error: "Fehler beim Logout" });
        } finally {
            set({ loading: false });
        }
    },

    /**
     * Refreshes the access token using the refresh token and updates the state.
     */
    refreshAccessToken: async () => {
        const refreshToken = await tokenService.getRefreshToken();

        if (!refreshToken) {
            console.log("❌(authStore.ts) - Kein Refresh Token verfügbar.");
            set({ isAuthenticated: false });
            return;
        }

        const decodedRefreshToken = decodeJWT(refreshToken);

        if (!decodedRefreshToken || decodedRefreshToken.exp * 1000 < Date.now()) {
            console.log("❌(authStore.ts) - Refresh Token abgelaufen.");
            set({ isAuthenticated: false });
            return;
        }

        try {
            console.log("🔄(authStore.ts) - Access Token wird erneuert...");

            // Call refresh token API
            const response = await authService.refreshToken(refreshToken);

            // Save new tokens
            await tokenService.saveTokens(response.token, response.refreshToken);

            const decodedToken = decodeJWT(response.token);
            if (!decodedToken || !decodedToken.exp) {
                console.error("❌(authStore.ts) - Ungültiges Token: Fehlende oder ungültige Ablaufzeit.");
                return;
            }

            // Update state
            set({
                isAuthenticated: true,
                expiresAt: new Date(decodedToken.exp * 1000).toISOString(),
            });

            console.log("✅ (authStore.ts) - Access Token erfolgreich erneuert.");
        } catch (error) {
            console.error("❌ (authStore.ts) - Fehler beim Erneuern des Access Tokens:", error);
            set({ error: "Fehler beim Token-Refresh", isAuthenticated: false });
        }
    },

    /**
     * Fetches the user's details from the user service.
     * @returns The user's details or null if the fetch failed.
     */
    fetchUserDetails: async (): Promise<UserData | null> => {
        set({ loading: true });

        try {
            console.log("🔄(authStore.ts) - Benutzerdetails werden abgerufen...");

            // Fetch user details
            const userData = await userService.getUserDetails();
            console.log("📦(authStore.ts) - Abgerufene Benutzerdetails:", userData);

            // Update state
            set({ userData, error: null });
            return userData;
        } catch (error) {
            console.error("❌(authStore.ts) - Fehler beim Abrufen der Benutzerdetails:", error);
            set({ error: "Fehler beim Abrufen der Benutzerdetails.", userData: null });
            return null;
        } finally {
            set({ loading: false });
        }
    },

    /**
     * Checks if the current access token is valid.
     * @returns True if the token is valid, false otherwise.
     */
    isTokenValid: () => {
        const { expiresAt } = get();
        return expiresAt ? new Date(expiresAt) > new Date() : false;
    },
}));

export default useAuthStore;
