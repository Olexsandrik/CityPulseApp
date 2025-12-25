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
		try {
			(async () => {
				const { data } = await supabase.from("markers").select("*");
				setMarkers(data || ([] as DataTypeOfMarkers[]));
			})();
		} catch (error) {
			console.error("Error fetching markers:", error);
		}
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
