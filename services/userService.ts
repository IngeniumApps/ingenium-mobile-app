import { dummyUserData } from "@/dummyData/dummyData";

export interface UserData {
    userId: string;
    firstname: string;
    lastname: string;
    email: string;
    role: string;
}

export const userService = {
    getUserDetails: async (): Promise<UserData> => {
        console.log("🔄(userService.ts) - Dummy-Benutzerdetails werden abgerufen...");
        // Hier später echte API-Aufrufe implementieren
        // Dummy => einfach dummyUserData zurückgeben
        return await new Promise<UserData>((resolve) => {
            setTimeout(() => resolve(dummyUserData), 300);
        });
    },
};
/**
 * 	•	Echt: Hier würdest du z.B. fetch("/api/me") machen.
 */