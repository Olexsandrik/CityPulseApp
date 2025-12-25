import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import supabase from "./api/supabase/supabase";
import AuthNavigation from "./Navigation/AuthNavigation";
import TabNavigation from "./Navigation/TabNavigation";
import { useAuthStore } from "./store/auth.store";

export default function App() {
	const { isAuthenticated, isLoading, loadStoredAuth } = useAuthStore();

	useEffect(() => {
		loadStoredAuth();

		(async () => {
			const session = await AsyncStorage.getItem("session_data");

			const sessionData = session ? JSON.parse(session) : null;
			if (sessionData) {
				const { error } = await supabase.auth.setSession({
					access_token: sessionData.access_token,
					refresh_token: sessionData.refresh_token,
				});
			}
		})();
	}, [loadStoredAuth]);

	if (isLoading) {
		return (
			<SafeAreaProvider>
				<View style={styles.loadingContainer}>
					<ActivityIndicator size="large" color="#3498db" />
				</View>
			</SafeAreaProvider>
		);
	}

	return (
		<NavigationContainer>
			<SafeAreaProvider>
				{isAuthenticated ? <TabNavigation /> : <AuthNavigation />}
			</SafeAreaProvider>
		</NavigationContainer>
	);
}

const styles = StyleSheet.create({
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "#f5f5f5",
	},
});
