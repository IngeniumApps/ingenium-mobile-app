import {dummyJWT} from "@/dummyData/dummyData";

export const authService = {
  /**
   * Simulierter Login
   */
  login: async (username: string, password: string): Promise<{ token: string; refreshToken: string; userData: {
      userId: string;
      firstname: string;
      lastname: string;
      email: string;
      role: string;
    };
  }> => {
      // aktuell return new Promise(... dummyJWT ...)
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (username === "testi.mctest" && password === "test123") {
          resolve(dummyJWT);
        } else {
          reject(new Error("Ungültige Anmeldedaten"));
        }
      }, 500);
    });
    // SPÄTER:
     // const response = await api.post("/login", { username, password });
     // return response.data; // { token, refreshToken, userData, ... }
  },
  /**
   *    •	Hinweis: Hier ist der Access Token nur 60 Sekunden gültig, damit wir den Refresh gleich beim Testen sehen können. In einer echten App könntest du z. B. 15 Minuten setzen.
   *    •	Refresh Token auf 30 Tage. Sobald man das Projekt testet, sieht man schnell, ob der Refresh-Flow greift.
   */

  /**
   * Simulierter Refresh
   */
  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string; userData: {
      userId: string;
      firstname: string;
      lastname: string;
      email: string;
      role: string;
    };
  }> => {
      // aktuell return new Promise(... dummyJWT ...)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Wir geben hier wieder dummyJWT zurück,
        // damit wir ein "frisches" token + userData bekommen
        resolve(dummyJWT);
      }, 500);
    });
    // SPÄTER:
     // const response = await api.post("/refresh", { refreshToken });
     // return response.data; // { token, refreshToken, userData, ... }
  },
};

/**
 *    •	Im realen Code würdest du fetch() oder axios an den Server schicken und ihm das refreshToken mitgeben.
 *    •	Für den Dummy ignorieren wir den Parameter und geben immer dasselbe dummyJWT zurück.
 */