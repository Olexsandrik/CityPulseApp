import { FlatList, StyleSheet, Text, View } from "react-native";
import { useMapStore } from "../../store/map.store";
import type { DataTypeOfMarkers } from "../../types/type";
import CardOfMarkers from "../CardOfMarkers";

export default function ListOfMarkers() {
	const { markers } = useMapStore();

	if (!markers || markers.length === 0) {
		return (
			<View style={[styles.container, styles.emptyContainer]}>
				<View>
					<Text style={styles.emptyText}>No markers yet</Text>
					<Text style={styles.emptySubtext}>
						Create your first custom marker to get started exploring your map!
					</Text>
				</View>
			</View>
		);
	}

	return (
		<View style={styles.container}>
			{markers.length > 0 ? (
				<FlatList
					data={markers}
					renderItem={({ item }: { item: DataTypeOfMarkers }) => (
						<CardOfMarkers marker={item} />
					)}
					keyExtractor={(item, index) => `${item.id}-${index}`}
					contentContainerStyle={styles.list}
					showsVerticalScrollIndicator={false}
				/>
			) : (
				<View style={styles.emptyContainer}>
					<Text style={styles.emptyText}>No markers yet</Text>
					<Text style={styles.emptySubtext}>
						Create your first custom marker to get started exploring your map!
					</Text>
				</View>
			)}
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
		paddingTop: 35,
	},
	list: {
		padding: 16,
	},
	emptyContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 32,
	},
	emptyText: {
		fontSize: 18,
		color: "#666",
		textAlign: "center",
		marginBottom: 8,
	},
	emptySubtext: {
		fontSize: 14,
		color: "#999",
		textAlign: "center",
		lineHeight: 20,
	},
});
