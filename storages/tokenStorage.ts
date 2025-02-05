import * as SecureStore from "expo-secure-store";

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
    /**
     * Saves the access and refresh tokens to the secure store.
     * @param {string} accessToken - The access token to be saved.
     * @param {string} refreshToken - The refresh token to be saved.
     * @returns {Promise<void>} A promise that resolves when the tokens are saved.
     */
    async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
        await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    },

    /**
     * Retrieves the access token from the secure store.
     * @returns {Promise<string | null>} A promise that resolves with the access token, or null if not found.
     */
    async getAccessToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    },

    /**
     * Retrieves the refresh token from the secure store.
     * @returns {Promise<string | null>} A promise that resolves with the refresh token, or null if not found.
     */
    async getRefreshToken(): Promise<string | null> {
        return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    },

    /**
     * Deletes the access and refresh tokens from the secure store.
     * @returns {Promise<void>} A promise that resolves when the tokens are deleted.
     */
    async deleteTokens(): Promise<void> {
        await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
        await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
    },
};