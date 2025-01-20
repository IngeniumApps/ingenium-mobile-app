import {
    getFromSecureStore,
    saveToSecureStore,
    deleteFromSecureStore,
} from "@/utils/secureStore";

const TOKEN_KEY = "authToken";
const REFRESH_TOKEN_KEY = "refreshToken";

export const tokenService = {
    saveTokens: async (token: string, refreshToken: string) => {
        await saveToSecureStore(TOKEN_KEY, token);
        await saveToSecureStore(REFRESH_TOKEN_KEY, refreshToken);
    },

    getAccessToken: async () => {
        return await getFromSecureStore(TOKEN_KEY);
    },

    getRefreshToken: async () => {
        return await getFromSecureStore(REFRESH_TOKEN_KEY);
    },

    deleteTokens: async () => {
        await deleteFromSecureStore(TOKEN_KEY);
        await deleteFromSecureStore(REFRESH_TOKEN_KEY);
    },
};
