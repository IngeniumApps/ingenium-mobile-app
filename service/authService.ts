import { dummyJWT, dummyUserData, generateDummyToken } from "@/test/dummyData";

const BASE_URL = "";

// Dummy JWT-Decoding
export const decodeJWT = (token: string): { exp: number } | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Ungültiges JWT-Format");
    }

    const decodedPayload = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
    const parsedPayload = JSON.parse(decodedPayload);

    if (!parsedPayload.exp) {
      throw new Error("Das JWT enthält kein `exp`-Feld");
    }

    return { exp: parsedPayload.exp };
  } catch (error) {
    console.error("❌ Fehler beim Dekodieren des JWT:", error);
    return null;
  }
};

// services/authService.ts
export const authService = {
  login: async (username: string, password: string) => {
    // Simulierter API-Call
    const response = await new Promise<{
      token: string;
      refreshToken: string;
      expiresAt: string;
    }>((resolve, reject) => {
      setTimeout(() => {
        if (username === "testi.mctest" && password === "test123") {
          resolve(dummyJWT);
        } else {
          reject(new Error("Ungültige Anmeldedaten"));
        }
      }, 500);
    });
    return response;
  },

  fetchUserDetails: async (token: string) => {
    console.log("🔄 Abrufen der Dummy-Benutzerdetails mit Token:", token);
    // Simulierter API-Call
    return await new Promise<Record<string, any>>((resolve) => {
      setTimeout(() => resolve(dummyUserData), 400);
    });
  },

  refreshToken: async (refreshToken: string) => {
    return await new Promise<{
      token: string;
      refreshToken: string;
      expiresAt: string;
    }>((resolve) => {
      setTimeout(() => {
        resolve({
          token: generateDummyToken(60), // Neues Access Token, gültig für 60 Sekunden
          refreshToken: generateDummyToken(30 * 24 * 60 * 60), // Neuer Refresh Token, gültig für 30 Tage
          expiresAt: new Date(Date.now() + 60 * 1000).toISOString(), // Ablaufzeit des neuen Access Tokens
        });
      }, 500);
    });
  },
};
