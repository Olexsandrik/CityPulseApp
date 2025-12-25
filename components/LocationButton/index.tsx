import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface LocationButtonProps {
	onPress: () => void;
}

export default function LocationButton({ onPress }: LocationButtonProps) {
	return (
		<TouchableOpacity
			style={styles.button}
			onPress={onPress}
			activeOpacity={0.8}
		>
			<Ionicons name="locate" size={24} color="#007AFF" />
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	button: {
		position: "absolute",
		bottom: 200,
		right: 20,
		backgroundColor: "rgba(255, 255, 255, 0.9)",
		borderRadius: 25,
		width: 50,
		height: 50,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
		zIndex: 1000,
	},
});
