export type UserRole = 'admin' | 'user';

export interface AuthUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

export interface LoginRequestBody {
    email: string;
    password: string;
}