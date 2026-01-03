// Utility Types для проекту

// Generic для partial updates
export type PartialUpdate<T> = {
	[K in keyof T]?: T[K] | null;
};

// Required fields utility
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// Optional fields utility
export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Generic для store actions
export type StoreAction<T, P = void> = P extends void
	? () => T
	: (payload: P) => T;

export interface AsyncStoreAction<T, P = void> {
	(payload?: P): Promise<T>;
}

// Generic для form fields
export interface FormField<T = string> {
	value: T;
	error?: string;
	touched: boolean;
	isValid: boolean;
}

export interface FormState<T extends Record<string, any>> {
	fields: { [K in keyof T]: FormField<T[K]> };
	isValid: boolean;
	isSubmitting: boolean;
	isDirty: boolean;
}

// Generic для API endpoints
export interface ApiEndpoint<TRequest = any, TResponse = any> {
	request: TRequest;
	response: TResponse;
	method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	path: string;
}

// Event types
export type EventHandler<T = void> = (event: T) => void;
export type ChangeEventHandler<T> = (value: T) => void;

// Generic для lists
export interface ListState<T> {
	items: T[];
	isLoading: boolean;
	error: string | null;
	hasMore: boolean;
	total: number;
}

// Coordinates utility
export type Coordinates = [number, number];
export type Bounds = {
	northEast: Coordinates;
	southWest: Coordinates;
};

// Time utilities
export type Timestamp = number;
export type DateString = string;

// Generic для search/filter
export interface SearchFilters {
	query?: string;
	limit?: number;
	offset?: number;
	sortBy?: string;
	sortOrder?: 'asc' | 'desc';
}
