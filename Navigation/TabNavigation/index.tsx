import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useEffect } from "react";
import supabase from "../../api/supabase/supabase";
import { useMapStore } from "../../store/map.store";
import type { DataTypeOfMarkers } from "../../types/type";
import PageNavigationAlert from "../PageNavigationAlert";
import PageNavigation from "../PageNavigationMap";
import ProfileTab from "../TabComponents/ProfileTab";

const Tab = createBottomTabNavigator();
export default function TabNavigation() {
	const { setMarkers } = useMapStore();
	useEffect(() => {
		let channel: ReturnType<typeof supabase.channel> | null = null;

		const init = async () => {
			try {
				// Fetch initial data
				const { data, error } = await supabase.from("markers").select("*");

				if (error) {
					console.error("Initial fetch error:", error);
					return;
				}

				// Set initial markers
				setMarkers(data || []);

				// Create and subscribe to real-time channel
				channel = supabase.channel("custom-all-channel");

				channel.on(
					"postgres_changes",
					{
						event: "*",
						schema: "public",
						table: "markers",
					},
					(payload: any) => {
						console.log(
							"Real-time event received:",
							payload.eventType,
							payload,
						);

						// Use the store's set function directly to access previous state
						useMapStore.setState((state) => {
							const prev = state.markers || [];
							let newMarkers: DataTypeOfMarkers[];

							switch (payload.eventType) {
								case "INSERT":
									console.log("Adding new marker:", payload.new);
									newMarkers = [...prev, payload.new as DataTypeOfMarkers];
									break;

								case "UPDATE":
									console.log("Updating marker:", payload.new);
									newMarkers = prev.map((marker: DataTypeOfMarkers) =>
										marker.id === payload.new.id
											? (payload.new as DataTypeOfMarkers)
											: marker,
									);
									break;

								case "DELETE":
									console.log(
										"Deleting marker with ID:",
										payload.old?.id,
										"type:",
										typeof payload.old?.id,
									);
									console.log("Current markers before delete:", prev.length);
									console.log(
										"Sample marker ID:",
										prev[0]?.id,
										"type:",
										typeof prev[0]?.id,
									);

									newMarkers = prev.filter((marker: DataTypeOfMarkers) => {
										// Ensure both IDs are compared as strings to handle type mismatches
										const markerId = String(marker.id);
										const deleteId = String(payload.old?.id);
										const shouldKeep = markerId !== deleteId;

										if (!shouldKeep) {
											console.log(
												"Removing marker:",
												marker.id,
												"matches delete ID:",
												payload.old?.id,
											);
										}
										return shouldKeep;
									});
									console.log("Markers after delete:", newMarkers.length);
									break;

								default:
									console.log("Unknown event type:", payload.eventType);
									newMarkers = prev;
							}

							return { markers: newMarkers };
						});
					},
				);

				// Subscribe to the channel
				channel.subscribe();
			} catch (error) {
				console.error("Error fetching markers:", error);
			}
		};

		init();

		// Cleanup function to unsubscribe when component unmounts
		return () => {
			if (channel) {
				supabase.removeChannel(channel);
			}
		};
	}, [setMarkers]);
	return (
		<Tab.Navigator>
			<Tab.Screen
				name="Profile"
				component={ProfileTab}
				options={{
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="person-outline" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="Alerts"
				component={PageNavigationAlert}
				options={{
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="notifications-outline" color={color} size={size} />
					),
				}}
			/>
			<Tab.Screen
				name="Map"
				component={PageNavigation}
				options={{
					headerShown: false,
					tabBarIcon: ({ color, size }) => (
						<Ionicons name="map-outline" color={color} size={size} />
					),
				}}
			/>
		</Tab.Navigator>
	);
}
