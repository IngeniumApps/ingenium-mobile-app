export interface DecodedJWT {
    exp: number; // Ablaufzeit in Sekunden
    userId?: string; // Optional: Benutzer-ID
    [key: string]: any; // Andere mögliche Felder im Payload
}

// TODO: decodeJWT implement is a simple helper function that decodes a JWT token and extracts the payload.
// Later, we can use a library to decode the token on the client-side or using the existing code from IngeniumApp_Frontend in the backendService.js file.
//
// Important Node: In the old IngeniumApp_Backend and IngeniumApp_Frontend there is only the access token in use. The refresh token is not used in the backend.

/**
 * Dekodiert ein JWT-Token und extrahiert das Payload.
 * @param token Das JWT-Token.
 * @returns Das dekodierte Payload oder `null`, wenn das Token ungültig ist.
 */
export const decodeJWT = (token: string): DecodedJWT | null => {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) {
            console.error("❌ Ungültiges JWT-Format");
            return null;
        }

        // Dekodiere und parse das Payload
        const decodedPayload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
        const payload: DecodedJWT = JSON.parse(decodedPayload);

        // Überprüfe, ob `exp` vorhanden ist
        if (!payload.exp) {
            console.error("❌ Das JWT enthält kein `exp`-Feld");
            return null;
        }

        return payload;
    } catch (error) {
        console.error("❌ Fehler beim Dekodieren des JWT:", error);
        return null;
    }
};

// TODO: isTokenExpired implement is a simple helper function that checks if a token is expired.
// Later, we can use a library to validate the token on the client-side or using the existing code from IngeniumApp_Frontend in the backendService.js file.

/**
 * Prüft, ob ein Token existiert und ob es abgelaufen ist.
 * Gibt `true` zurück, wenn das Token:
 *  - nicht vorhanden ist, ODER
 *  - kein gültiges exp-Feld hat, ODER
 *  - das exp-Datum in der Vergangenheit liegt.
 *
 * Andernfalls `false`.
 */
export function isTokenExpired(token: string | null, decoded?: DecodedJWT): boolean {
    if (!token) {
        console.log("❌ Token nicht vorhanden oder ungültig");
        return true; // null/undefined => Token ungültig
    }

    // Falls `decoded` nicht übergeben wurde, erst jetzt decodieren
    const jwt = decoded ?? decodeJWT(token);

    if (jwt && jwt.exp) {
        const expiryDateUTC = new Date(jwt.exp * 1000);
        const expiryDateVienna = expiryDateUTC.toLocaleString("de-AT", { timeZone: "Europe/Vienna" });
        console.log(`👉⏱️(jwtUtils) => Refresh Token Ablaufdatum: ${expiryDateVienna} (Aktuelle Zeit: ${new Date().toLocaleString("de-AT", { timeZone: "Europe/Vienna" })})`);
    }

    if (!jwt || !jwt.exp) {
        // Ungültig dekodiert oder kein exp-Feld
        console.log("❌ JWT dekodieren fehlgeschlagen oder kein `exp`-Feld vorhanden");
        return true;
    }

    // exp ist in Sekunden => * 1000 => Millisekunden
    const now = Date.now();        // aktuelle Zeit in Millisekunden
    const expiry = jwt.exp * 1000; // exp ist in Sekunden angegeben

    if(expiry < now) {
        console.log(`❌ Token abgelaufen! Ablaufdatum: ${new Date(expiry)} (jetzt: ${new Date(now)})`);
        return true;
    }

    return false;
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