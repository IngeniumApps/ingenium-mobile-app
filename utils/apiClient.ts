import axios from "axios";
import { tokenService } from "@/services/tokenService";
import useAuthStore from "@/store/authStore";

// TODO: API-Client is important for handling requests to the backend
// Later in the app, it will be used to send requests to the backend
// (e.g. api.get("/my-data") or api.post("/new-record", { data: "..." })
// Currently, it is not used because we only have dummy data
// Later, we will replace the dummy data with real data from the backend
// and use the API client to send requests to the backend

/**
 * 1) Erzeuge eine Axios-Instanz
 *    - baseURL: Wenn du ein echtes Backend hast, kommt hier z. B. "https://meine-api.com/"
 *    - Im Dummy-Fall lassen wir das leer oder localhost
 */
export const api = axios.create({
    baseURL: "http://localhost:3000", // DUMMY-Wert. Später austauschen!
});

/**
 * 2) Request-Interceptor:
 *    - Hier kannst du das Access Token an den Header hängen,
 *      bevor jeder Request an dein "Backend" geht.
 */
api.interceptors.request.use(
    async (config) => {
        // Hol dir das Access Token aus dem Store / Secure Storage
        const accessToken = await tokenService.getAccessToken();
        if (accessToken) {
            // Füge es als Authorization-Header hinzu
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        // Fehler beim Request-Build, gebe ihn weiter
        return Promise.reject(error);
    }
);

/**
 * 3) Response-Interceptor:
 *    - Fängt 401 ab und versucht einmal, das Token zu refreshen.
 *    - Wenn das Token danach immer noch ungültig ist, => logout oder Error.
 */
let isRefreshing = false; // um zu verhindern, dass bei parallelen Requests mehrfach refresht wird

api.interceptors.response.use(
    (response) => {
        // Alles OK, einfach weiterleiten
        return response;
    },
    async (error) => {
        // Fehler im Response
        const { refreshAccessToken, isAuthenticated } = useAuthStore.getState();

        // Prüfen: Haben wir 401?
        if (error.response?.status === 401) {
            // Prüfen, ob wir gerade schon refresht werden
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    await refreshAccessToken();
                } catch (refreshError) {
                    // Falls Refresh fehlschlägt => user nicht mehr authentifiziert
                    console.error("[apiClient] Token refresh failed:", refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            // Nochmal checken, ob wir jetzt eingeloggt sind
            if (isAuthenticated) {
                // => Request wiederholen
                return api(error.config);
            } else {
                // => nicht mehr eingeloggt => ggf. logout
                console.log("[apiClient] 401 => must login again");
                // Hier könntest du z. B. Router-Navigation machen
            }
        }

        // Wenn es kein 401 war oder Refresh fehlgeschlagen => Fehler weiterwerfen
        return Promise.reject(error);
    }
);

/**
 * Erklärung:
 *    1.	api = axios.create({...})
 *    •	Erzeugt eine eigene Axios-Instanz.
 *    •	Später mit echtem Backend: Du setzt in baseURL einfach "https://my-real-api.com" statt localhost.
 *    2.	Request-Interceptor:
 *    •	Holt dein Access Token (z. B. aus tokenService.getAccessToken()) und hängt es als Authorization-Header an.
 *    •	Später mit echtem Backend: Dieser Teil bleibt gleich, du änderst nur, wie du das Token holst, falls nötig.
 *    3.	Response-Interceptor:
 *    •	Wenn ein Request 401 zurückgibt, versucht Axios ein Mal, refreshAccessToken() aufzurufen.
 *    •	Danach wiederholt Axios den ursprünlichen Request.
 *    •	Später mit echtem Backend: Du änderst nichts außer evtl. die Art und Weise, wie das Refresh Endpoint aussieht. Der Mechanismus bleibt.
 *    4.	isRefreshing-Flag:
 *    •	Verhindert, dass bei parallelen Requests zig Mal refresht wird.
 *
 * Jetzt hast du einen zentralen Client: Jeder Aufruf api.get(...), api.post(...), usw. läuft über diese Instanz, fängt 401 ab und refresht automatisch.
 */