import "dotenv/config";

export default {
	expo: {
		name: "citypulseMain",
		slug: "citypulseMain",
		version: "1.0.0",
		orientation: "portrait",
		icon: "./assets/icon.png",
		userInterfaceStyle: "light",
		newArchEnabled: true,
		splash: {
			image: "./assets/splash-icon.png",
			resizeMode: "contain",
			backgroundColor: "#ffffff",
		},
		plugins: [
			[
				"@rnmapbox/maps",
				{
					RNMapboxMapsImpl: "mapbox",
					RNMapboxMapsVersion: "10.16.4",
				},
			],
			[
				"expo-location",
				{
					locationAlwaysAndWhenInUsePermission:
						"Allow $(PRODUCT_NAME) to use your location.",
				},
			],
		],
		ios: {
			supportsTablet: true,
			bundleIdentifier: "com.oleksandrik.citypulseMain",
		},
		android: {
			adaptiveIcon: {
				foregroundImage: "./assets/adaptive-icon.png",
				backgroundColor: "#ffffff",
			},
			edgeToEdgeEnabled: true,
			predictiveBackGestureEnabled: false,
			package: "com.oleksandrik.citypulseMain",
		},
		web: {
			favicon: "./assets/favicon.png",
		},
		extra: {
			MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
			BASE_URL: process.env.BASE_URL,
			BASE_URL_CATEGORIES: process.env.BASE_URL_CATEGORIES,
			SUPABASE_URL: process.env.SUPABASE_URL,
			PUBLISHABLE_API_KEY: process.env.PUBLISHABLE_API_KEY,
		},
		dotenv: false,
	},
};
