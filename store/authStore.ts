
import { create } from "zustand";
import { authService } from "@/services/authService";
import { tokenService } from "@/services/tokenService";
import { userService, UserData } from "@/services/userService";
import {decodeJWT, isTokenExpired} from "@/utils/jwtUtils";

let refreshTimer: NodeJS.Timeout | null = null;

interface AuthState {
    isAuthenticated: boolean; // Indicates if the user is logged in
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
    startRefreshTimer: () => void;
    stopRefreshTimer: () => void;
}

/**
 * Optional: Hilfsfunktion, um die exp-Zeit in ms zu bekommen
 */
function getTokenExpiryMs(token: string): number {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return 0;
    return decoded.exp * 1000;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
    // Initial state
    isAuthenticated: false,
    userData: null,
    initialized: false,
    loading: false,
    error: null,

    /**
     * 1) initializeAuth
     *    - Lädt Tokens aus SecureStore
     *    - Wenn Access Token abgelaufen => refresh
     *    - Wenn refresh ok => isAuthenticated = true
     *    - userData laden (solange du es brauchst)
     *    - Timer starten
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

            if (isTokenExpired(token)) {
                console.log("⚠️ (authStore.ts) - Access Token abgelaufen, starte Refresh...");
                await get().refreshAccessToken();
            } else {
                console.log("✅ (authStore.ts) - Access Token ist noch gültig.");
                set({ isAuthenticated: true });
            }

            if (get().isAuthenticated) {
                console.log("👤(authStore.ts) - Lade Benutzerdaten...");
                const data = await userService.getUserDetails();
                set({ userData: data });
            }

            get().startRefreshTimer();
            set({ initialized: true });

            console.log("✅ (authStore.ts) - Authentifizierung erfolgreich initialisiert.");
        } catch (error) {
            console.error("❌(authStore.ts) - Fehler bei der Initialisierung:", error);
            set({ error: "Fehler bei der Initialisierung", isAuthenticated: false, initialized: true });
        } finally {
            set({ loading: false });
        }
    },

    /**
     * 2) login
     */
    login: async (username, password) => {
        set({ loading: true, error: null });
        try {
            console.log("===============================================");
            console.log("🔑(authStore.ts) - Login wird gestartet...");
            const response = await authService.login(username, password);
            // -> { token, refreshToken, userData }

            console.log(`🔍(authStore.ts) - Erhaltener Access Token: ${response.token}`);
            console.log(`🔍(authStore.ts) - Erhaltener Refresh Token: ${response.refreshToken}`);

            // Tokens speichern
            await tokenService.saveTokens(response.token, response.refreshToken);

            // isAuthenticated = true
            set({
                isAuthenticated: true,
                userData: response.userData, // Direkt übernehmen
            });

            // Timer starten
            get().startRefreshTimer();

            console.log("✅ (authStore.ts) Login erfolgreich.");
        } catch (err: any) {
            console.error("❌ (authStore.ts) - Fehler beim Login:", err.message);
            set({ error: err.message, isAuthenticated: false });
            throw err;
        } finally {
            set({ loading: false });
        }
    },

    /**
     * 3) logout
     */
    logout: async () => {
        set({ loading: true });
        try {
            await tokenService.deleteTokens();
            get().stopRefreshTimer(); // Timer stoppen

            set({
                isAuthenticated: false,
                userData: null,
            });
        } catch (err) {
            console.error("❌ (authStore.ts) - Fehler beim Logout:", err);
            set({ error: "Fehler beim Logout" });
        } finally {
            set({ loading: false });
        }
    },

    /**
     * 4) refreshAccessToken
     *    - Holt das refreshToken
     *    - Wenn abgelaufen => logout
     *    - Sonst hole neues token
     *    - set isAuthenticated + userData, falls du es willst
     */
    refreshAccessToken: async () => {
        const refreshToken = await tokenService.getRefreshToken();

        if (refreshToken) {
            const decodedRefreshToken = decodeJWT(refreshToken);
            if (decodedRefreshToken && decodedRefreshToken.exp) {
                const refreshExpiryDate = new Date(decodedRefreshToken.exp * 1000).toLocaleString("de-AT", { timeZone: "Europe/Vienna" });
                //console.log(`🔄(authStore) - Refresh Token exp: ${refreshExpiryDate} (Aktuelle Zeit: ${new Date().toLocaleString("de-AT", { timeZone: "Europe/Vienna" })})`);
            }
        }

        if (!refreshToken || isTokenExpired(refreshToken)) {
            console.log("📦(authStore.ts) - Refresh Token abgelaufen => Logout");
            await get().logout();
            return;
        }
        try {
            set({ loading: true });
            console.log("===============================================");
            console.log("📦(authStore.ts) - Refreshing Access Token...");
            const response = await authService.refreshToken(refreshToken);
            console.log("📦(authStore.ts) - Refresh abgeschlossen:", response);

            console.log(`🔍(authStore) - Neuer Access Token nach Refresh: ${response.token}`);
            console.log(`🔍(authStore) - Neuer Refresh Token nach Refresh: ${response.refreshToken}`);

            await tokenService.saveTokens(response.token, response.refreshToken);

            console.log("✅ (authStore.ts) - Neue Tokens wurden erfolgreich gespeichert!");

            set({
                isAuthenticated: true,
                userData: response.userData,
            });

            console.log("✅ (authStore.ts) - Neues Access Token erfolgreich per Refresh Token erhalten!");
        } catch (error) {
            console.error("❌ (authStore) - Fehler beim Refresh:", error);
            await get().logout();
        } finally {
            set({ loading: false });
        }
    },

    /**
     * 5) startRefreshTimer
     *
     *    •	Statt fix alle 5 Minuten wird jetzt abhängig vom Token ein Refresh gestartet.
     *    •	Falls das Token noch 30 Minuten gültig ist, wird der Timer erst in 29 Minuten getriggert.
     *    •	Falls das Token in 40 Sekunden abläuft, refresht es in 30 Sekunden.
     *
     */
    startRefreshTimer: () => {
        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
        }

        tokenService.getAccessToken().then(async (token) => {
            if (!token) {
                console.warn("⚠️ (authStore) - Kein Access Token gefunden, Timer wird nicht gestartet.");
                return;
            }

            const expMs = getTokenExpiryMs(token);
            const now = Date.now();
            const timeLeft = expMs - now;

            // Dynamische Berechnung: Refresh genau 10s vor Ablauf
            const refreshTimeBeforeExpiry = 10 * 1000; // 10 Sekunden vorher refresht
            const refreshInterval = Math.max(refreshTimeBeforeExpiry, timeLeft - refreshTimeBeforeExpiry);

            // Hol das Refresh Token - NUR FÜR DEBUGGING ZWECKE zum loggen
            const refreshToken = await tokenService.getRefreshToken();
            let refreshExpMs = null;
            if (refreshToken) {
                const decodedRefreshToken = decodeJWT(refreshToken);
                if (decodedRefreshToken && decodedRefreshToken.exp) {
                    refreshExpMs = decodedRefreshToken.exp * 1000;
                }
            }


            refreshTimer = setTimeout(() => {
                console.log("===============================================");
                console.log("⚠️ (authStore) - Access Token fast abgelaufen, refreshe jetzt...");
                get().refreshAccessToken();
            }, refreshInterval);

            console.log("===============================================");
            console.log(`⏱️(authStore) - Access Token exp: ${new Date(expMs).toLocaleString("de-AT", {timeZone: "Europe/Vienna"})} - in ${timeLeft / 1000}sec (Aktuelle Zeit: ${new Date(now).toLocaleString("de-AT", {timeZone: "Europe/Vienna"})})`);
            if (refreshExpMs) {
                console.log(`⏱️ (authStore) - Refresh Token exp: ${new Date(refreshExpMs).toLocaleString("de-AT", {timeZone: "Europe/Vienna"})} (Aktuelle Zeit: ${new Date(now).toLocaleString("de-AT", {timeZone: "Europe/Vienna"})})`);
            } else {
                console.warn("⚠️ (authStore) - Kein gültiges Refresh Token gefunden.");
            }
            console.log(`👉⏱️(authStore) - Refresh Timer für Access Token wird (in ${refreshInterval / 1000}s) gestartet`);
            console.log("===============================================");
        });
    },

    /**
     * 6) stopRefreshTimer
     */
    stopRefreshTimer: () => {
        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
            console.log("✅ (authStore) - Refresh Timer erfolgreich gestoppt.");
        } else {
            console.warn("⚠️ (authStore) - Kein aktiver Refresh Timer gefunden.");
        }
    },
}));

export default useAuthStore;