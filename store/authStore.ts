/**
 * Hier kombinieren wir:
 *    •	initializeAuth(): Lädt Tokens aus Storage, checkt Access Token, ggf. Refresh.
 *    •	login(): Ruft authService.login() auf, speichert Tokens + userData.
 *    •	refreshAccessToken(): Versucht, das Token zu erneuern.
 *    •	logout(): Alle Tokens + userData löschen.
 *    •	Proaktiver Timer: Alle 5 Minuten gucken, ob das Access Token in < 1 Minute abläuft => dann refreshen. (Man könnte das flexibel gestalten.)
 */

import { create } from "zustand";
import { authService } from "@/services/authService";
import { tokenService } from "@/services/tokenService";
import { userService, UserData } from "@/services/userService";
import { decodeJWT } from "@/utils/jwtUtils";
import {isTokenExpired} from "@/utils/tokenHelper";

let refreshTimer: NodeJS.Timeout | null = null;

interface AuthState {
    isAuthenticated: boolean; // Indicates if the user is logged in
    userData: UserData | null; // Full user details object
    expiresAt: string | null; // Expiration time of the access token
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
    expiresAt: null,
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

            // Access Token check
            if (isTokenExpired(token)) {
                // Token abgelaufen => refresh
                await get().refreshAccessToken();
            } else {
                // Token ok => set isAuthenticated
                set({ isAuthenticated: true });
            }

            // Wenn nach dem Refresh oder Check isAuthenticated = true,
            // userDaten laden (Dummy, nur falls du's brauchst)
            if (get().isAuthenticated) {
                // userData => du kannst es direkt hier setten
                // Oder du holst es aus dummyJWT -> Du entscheidest:
                const data = await userService.getUserDetails();
                set({ userData: data });
            }

            // Timer starten, damit wir in Zukunft proaktiv refreshen
            get().startRefreshTimer();

            set({ initialized: true });

            console.log("✅ (authStore.ts) - Authentifizierung erfolgreich initialisiert.");
        } catch (error) {
            console.error("❌(authStore.ts) - Fehler bei der Initialisierung der Authentifizierung:", error);
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
            const response = await authService.login(username, password);
            // -> { token, refreshToken, expiresAt, userData }

            // Tokens speichern
            await tokenService.saveTokens(response.token, response.refreshToken);

            // isAuthenticated = true
            set({
                isAuthenticated: true,
                userData: response.userData, // Direkt übernehmen
                expiresAt: response.expiresAt,
            });

            // Timer starten
            get().startRefreshTimer();
        } catch (err: any) {
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
            get().stopRefreshTimer();

            set({
                isAuthenticated: false,
                userData: null,
                expiresAt: null,
            });
        } catch (err) {
            console.error("[authStore] logout error:", err);
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
        if (!refreshToken || isTokenExpired(refreshToken)) {
            console.log("[authStore] Refresh Token abgelaufen => Logout");
            await get().logout();
            return;
        }
        try {
            set({ loading: true });
            console.log("[authStore] Refreshing Access Token...");
            const response = await authService.refreshToken(refreshToken);
            // -> { token, refreshToken, expiresAt, userData }

            await tokenService.saveTokens(response.token, response.refreshToken);

            set({
                isAuthenticated: true,
                userData: response.userData, // kann unverändert sein
                expiresAt: response.expiresAt,
            });
            console.log("[authStore] Refresh successful");

        } catch (error) {
            console.error("[authStore] refreshAccessToken error:", error);
            // => Refresh fehlgeschlagen => logout
            await get().logout();
        } finally {
            set({ loading: false });
        }
    },

    /**
     * 5) startRefreshTimer
     *    - Alle 5 Minuten checken wir, ob das Token < 1 min läuft
     *    - Wenn ja => refresh
     */
    startRefreshTimer: () => {
        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
        }

        // Alle 5 Minuten
        refreshTimer = setInterval(() => {
            console.log("[authStore] Refresh Timer getriggert - prüfe Token");

            const tokenToCheck = tokenService.getAccessToken();
            tokenToCheck.then((token) => {
                if (!token) {
                    console.log("[authStore] Kein Token vorhanden - nichts zu tun. User ist nicht eingeloggt.");
                    return;
                }

                const expMs = getTokenExpiryMs(token);
                const now = Date.now();
                const timeLeft = expMs - now; // ms bis Ablauf

                if (timeLeft < 60 * 1000) {
                    // Weniger als 1 Min => refresh
                    console.log("[authStore] Weniger als 1min übrig => refresh wird ausgelöst");
                    get().refreshAccessToken();
                }
            });
        }, 5 * 60 * 1000); // 5 Min

        console.log("[authStore] Refresh Timer gestartet (5min).");
    },

    /**
     * 6) stopRefreshTimer
     */
    stopRefreshTimer: () => {
        if (refreshTimer) {
            clearInterval(refreshTimer);
            refreshTimer = null;
            console.log("[authStore] Refresh Timer gestoppt.");
        }
    },
}));

export default useAuthStore;

/**
 * Erläuterungen:
 *    1.	Timer:
 *    •	Wir haben ein startRefreshTimer() und stopRefreshTimer().
 *    •	Der Timer läuft, solange der User eingeloggt ist. Beim Login rufst du startRefreshTimer(), beim Logout stopRefreshTimer().
 *    •	Alle 5 Minuten wird das Access Token gecheckt. Ist es <60 Sek gültig, ruft er refreshAccessToken() auf.
 *    •	Du kannst die Intervalle natürlich anpassen (z. B. alle 2 Min checken, oder erst 2 Min vor Ablauf refreshen etc.).
 *    2.	401-Interceptor (apiFetch)
 *    •	Wenn du später irgendwelche API-Calls machst (z. B. via apiFetch(url, options)), bekommst du bei abgelaufenem Token einen 401.
 *    •	Dann ruft der Interceptor refreshAccessToken() auf, bevor er den Request einmal wiederholt.
 *    •	Wenn das Refresh fehlschlägt, logout().
 *    3.	User-Daten:
 *    •	Wir haben im dummyJWT bereits userData. Du setzt sie direkt in login() oder in refreshAccessToken() auf den State.
 *    •	Optional: Du könntest auch userService.getUserDetails() aufrufen, wenn sich die Daten öfter ändern. Aber bei starren Daten reicht das.
 */