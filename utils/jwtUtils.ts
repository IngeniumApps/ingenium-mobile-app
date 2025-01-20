export interface DecodedJWT {
    exp: number; // Ablaufzeit in Sekunden
    userId?: string; // Optional: Benutzer-ID
    [key: string]: any; // Andere mögliche Felder im Payload
}

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

/**
 * Prüft, ob ein JWT-Token gültig ist (basierend auf `exp`).
 * @param token Das JWT-Token.
 * @returns `true`, wenn das Token gültig ist, ansonsten `false`.
 */
export const isJWTValid = (token: string): boolean => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) {
        return false;
    }

    const currentTime = Math.floor(Date.now() / 1000); // Zeit in Sekunden
    return decoded.exp > currentTime;
};
