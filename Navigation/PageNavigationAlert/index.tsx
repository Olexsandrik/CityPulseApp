import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import ListOfMarkers from "../../components/ListOfMarkers";
import ListOfMarkersDetails from "../../components/ListOfMarkersDetails";

const Navigation = createNativeStackNavigator<any>();
export default function PageNavigationAlert() {
	return (
		<Navigation.Navigator>
			<Navigation.Screen
				name="ListOfMarkers"
				options={{ headerShown: false }}
				component={ListOfMarkers}
			/>
			<Navigation.Screen
				name="ListOfMarkersDetails"
				options={{ headerShown: false }}
				component={ListOfMarkersDetails}
			/>
		</Navigation.Navigator>
	);
}
