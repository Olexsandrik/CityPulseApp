// API Response Types
export interface ApiResponse<T> {
	success: boolean;
	error?: string;
	data: T;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
	total: number;
	page: number;
	limit: number;
}

// Union Types для помилок
export type ApiError =
	| { type: 'network'; message: string }
	| { type: 'validation'; field: string; message: string }
	| { type: 'auth'; message: string }
	| { type: 'server'; status: number; message: string };

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | 'rejected';

// Generic для API calls
export interface ApiHookReturn<TData, TParams = void> {
	data: TData | null;
	isLoading: boolean;
	error: string | null;
	refetch: (params?: TParams) => Promise<void>;
}

// Utility types для API
export type ApiEndpoint<TRequest = any, TResponse = any> = {
	request: TRequest;
	response: TResponse;
};

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Generic для form submissions
export interface FormSubmissionResult<T> {
	success: boolean;
	data?: T;
	errors?: Record<string, string[]>;
}
