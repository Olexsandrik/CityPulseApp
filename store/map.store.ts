import { create } from "zustand";
import { getDirections } from "../api/direction";
import type { DataTypeOfMarkers } from "../types/type";

type Coordinates = [number, number];

interface RouteData {
	routes?: Array<{
		geometry: {
			coordinates: Coordinates[];
		};
		duration: number;
		distance: number;
	}>;
}

interface MapState {
	userLocation: Coordinates | null;
	selectedCategory: Coordinates | null;
	dataDirections: RouteData | null;
	isLoadingRoute: boolean;
	error: string | null;
	markers: DataTypeOfMarkers[];

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
}

export const useMapStore = create<MapState>((set, get) => ({
	userLocation: null,
	selectedCategory: null,
	dataDirections: null,
	isLoadingRoute: false,
	error: null,

	markers: [],

	removeMarker: (marker: DataTypeOfMarkers) => {
		const markers = get().markers as DataTypeOfMarkers[];
		const result = markers.filter((m) => m.id !== marker.id);
		set({ markers: result as DataTypeOfMarkers[] });
	},

	setUserLocation: (coords: Coordinates) => set({ userLocation: coords }),
	setMarkers: (markers: DataTypeOfMarkers[]) => set({ markers }),
	setSelectedCategory: (coords: Coordinates) => {
		set({ selectedCategory: coords });

		get().fetchDirections();
	},

	addMarkers: (marker: DataTypeOfMarkers) => {
		const markers = get().markers as DataTypeOfMarkers[];

		const result = [...markers, marker] as DataTypeOfMarkers[];

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
}));
