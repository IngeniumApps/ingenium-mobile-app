import { dummyUserData } from "@/test/dummyData";

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
        return await new Promise<UserData>((resolve) => {
            setTimeout(() => resolve(dummyUserData), 300);
        });
    },
};
