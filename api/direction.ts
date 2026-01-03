import Constants from "expo-constants";
import type { Coordinates, RouteData, ApiResponse } from "../types/type";

const mapboxToken = Constants.expoConfig?.extra?.MAPBOX_TOKEN;
const baseUrl = Constants.expoConfig?.extra?.BASE_URL;

// Direction API Types
interface DirectionParams {
	from: Coordinates;
	to: Coordinates;
	profile?: 'driving' | 'walking' | 'cycling';
}

type DirectionResponse = ApiResponse<RouteData>;

// Union Types для помилок напрямків
type DirectionError =
	| { type: 'network'; message: string }
	| { type: 'invalid_coordinates'; message: string }
	| { type: 'api_error'; status: number; message: string }
	| { type: 'no_route_found'; message: string };

export async function getDirections(
	from: Coordinates,
	to: Coordinates,
): Promise<RouteData | null> {
	const url = `${baseUrl}/driving/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=true&annotations=distance%2Cduration&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxToken}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Mapbox API Error:", response.status, errorText);
			return null;
		}

		const data: RouteData = await response.json();
		return data;
	} catch (error) {
		console.error("Fetch error in getDirections:", error);
		return null;
	}
}

// Generic function для різних профілів маршрутів
export async function getDirectionsWithProfile(
	params: DirectionParams
): Promise<RouteData | null> {
	const profile = params.profile || 'driving';
	const url = `${baseUrl}/${profile}/${params.from[0]},${params.from[1]};${params.to[0]},${params.to[1]}?alternatives=true&annotations=distance%2Cduration&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxToken}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Mapbox API Error:", response.status, errorText);
			return null;
		}

		const data: RouteData = await response.json();
		return data;
	} catch (error) {
		console.error("Fetch error in getDirectionsWithProfile:", error);
		return null;
	}
}
