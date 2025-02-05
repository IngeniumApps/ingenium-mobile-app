export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
    userID: number;
}

export interface UserData {
    userID: number;
    firstname: string;
    lastname: string;
    accountIsNotLocked: number;
    email: string;
    title: string;
    gender: string;
    institution: string;
    userAddress: {
        city: string;
        street: string;
        zipcode: string;
        country: string;
    };
}
