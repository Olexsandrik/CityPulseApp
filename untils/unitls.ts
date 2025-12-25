export const getMarkerColor = (type: string) => {
	switch (type) {
		case "music":
			return "#FF6B6B"; // Red
		case "food":
			return "#4ECDC4"; // Teal
		case "art":
			return "#45B7D1"; // Blue
		case "tech":
			return "#96CEB4"; // Green
		case "entertainment":
			return "#FFEAA7"; // Yellow
		default:
			return "#A8A8A8"; // Gray
	}
};

export const getMarkerConfig = (type: string) => {
	switch (type) {
		case "music":
			return {
				color: "#FF6B6B",
				gradient: ["#FF6B6B", "#FF3838"],
				icon: "musical-notes" as const,
				backgroundColor: "rgba(255, 107, 107, 0.15)",
				shadowColor: "#FF6B6B",
			};
		case "food":
			return {
				color: "#4ECDC4",
				gradient: ["#4ECDC4", "#00BFA5"],
				icon: "restaurant" as const,
				backgroundColor: "rgba(78, 205, 196, 0.15)",
				shadowColor: "#4ECDC4",
			};
		case "art":
			return {
				color: "#45B7D1",
				gradient: ["#45B7D1", "#0288D1"],
				icon: "color-palette" as const,
				backgroundColor: "rgba(69, 183, 209, 0.15)",
				shadowColor: "#45B7D1",
			};
		case "tech":
			return {
				color: "#96CEB4",
				gradient: ["#96CEB4", "#43A047"],
				icon: "hardware-chip" as const,
				backgroundColor: "rgba(150, 206, 180, 0.15)",
				shadowColor: "#96CEB4",
			};
		case "entertainment":
			return {
				color: "#FFEAA7",
				gradient: ["#FFEAA7", "#FFB300"],
				icon: "film" as const,
				backgroundColor: "rgba(255, 234, 167, 0.15)",
				shadowColor: "#FFEAA7",
			};
		default:
			return {
				color: "#9E9E9E",
				gradient: ["#9E9E9E", "#757575"],
				icon: "ellipse" as const,
				backgroundColor: "rgba(158, 158, 158, 0.15)",
				shadowColor: "#9E9E9E",
			};
	}
};

export const circleLayers: Array<{
	id: string;
	filter?: any;
	style: any;
}> = [
	{
		id: "events-circles",
		style: {
			circleRadius: 10,
			circleColor: [
				"match",
				["get", "type"],
				"music",
				"#FF6B6B",
				"food",
				"#4ECDC4",
				"art",
				"#45B7D1",
				"tech",
				"#96CEB4",
				"entertainment",
				"#FFEAA7",
				"#A8A8A8",
			],
			circleOpacity: 0.95, // Will be dynamic in component
			circleStrokeWidth: 2,
			circleStrokeColor: "#FFFFFF",
			circleStrokeOpacity: 0.8,
		},
	},
	{
		id: "events-inner-highlight",
		style: {
			circleRadius: 6,
			circleColor: "#FFFFFF",
			circleOpacity: 0.4, // Will be dynamic in component
		},
	},
];

export const markerTypes = [
	{ label: "Music", value: "music" },
	{ label: "Food", value: "food" },
	{ label: "Art", value: "art" },
	{ label: "Tech", value: "tech" },
	{ label: "Entertainment", value: "entertainment" },
	{ label: "Custom", value: "custom" },
];

export const colors = [
	{ label: "Red", value: "#FF4757" },
	{ label: "Blue", value: "#1976D2" },
	{ label: "Green", value: "#4CAF50" },
	{ label: "Yellow", value: "#FFC107" },
	{ label: "Purple", value: "#9C27B0" },
	{ label: "Orange", value: "#FF9800" },
];
