import { decodeJWT } from "@/utils/jwtUtils";


/**
 * Prüft, ob ein Token existiert und ob es abgelaufen ist.
 * Gibt `true` zurück, wenn das Token:
 *  - nicht vorhanden ist, ODER
 *  - kein gültiges exp-Feld hat, ODER
 *  - das exp-Datum in der Vergangenheit liegt.
 *
 * Andernfalls `false`.
 */
export function isTokenExpired(token: string | null): boolean {
    if (!token) return true; // null/undefined => Token ungültig

    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
        // Ungültig dekodiert oder kein exp-Feld
        return true;
    }

    // exp ist in Sekunden => * 1000 => Millisekunden
    const now = Date.now();        // aktuelle Zeit in Millisekunden
    const expiry = decoded.exp * 1000; // exp ist in Sekunden angegeben

    return expiry < now;
}

/**
 * Erläuterungen:
 *    •	Du importierst decodeJWT (das du vermutlich in utils/jwtUtils.ts definiert hast).
 *    •	Wenn token leer ist (null | undefined), geben wir gleich true zurück (= abgelaufen oder nicht vorhanden).
 *    •	Wenn decodeJWT scheitert oder kein exp vorfindet, gilt das Token als ungültig.
 *    •	Ansonsten vergleichen wir die aktuelle Zeit now (in Millisekunden) mit decoded.exp * 1000.
 *
 * So kannst du an einer beliebigen Stelle im Code einfach if (isTokenExpired(accessToken)) { ... } aufrufen, um schnell zu prüfen, ob das Token noch gültig ist.
 */