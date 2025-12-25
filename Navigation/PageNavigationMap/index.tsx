import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import CustomMarker from "../../components/CustomMarker";
import MapStack from "../TabComponents/MapStack";

const Navigation = createNativeStackNavigator<any>();
export default function PageNavigation() {
	return (
		<Navigation.Navigator>
			<Navigation.Screen
				name="MapStack"
				options={{ headerShown: false }}
				component={MapStack}
			/>
			<Navigation.Screen
				name="CustomMarker"
				options={{ headerShown: false }}
				component={CustomMarker}
			/>
		</Navigation.Navigator>
	);
}
