import type { UserProfile } from "./type";

// Union Types для аутентифікації
export type AuthStatus =
	| "authenticated"
	| "unauthenticated"
	| "loading"
	| "error";

export type AuthError =
	| { type: "invalid_credentials" }
	| { type: "network_error"; message: string }
	| { type: "server_error"; status: number }
	| { type: "validation_error"; field: string; message: string };

// Intersection Types для користувачів
export interface UserPermissions {
	canCreateMarkers: boolean;
	canEditMarkers: boolean;
	canDeleteMarkers: boolean;
	canViewPrivateMarkers: boolean;
}

export type UserWithPermissions = UserProfile & UserPermissions;

// Form Types для аутентифікації
export interface LoginCredentials {
	email: string;
	password: string;
}

export interface RegisterCredentials extends LoginCredentials {
	username: string;
}

export interface AuthFormState {
	isSubmitting: boolean;
	error: string | null;
}

// Generic для auth hooks
export interface UseAuthReturn {
	user: UserProfile | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;
	login: (credentials: LoginCredentials) => Promise<void>;
	register: (credentials: RegisterCredentials) => Promise<void>;
	logout: () => Promise<void>;
}

// Utility Types
export type AuthToken = string | null;
export type SessionData = {
	access_token: string;
	refresh_token: string;
} | null;
