// Core Types для проекту

// Маркери
export type DataTypeOfMarkers = {
	id?: string;
	user_id?: string;
	name: string;
	type: string;
	latitude: number;
	longitude: number;
	description?: string;
	image?: string;
	typeOfMarker?: string;
	color?: string;
	created_at?: Date;
};

export type MarkerConfig = {
	color: string;
	gradient: string[];
	icon: string;
	backgroundColor: string;
	shadowColor: string;
};

// Користувачі
export type UserProfile = {
	id: string;
	username: string;
	email: string;
	avatar?: string;
	createdAt: Date;
	updatedAt: Date;
};

// Карта та навігація
export type Coordinates = [number, number];

export interface RouteData {
	routes?: Array<{
		geometry: {
			coordinates: Coordinates[];
		};
		duration: number;
		distance: number;
	}>;
}

// Re-export з інших файлів для зручності
export type {
	ApiError,
	// API Types
	ApiResponse,
	PaginatedResponse,
	RequestStatus,
} from "./api";
export type {
	// Auth Types
	AuthStatus,
	LoginCredentials,
	RegisterCredentials,
	UserWithPermissions,
} from "./auth";
export type {
	// Component Types
	BaseComponentProps,
	ComponentState,
	MarkerListProps,
} from "./components";
export type {
	MarkerFilter,
	MarkerStatus,
	MarkerType,
	MarkerWithConfig,
	MarkerWithLocation,
} from "./markers";

export type {
	FormField,
	FormState,
	ListState,
	// Utility Types
	PartialUpdate,
} from "./utils";
