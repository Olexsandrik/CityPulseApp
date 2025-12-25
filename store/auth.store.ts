import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { create } from "zustand";
import { supabase } from "../api/supabase/supabase";
import type { UserProfile } from "../types/type";

interface AuthState {
	user: UserProfile | null;
	token: string | null;
	isLoading: boolean;
	isAuthenticated: boolean;
	error: string | null;

	// Actions
	login: (email: string, password: string) => Promise<void>;
	register: (
		email: string,
		password: string,
		username: string,
	) => Promise<void>;
	logout: () => Promise<void>;
	loadStoredAuth: () => Promise<void>;
	pushProvider: () => Promise<void>;
	clearError: () => void;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "user_data";

const SESSION_KEY = "session_data";

export const useAuthStore = create<AuthState>((set, get) => ({
	user: null,
	token: null,
	isLoading: false,
	isAuthenticated: false,
	error: null,

	login: async (email: string, password: string) => {
		set({ isLoading: true, error: null });

		try {
			const { data, error } = await supabase.auth.signInWithPassword({
				email,
				password,
			});

			if (error) {
				set({ error: error.message, isLoading: false });
				return;
			}

			if (data.session) {
				await AsyncStorage.setItem(SESSION_KEY, JSON.stringify(data.session));
			}

			if (data.user && data.session) {
				const userProfile: UserProfile = {
					id: data.user.id,
					username: data.user.user_metadata?.username || email.split("@")[0],
					email: data.user.email || "",
					avatar: data.user.user_metadata?.avatar_url,
					createdAt: new Date(data.user.created_at || Date.now()),
					updatedAt: new Date(data.user.updated_at || Date.now()),
				};

				// Store token and user data
				await AsyncStorage.setItem(TOKEN_KEY, data.session.access_token);
				await AsyncStorage.setItem(USER_KEY, JSON.stringify(userProfile));

				set({
					user: userProfile,
					token: data.session.access_token,
					isAuthenticated: true,
					isLoading: false,
				});
			}
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "Login failed",
				isLoading: false,
			});
		}
	},

	register: async (email: string, password: string, username: string) => {
		set({ isLoading: true, error: null });

		try {
			const { data, error } = await supabase.auth.signUp({
				email,
				password,
				options: {
					data: {
						username,
					},
				},
			});

			if (error) {
				set({ error: error.message, isLoading: false });
				return;
			}

			if (data.user && data.session) {
				const userProfile: UserProfile = {
					id: data.user.id,
					username: username,
					email: data.user.email || "",
					avatar: data.user.user_metadata?.avatar_url,
					createdAt: new Date(data.user.created_at || Date.now()),
					updatedAt: new Date(data.user.updated_at || Date.now()),
				};

				// Store token and user data
				await AsyncStorage.setItem(TOKEN_KEY, data.session.access_token);
				await AsyncStorage.setItem(USER_KEY, JSON.stringify(userProfile));

				set({
					user: userProfile,
					token: data.session.access_token,
					isAuthenticated: true,
					isLoading: false,
				});
			} else {
				// User registered but needs email confirmation
				set({
					error: "Please check your email to confirm your account",
					isLoading: false,
				});
			}
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "Registration failed",
				isLoading: false,
			});
		}
	},

	logout: async () => {
		set({ isLoading: true });

		try {
			await supabase.auth.signOut();
			await AsyncStorage.removeItem(TOKEN_KEY);
			await AsyncStorage.removeItem(USER_KEY);

			set({
				user: null,
				token: null,
				isAuthenticated: false,
				isLoading: false,
				error: null,
			});
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "Logout failed",
				isLoading: false,
			});
		}
	},
	pushProvider: async () => {
		try {
			const { user } = get();
			if (!user?.id) {
				console.log("User not found");
				return;
			}

			async function registerPushToken() {
				if (!Device.isDevice) {
					console.log("Push only on real device");
					return;
				}

				const { status } = await Notifications.requestPermissionsAsync();

				if (status !== "granted") return;

				const token = (await Notifications.getExpoPushTokenAsync()).data;

				if (Platform.OS === "android") {
					await Notifications.setNotificationChannelAsync("default", {
						name: "default",
						importance: Notifications.AndroidImportance.MAX,
					});
				}

				await supabase.from("push_tokens").upsert({
					user_id: user?.id,
					token,
					platform: Platform.OS,
				});
			}

			registerPushToken();
		} catch (error) {
			set({
				error: error instanceof Error ? error.message : "Push provider failed",
				isLoading: false,
			});
		}
	},

	loadStoredAuth: async () => {
		try {
			const [token, userData] = await Promise.all([
				AsyncStorage.getItem(TOKEN_KEY),
				AsyncStorage.getItem(USER_KEY),
			]);

			if (token && userData) {
				const user = JSON.parse(userData);
				set({
					user,
					token,
					isAuthenticated: true,
				});
			}
		} catch (_error) {
			// Clear corrupted data
			await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
		}
	},

	clearError: () => {
		set({ error: null });
	},
}));
