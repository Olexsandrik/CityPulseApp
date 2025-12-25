import { createNativeStackNavigator } from "@react-navigation/native-stack";
import React from "react";
import Login from "../../Auth/Login";
import Register from "../../Auth/Register";

const Stack = createNativeStackNavigator();

export default function AuthNavigation() {
	return (
		<Stack.Navigator
			initialRouteName="Login"
			screenOptions={{
				headerShown: false,
			}}
		>
			<Stack.Screen name="Login" component={Login} />
			<Stack.Screen name="Register" component={Register} />
		</Stack.Navigator>
	);
}
