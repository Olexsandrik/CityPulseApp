import { Ionicons } from "@expo/vector-icons";
import {
	type NavigationProp,
	type RouteProp,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import React from "react";
import {
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	View,
} from "react-native";
import type { DataTypeOfMarkers } from "../../types/type";
import { getMarkerConfig } from "../../untils/unitls";

export type ListOfMarkersDetailsPropsNavigation = {
	ListOfMarkersDetails: { marker: DataTypeOfMarkers };
};

const ListOfMarkersDetails = () => {
	const navigation =
		useNavigation<NavigationProp<ListOfMarkersDetailsPropsNavigation>>();
	const { marker } =
		useRoute<RouteProp<ListOfMarkersDetailsPropsNavigation>>().params;

	const markerConfig = getMarkerConfig(marker.type || "default");

	const handleGoBack = () => {
		navigation.goBack();
	};

	console.log("marker.description", marker.description);
	return (
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			{/* Header */}
			<View style={styles.header}>
				<Pressable onPress={handleGoBack} style={styles.backButton}>
					<Ionicons name="arrow-back" size={24} color="#1a1a1a" />
				</Pressable>
				<View style={styles.headerContent}>
					<Text style={styles.headerTitle}>Marker Details</Text>
				</View>
			</View>

			{/* Main Content */}
			<View style={styles.content}>
				{/* Marker Name Card */}
				<View style={styles.nameCard}>
					<View
						style={[styles.typeBadge, { backgroundColor: markerConfig.color }]}
					>
						<Ionicons name={markerConfig.icon} size={20} color="#fff" />
					</View>
					<View style={styles.nameContent}>
						<Text style={styles.markerName}>{marker.name}</Text>
						<Text style={styles.markerType}>
							{marker.type?.toUpperCase() || "CUSTOM"}
						</Text>
					</View>
				</View>

				{/* Image Section */}
				{marker.image && (
					<View style={styles.imageSection}>
						<View style={styles.sectionHeader}>
							<Ionicons name="image" size={18} color="#666" />
							<Text style={styles.sectionTitle}>Image</Text>
						</View>
						<Image source={{ uri: marker.image }} style={styles.markerImage} />
					</View>
				)}

				{/* Details Section */}
				<View style={styles.detailsSection}>
					<View style={styles.sectionHeader}>
						<Ionicons name="information-circle" size={18} color="#666" />
						<Text style={styles.sectionTitle}>Details</Text>
					</View>

					{/* Description */}
					{marker.description && marker.description.length > 0 && (
						<View style={styles.detailItem}>
							<View style={styles.detailLabel}>
								<Ionicons name="document-text" size={16} color="#666" />
								<Text style={styles.detailLabelText}>Description</Text>
							</View>
							<Text style={styles.detailValue}>{marker.description}</Text>
						</View>
					)}

					{/* Category */}
					{marker.typeOfMarker && (
						<View style={styles.detailItem}>
							<View style={styles.detailLabel}>
								<Ionicons name="pricetag" size={16} color="#666" />
								<Text style={styles.detailLabelText}>Category</Text>
							</View>
							<View
								style={[
									styles.categoryTag,
									{ backgroundColor: markerConfig.backgroundColor },
								]}
							>
								<Text
									style={[styles.categoryText, { color: markerConfig.color }]}
								>
									{marker.typeOfMarker}
								</Text>
							</View>
						</View>
					)}

					{/* Location */}
					<View style={styles.detailItem}>
						<View style={styles.detailLabel}>
							<Ionicons name="location" size={16} color="#666" />
							<Text style={styles.detailLabelText}>Location</Text>
						</View>
						<View style={styles.coordsContainer}>
							<Text style={styles.coordsText}>
								Latitude: {marker.latitude.toFixed(6)}
							</Text>
							<Text style={styles.coordsText}>
								Longitude: {marker.longitude.toFixed(6)}
							</Text>
						</View>
					</View>

					{/* Color */}
					{marker.color && (
						<View style={styles.detailItem}>
							<View style={styles.detailLabel}>
								<Ionicons name="color-palette" size={16} color="#666" />
								<Text style={styles.detailLabelText}>Color</Text>
							</View>
							<View style={styles.colorContainer}>
								<View
									style={[
										styles.colorPreview,
										{ backgroundColor: marker.color },
									]}
								/>
								<Text style={styles.colorHex}>{marker.color}</Text>
							</View>
						</View>
					)}
				</View>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 20,
		paddingVertical: 16,
		paddingTop: 50,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	backButton: {
		padding: 8,
		marginRight: 16,
		borderRadius: 8,
		backgroundColor: "#f8f9fa",
	},
	headerContent: {
		flex: 1,
	},
	headerTitle: {
		fontSize: 20,
		fontWeight: "700",
		color: "#1a1a1a",
		textAlign: "center",
	},
	content: {
		padding: 20,
	},
	nameCard: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
		flexDirection: "row",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	typeBadge: {
		width: 50,
		height: 50,
		borderRadius: 25,
		justifyContent: "center",
		alignItems: "center",
		marginRight: 16,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
	},
	nameContent: {
		flex: 1,
	},
	markerName: {
		fontSize: 24,
		fontWeight: "700",
		color: "#1a1a1a",
		marginBottom: 4,
	},
	markerType: {
		fontSize: 12,
		fontWeight: "600",
		color: "#666",
		letterSpacing: 1,
		textTransform: "uppercase",
	},
	imageSection: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
	},
	sectionTitle: {
		fontSize: 16,
		fontWeight: "600",
		color: "#1a1a1a",
		marginLeft: 8,
	},
	markerImage: {
		width: "100%",
		height: 200,
		borderRadius: 12,
		backgroundColor: "#f5f5f5",
	},
	detailsSection: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	detailItem: {
		marginBottom: 20,
	},
	detailLabel: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	detailLabelText: {
		fontSize: 14,
		fontWeight: "600",
		color: "black",
		marginLeft: 8,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	detailValue: {
		fontSize: 16,
		color: "#1a1a1a",
		lineHeight: 22,
	},
	categoryTag: {
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		alignSelf: "flex-start",
	},
	categoryText: {
		fontSize: 14,
		fontWeight: "600",
	},
	coordsContainer: {
		backgroundColor: "#f8f9fa",
		padding: 12,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#e9ecef",
	},
	coordsText: {
		fontSize: 14,
		color: "#1a1a1a",
		fontFamily: "monospace",
		marginBottom: 4,
	},
	colorContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	colorPreview: {
		width: 32,
		height: 32,
		borderRadius: 16,
		marginRight: 12,
		borderWidth: 2,
		borderColor: "#e9ecef",
	},
	colorHex: {
		fontSize: 14,
		color: "#666",
		fontFamily: "monospace",
		fontWeight: "600",
	},
});

export default ListOfMarkersDetails;
