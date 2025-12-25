import Constants from "expo-constants";

const mapboxToken = Constants.expoConfig?.extra?.MAPBOX_TOKEN;

const baseUrl = Constants.expoConfig?.extra?.BASE_URL;

export async function getDirections(
	from: [number, number],
	to: [number, number],
) {
	const url = `${baseUrl}/driving/${from[0]},${from[1]};${to[0]},${to[1]}?alternatives=true&annotations=distance%2Cduration&geometries=geojson&language=en&overview=full&steps=true&access_token=${mapboxToken}`;

	try {
		const response = await fetch(url);

		if (!response.ok) {
			const errorText = await response.text();
			console.error("Mapbox API Error:", response.status, errorText);
			return null;
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Fetch error in getDirections:", error);
		return null;
	}
}
