import { Ionicons } from "@expo/vector-icons";
import { type NavigationProp, useNavigation } from "@react-navigation/native";
import React, { useCallback, useRef } from "react";
import {
	Alert,
	Animated,
	Button,
	Image,
	PanResponder,
	Pressable,
	StyleSheet,
	Text,
	View,
} from "react-native";
import supabase from "../../api/supabase/supabase";
import { useMapStore } from "../../store/map.store";
import type { DataTypeOfMarkers } from "../../types/type";
import { getMarkerConfig } from "../../untils/unitls";

export type CardOfMarkersPropsNavigation = {
	ListOfMarkersDetails: { marker: DataTypeOfMarkers };
};
const CardOfMarkers = ({ marker }: { marker: DataTypeOfMarkers }) => {
	const { removeMarker } = useMapStore();
	const markerConfig = getMarkerConfig(marker.type || "default");

	const navigation =
		useNavigation<NavigationProp<CardOfMarkersPropsNavigation>>();
	const pan = useRef(new Animated.ValueXY()).current;
	const deleteOpacity = useRef(new Animated.Value(0)).current;

	const handleMarkerDetails = useCallback(() => {
		navigation.navigate("ListOfMarkersDetails", { marker });
	}, [marker, navigation]);

	const handleDeleteMarker = useCallback(async () => {
		try {
			const { error } = await supabase
				.from("markers")
				.delete()
				.eq("id", marker.id);
			if (error) {
				throw error;
			}
			removeMarker(marker);
		} catch (error) {
			console.error("Error deleting marker:", error);
		}
	}, [marker, removeMarker]);

	const confirmDelete = useCallback(() => {
		Alert.alert(
			"Delete Marker",
			"Are you sure you want to delete this marker?",
			[
				{ text: "Cancel", style: "cancel" },
				{
					text: "Delete",
					style: "destructive",
					onPress: () => handleDeleteMarker(),
				},
			],
		);
	}, [handleDeleteMarker]);

	const panResponder = useRef(
		PanResponder.create({
			onMoveShouldSetPanResponder: (_evt, gestureState) => {
				return Math.abs(gestureState.dx) > 20 && Math.abs(gestureState.dy) < 20;
			},
			onPanResponderGrant: () => {
				// No need to set offset for simple swipe
			},
			onPanResponderMove: (_evt, gestureState) => {
				if (gestureState.dx > 0) {
					pan.setValue({ x: gestureState.dx, y: 0 });
					const opacity = Math.min(gestureState.dx / 100, 1);
					deleteOpacity.setValue(opacity);
				}
			},
			onPanResponderRelease: (_evt, gestureState) => {
				if (gestureState.dx > 80) {
					// Swipe right far enough to trigger delete
					Animated.parallel([
						Animated.timing(pan, {
							toValue: { x: 300, y: 0 },
							duration: 200,
							useNativeDriver: false,
						}),
						Animated.timing(deleteOpacity, {
							toValue: 1,
							duration: 200,
							useNativeDriver: false,
						}),
					]).start(() => {
						confirmDelete();
						// Reset position after animation
						setTimeout(() => {
							Animated.parallel([
								Animated.timing(pan, {
									toValue: { x: 0, y: 0 },
									duration: 200,
									useNativeDriver: false,
								}),
								Animated.timing(deleteOpacity, {
									toValue: 0,
									duration: 200,
									useNativeDriver: false,
								}),
							]).start();
						}, 500);
					});
				} else {
					// Not far enough, snap back
					Animated.parallel([
						Animated.timing(pan, {
							toValue: { x: 0, y: 0 },
							duration: 200,
							useNativeDriver: false,
						}),
						Animated.timing(deleteOpacity, {
							toValue: 0,
							duration: 200,
							useNativeDriver: false,
						}),
					]).start();
				}
			},
		}),
	).current;

	return (
		<View style={styles.swipeContainer}>
			{/* Delete Action Background */}
			<Animated.View
				style={[
					styles.deleteAction,
					{
						opacity: deleteOpacity,
						transform: [
							{
								translateX: pan.x.interpolate({
									inputRange: [0, 100],
									outputRange: [-100, 0],
									extrapolate: "clamp",
								}),
							},
						],
					},
				]}
			>
				<Ionicons name="trash" size={24} color="#fff" />
				<Text style={styles.deleteText}>Delete</Text>
			</Animated.View>

			{/* Main Card */}
			<Animated.View
				style={{
					transform: [{ translateX: pan.x }],
				}}
				{...panResponder.panHandlers}
			>
				<Pressable
					style={[styles.container, { borderLeftColor: markerConfig.color }]}
					onPress={handleMarkerDetails}
				>
					{/* Header with type icon and color indicator */}
					<View style={styles.header}>
						<View
							style={[
								styles.typeIndicator,
								{ backgroundColor: markerConfig.color },
							]}
						>
							<Ionicons name={markerConfig.icon} size={16} color="#fff" />
						</View>
						<View style={styles.typeContainer}>
							<Text style={styles.typeText}>
								{marker.type?.toUpperCase() || "CUSTOM"}
							</Text>
						</View>
					</View>

					{/* Marker Name */}
					<Text style={styles.name} numberOfLines={2}>
						{marker.name}
					</Text>

					{/* Description */}
					{marker.description && (
						<Text style={styles.description} numberOfLines={2}>
							{marker.description}
						</Text>
					)}

					{/* Image */}
					{marker.image && (
						<Image source={{ uri: marker.image }} style={styles.markerImage} />
					)}

					{/* Footer with coordinates */}
					<View style={styles.footer}>
						<View style={styles.coordsContainer}>
							<Ionicons name="location" size={12} color="#666" />
							<Text style={styles.coordsText}>
								{marker.latitude.toFixed(4)}, {marker.longitude.toFixed(4)}
							</Text>
						</View>
						{marker.typeOfMarker && (
							<View
								style={[
									styles.categoryBadge,
									{ backgroundColor: markerConfig.backgroundColor },
								]}
							>
								<Text
									style={[styles.categoryText, { color: markerConfig.color }]}
								>
									{marker.typeOfMarker}
								</Text>
							</View>
						)}
					</View>
					<View style={styles.buttonContainer}>
						<Button title="Make Push notification" onPress={() => {}} />
					</View>
				</Pressable>
			</Animated.View>
		</View>
	);
};

const styles = StyleSheet.create({
	buttonContainer: {
		padding: 16,
	},
	swipeContainer: {
		position: "relative",
		marginVertical: 6,
		marginHorizontal: 2,
	},
	deleteAction: {
		position: "absolute",
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: "#ff4444",
		width: 100,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 16,
		zIndex: 1,
	},
	deleteText: {
		color: "#fff",
		fontSize: 12,
		fontWeight: "600",
		marginTop: 4,
	},
	container: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 16,
		borderLeftWidth: 4,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
		borderWidth: 1,
		borderColor: "#f0f0f0",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	typeIndicator: {
		width: 28,
		height: 28,
		borderRadius: 14,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	typeContainer: {
		flex: 1,
	},
	typeText: {
		fontSize: 11,
		fontWeight: "700",
		color: "#666",
		letterSpacing: 0.5,
	},
	name: {
		fontSize: 18,
		fontWeight: "700",
		color: "#1a1a1a",
		marginBottom: 8,
		lineHeight: 22,
	},
	description: {
		fontSize: 14,
		color: "#666",
		lineHeight: 18,
		marginBottom: 12,
	},
	markerImage: {
		width: "100%",
		height: 120,
		borderRadius: 8,
		marginBottom: 12,
		backgroundColor: "#f5f5f5",
	},
	footer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	coordsContainer: {
		flexDirection: "row",
		alignItems: "center",
		flex: 1,
	},
	coordsText: {
		fontSize: 12,
		color: "#666",
		marginLeft: 4,
		fontFamily: "monospace",
	},
	categoryBadge: {
		paddingHorizontal: 8,
		paddingVertical: 4,
		borderRadius: 12,
		marginLeft: 8,
	},
	categoryText: {
		fontSize: 11,
		fontWeight: "600",
	},
});

export default CardOfMarkers;
