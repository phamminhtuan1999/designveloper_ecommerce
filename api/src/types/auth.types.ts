export interface UserCredentials {
    email: string;
    password: string;
}

export interface UserRegistration {
    name: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}