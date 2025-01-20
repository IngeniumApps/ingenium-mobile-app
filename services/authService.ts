import {dummyJWT} from "@/test/dummyData";

export const authService = {
  login: async (username: string, password: string): Promise<{ token: string; refreshToken: string; expiresAt: string; }> => {
    // Simulierter API-Call
    return new Promise<{
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
  },

  refreshToken: async (refreshToken: string): Promise<{ token: string; refreshToken: string; expiresAt: string; }> => {
    return await new Promise<{
      token: string;
      refreshToken: string;
      expiresAt: string;
    }>((resolve) => {
      setTimeout(() => {
        resolve(dummyJWT);
      }, 500);
    });
  },
};
