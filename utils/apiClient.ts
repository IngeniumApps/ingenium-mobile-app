
/**
 * In einer echten App nutzt man z.B. Axios oder einen globalen fetch-Wrapper.
 * Damit fängt man bei jedem Request eventuelle 401-Antworten ab und versucht einmal,
 * das Access Token zu refreshen. Hier eine Dummy-Variante mit fetch:
 */

import useAuthStore from "@/store/authStore";

/**
 * Dummy-Fetch-Funktion mit 401-Interceptor
 *
 * - Versucht ganz normal fetch()
 * - Wenn 401 => refreshAccessToken() => retry
 */
export async function apiFetch(input: RequestInfo, init?: RequestInit) {
    try {
        const response = await fetch(input, init);

        if (response.status === 401) {
            // 1) Token abgelaufen => Refresh versuchen
            const { refreshAccessToken, isAuthenticated } = useAuthStore.getState();
            await refreshAccessToken();

            // 2) Prüfen, ob refresh geklappt hat
            if (isAuthenticated) {
                // Wenn ja, retry
                return fetch(input, init);
            } else {
                // Wenn nein, User muss sich neu einloggen
                console.error("Unauthorized - Please login again.");
            }
        }

        return response;
    } catch (err) {
        console.error("[apiClient] API Fetch Error:", err);
        throw err;
    }
}

/**
 *    •	Funktion: Jeder API-Call, der 401 zurückbekommt, führt automatisch einen Refresh durch und wiederholt den Call einmal.
 *    •	Dummy: In deinem Projekt könntest du statt fetch(...) einen Dummyrückgabewert machen. Aber eigentlich brauchst du das hier nur als Beispiel, wie man 401 abfängt.
 *
 * In einer echten App würdest du hier Access Token an den Header hängen usw.
 */