// services/protectedService.ts
import { tokenService } from "@/services/tokenService";
import { isTokenExpired } from "@/utils/tokenHelper";
import useAuthStore from "@/store/authStore";

/**
 * Einfacher Dummy-Call, der "geschützte Daten" zurückgibt.
 * Vorher wird geprüft, ob das Access Token gültig ist.
 * Wenn nicht => versuche refreshen.
 * Wenn Refresh scheitert => Fehler ("Bitte Login").
 */
export async function getProtectedData(): Promise<string> {
    // Hole das aktuelle Access Token aus SecureStore
    const accessToken = await tokenService.getAccessToken();

    // Check Token
    if (!accessToken || isTokenExpired(accessToken)) {
        console.log("[protectedService] Token ist abgelaufen => Refresh anstoßen...");

        // Versuche Refresh
        await useAuthStore.getState().refreshAccessToken();

        // Prüfe jetzt, ob wir nach dem Refresh eingeloggt sind
        if (!useAuthStore.getState().isAuthenticated) {
            console.error("[protectedService] Refresh fehlgeschlagen => Bitte neu einloggen");
            throw new Error("Unauthorized - Bitte erneut einloggen");
        }
        console.log("[protectedService] Refresh erfolgreich - Token erneuert");
    }

    // Hier wären wir "authentifiziert" => Dummy-Daten zurückgeben
    return "This is PROTECTED data (dummy)!";
}

/**
 * Erläuterungen:
 *    •	isTokenExpired(accessToken): Prüft, ob das Token fehlt oder schon abgelaufen ist.
 *    •	Falls abgelaufen, ein mal refreshAccessToken() anstoßen.
 *    •	Wenn es danach noch immer isAuthenticated = false ist, brechen wir ab. (User hat also Pech und muss manuell zum Login.)
 */