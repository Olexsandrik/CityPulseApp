import type { DataTypeOfMarkers, MarkerConfig } from "./type";

// Union Types для маркерів
export type MarkerType = "restaurant" | "shop" | "park" | "transport" | "other";
export type MarkerStatus = "active" | "inactive" | "pending";

// Intersection Types - поєднання типів
export type MarkerWithLocation = DataTypeOfMarkers & {
	coordinates: [number, number];
	address?: string;
};

export type MarkerWithConfig = DataTypeOfMarkers & {
	config: MarkerConfig;
	isVisible: boolean;
};

// Generic для фільтрів
export type MarkerFilter =
	| { type: "all" }
	| { type: "byCategory"; category: MarkerType }
	| { type: "byDistance"; radius: number; center: [number, number] }
	| { type: "byUser"; userId: string };

// Utility Types для маркерів
export type PartialMarkerUpdate = Partial<Omit<DataTypeOfMarkers, "id">>;
export type MarkerCreateData = Omit<DataTypeOfMarkers, "id" | "created_at">;

// Generic для списків маркерів
export interface MarkerListState<T = DataTypeOfMarkers> {
	data: T[];
	isLoading: boolean;
	error: string | null;
	filters: MarkerFilter;
	total: number;
}
