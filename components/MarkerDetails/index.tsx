import { Ionicons } from "@expo/vector-icons";

import { StyleSheet, Text, View } from "react-native";
import type { MarkerConfig } from "../../types/type";

export const MarkerDetails = ({
	config,
	selectedMarker,
}: {
	config: MarkerConfig;
	selectedMarker: {
		id: number;
		name: string;
		type: string;
		latitude: number;
		longitude: number;
	};
}) => {
	return (
		<View
			style={[
				styles.calloutContainer,
				{
					shadowColor: config.shadowColor,
					borderColor: config.color,
				},
			]}
		>
			<View style={styles.calloutHeader}>
				<View
					style={[
						styles.iconContainer,
						{
							backgroundColor: config.backgroundColor,
							borderWidth: 1,
							borderColor: config.color,
						},
					]}
				>
					<Ionicons name={config.icon as any} size={20} color={config.color} />
				</View>
				<View style={styles.calloutTextContainer}>
					<Text style={styles.calloutTitle} numberOfLines={2}>
						{selectedMarker.name}
					</Text>
					<Text style={[styles.calloutType, { color: config.color }]}>
						{selectedMarker.type.toUpperCase()}
					</Text>
				</View>
			</View>
			<View style={[styles.calloutArrow, { borderTopColor: config.color }]} />
		</View>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		padding: 16,
	},
	calloutContainer: {
		backgroundColor: "#FFFFFF",
		borderRadius: 16,
		padding: 0,
		minWidth: 200,
		maxWidth: 280,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.3,
		shadowRadius: 8,
		elevation: 8,
		borderWidth: 1,
		borderColor: "#F0F0F0",
	},
	calloutHeader: {
		flexDirection: "row",
		alignItems: "center",
		padding: 16,
		gap: 12,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		justifyContent: "center",
		alignItems: "center",
	},
	calloutTextContainer: {
		flex: 1,
	},
	calloutTitle: {
		fontSize: 16,
		fontWeight: "700",
		color: "#1A1A1A",
		lineHeight: 20,
		marginBottom: 4,
	},
	calloutType: {
		fontSize: 11,
		fontWeight: "600",
		textTransform: "uppercase",
		letterSpacing: 1,
	},
	calloutArrow: {
		position: "absolute",
		bottom: -8,
		left: "50%",
		marginLeft: -8,
		width: 0,
		height: 0,
		borderLeftWidth: 8,
		borderRightWidth: 8,
		borderTopWidth: 8,
		borderLeftColor: "transparent",
		borderRightColor: "transparent",
		borderTopColor: "#FFFFFF",
	},
});
