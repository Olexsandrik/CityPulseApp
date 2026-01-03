import { create } from "zustand";
import { getDirections } from "../api/direction";
import supabase from "../api/supabase/supabase";
import type {
	DataTypeOfMarkers,
	Coordinates,
	RouteData,
	ListState,
	MarkerFilter
} from "../types/type";

// Union Types для стану карти
type MapError =
	| { type: 'network'; message: string }
	| { type: 'location'; message: string }
	| { type: 'api'; status: number; message: string };

// Generic interface для map state
interface MapState extends ListState<DataTypeOfMarkers> {
	userLocation: Coordinates | null;
	selectedCategory: Coordinates | null;
	dataDirections: RouteData | null;
	isLoadingRoute: boolean;
	filters: MarkerFilter;

	// Actions
	setUserLocation: (coords: Coordinates) => void;
	setMarkers: (markers: DataTypeOfMarkers[]) => void;
	setSelectedCategory: (coords: Coordinates) => void;
	fetchDirections: () => Promise<void>;
	setDataDirections: (data: RouteData) => void;
	setError: (error: string | null) => void;
	clearDataDirections: () => void;
	clearUserLocation: () => void;
	addMarkers: (marker: DataTypeOfMarkers) => void;
	clearError: () => void;
	removeMarker: (marker: DataTypeOfMarkers) => void;
	refreshMarkers: () => Promise<void>;
	setFilters: (filters: MarkerFilter) => void;
}

export const useMapStore = create<MapState>((set, get) => ({
	userLocation: null,
	selectedCategory: null,
	dataDirections: null,
	isLoadingRoute: false,
	error: null,

	// ListState implementation
	items: [],
	isLoading: false,
	hasMore: false,
	total: 0,

	// Map specific
	markers: [],
	filters: { type: 'all' },

	removeMarker: (marker: DataTypeOfMarkers) => {
		const markers = get().markers || [];
		const result = markers.filter((m) => m.id !== marker.id);
		set({ markers: result });
	},

	setUserLocation: (coords: Coordinates) => set({ userLocation: coords }),
	setMarkers: (markers: DataTypeOfMarkers[]) => set({ markers }),
	setSelectedCategory: (coords: Coordinates) => {
		set({ selectedCategory: coords });

		get().fetchDirections();
	},

	addMarkers: (marker: DataTypeOfMarkers) => {
		const markers = get().markers || [];

		const result = [...markers, marker];

		set({
			markers: result,
		});
	},

	fetchDirections: async () => {
		const { selectedCategory, userLocation } = get();
		if (!selectedCategory || !userLocation) return;

		set({ isLoadingRoute: true, error: null });
		try {
			const data = await getDirections(userLocation, selectedCategory);
			set({
				dataDirections: data,
				isLoadingRoute: false,
			});
		} catch (error) {
			set({
				error:
					error instanceof Error ? error.message : "Failed to fetch directions",
				isLoadingRoute: false,
				dataDirections: null,
			});
		}
	},

	setDataDirections: (data: RouteData) => set({ dataDirections: data }),
	setError: (error: string | null) => set({ error }),
	clearDataDirections: () => set({ dataDirections: null }),
	clearUserLocation: () => set({ userLocation: null }),
	clearError: () => set({ error: null }),

	refreshMarkers: async () => {
		try {
			const { data, error } = await supabase.from("markers").select("*");
			if (error) {
				console.error("Error refreshing markers:", error);
				return;
			}
			set({ markers: data || [], items: data || [] });
		} catch (error) {
			console.error("Failed to refresh markers:", error);
		}
	},

	setFilters: (filters: MarkerFilter) => {
		set({ filters });
		// Можна додати логіку для фільтрації існуючих маркерів
	},
}));
