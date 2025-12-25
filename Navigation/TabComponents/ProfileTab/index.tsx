import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState } from "react";
import {
	Alert,
	Button,
	Image,
	Pressable,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	View,
} from "react-native";
import { useAuthStore } from "../../../store/auth.store";
import type { UserProfile } from "../../../types/type";

export default function ProfileTab() {
	// Mock user data
	const [userProfile, setUserProfile] = useState<UserProfile>({
		id: "user_123",
		username: "John Doe",
		email: "john.doe@example.com",
		avatar: "https://randomuser.me/api/portraits/men/32.jpg",
		createdAt: new Date("2024-01-15"),
		updatedAt: new Date(),
	});

	const [isEditing, setIsEditing] = useState(false);
	const [editedUsername, setEditedUsername] = useState(userProfile.username);
	const [editedEmail, setEditedEmail] = useState(userProfile.email);

	const { logout } = useAuthStore();

	const handleSaveProfile = () => {
		// Validate inputs
		if (!editedUsername.trim()) {
			Alert.alert("Error", "Username cannot be empty");
			return;
		}

		if (!editedEmail.trim() || !editedEmail.includes("@")) {
			Alert.alert("Error", "Please enter a valid email address");
			return;
		}

		// Update profile
		setUserProfile({
			...userProfile,
			username: editedUsername.trim(),
			email: editedEmail.trim(),
			updatedAt: new Date(),
		});

		setIsEditing(false);
		Alert.alert("Success", "Profile updated successfully!");
	};

	const handleCancelEdit = () => {
		setEditedUsername(userProfile.username);
		setEditedEmail(userProfile.email);
		setIsEditing(false);
	};

	const handleAvatarChange = () => {
		Alert.alert("Change Avatar", "Choose an option", [
			{ text: "Take Photo", onPress: () => console.log("Take photo") },
			{
				text: "Choose from Gallery",
				onPress: () => console.log("Choose from gallery"),
			},
			{ text: "Cancel", style: "cancel" },
		]);
	};

	const handleLogout = async () => {
		await AsyncStorage.removeItem("user");
		await logout();
	};
	return (
		<ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
			{/* Header */}
			<View style={styles.header}>
				<Text style={styles.headerTitle}>Profile</Text>
				{!isEditing && (
					<Pressable
						style={styles.editButton}
						onPress={() => setIsEditing(true)}
					>
						<Ionicons name="pencil" size={20} color="#007AFF" />
						<Text style={styles.editButtonText}>Edit</Text>
					</Pressable>
				)}
			</View>

			{/* Profile Content */}
			<View style={styles.content}>
				{/* Avatar Section */}
				<View style={styles.avatarSection}>
					<View style={styles.avatarContainer}>
						<Image source={{ uri: userProfile.avatar }} style={styles.avatar} />
						{isEditing && (
							<Pressable
								style={styles.avatarOverlay}
								onPress={handleAvatarChange}
							>
								<Ionicons name="camera" size={24} color="#fff" />
							</Pressable>
						)}
					</View>
					<Text style={styles.avatarHint}>
						{isEditing ? "Tap to change photo" : "Profile Photo"}
					</Text>
				</View>

				{/* Profile Form */}
				<View style={styles.formSection}>
					{/* Username Field */}
					<View style={styles.inputGroup}>
						<View style={styles.inputLabel}>
							<Ionicons name="person" size={18} color="#666" />
							<Text style={styles.inputLabelText}>Username</Text>
						</View>
						{isEditing ? (
							<TextInput
								style={styles.textInput}
								value={editedUsername}
								onChangeText={setEditedUsername}
								placeholder="Enter your username"
								autoCapitalize="words"
							/>
						) : (
							<Text style={styles.displayText}>{userProfile.username}</Text>
						)}
					</View>

					{/* Email Field */}
					<View style={styles.inputGroup}>
						<View style={styles.inputLabel}>
							<Ionicons name="mail" size={18} color="#666" />
							<Text style={styles.inputLabelText}>Email</Text>
						</View>
						{isEditing ? (
							<TextInput
								style={styles.textInput}
								value={editedEmail}
								onChangeText={setEditedEmail}
								placeholder="Enter your email"
								keyboardType="email-address"
								autoCapitalize="none"
							/>
						) : (
							<Text style={styles.displayText}>{userProfile.email}</Text>
						)}
					</View>

					{/* Account Info */}
					<View style={styles.infoSection}>
						<View style={styles.infoItem}>
							<Ionicons name="calendar" size={16} color="#666" />
							<Text style={styles.infoLabel}>Member since:</Text>
							<Text style={styles.infoValue}>
								{userProfile.createdAt.toLocaleDateString()}
							</Text>
						</View>
						<View style={styles.infoItem}>
							<Ionicons name="time" size={16} color="#666" />
							<Text style={styles.infoLabel}>Last updated:</Text>
							<Text style={styles.infoValue}>
								{userProfile.updatedAt.toLocaleDateString()}
							</Text>
						</View>
					</View>
				</View>

				{/* Action Buttons */}
				{isEditing && (
					<View style={styles.buttonSection}>
						<Pressable style={styles.cancelButton} onPress={handleCancelEdit}>
							<Text style={styles.cancelButtonText}>Cancel</Text>
						</Pressable>
						<Pressable style={styles.saveButton} onPress={handleSaveProfile}>
							<Ionicons name="checkmark" size={18} color="#fff" />
							<Text style={styles.saveButtonText}>Save Changes</Text>
						</Pressable>
					</View>
				)}
			</View>

			<Button title="Logout" onPress={handleLogout} />
		</ScrollView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f8f9fa",
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "space-between",
		paddingHorizontal: 20,
		paddingVertical: 16,
		paddingTop: 50,
		backgroundColor: "#fff",
		borderBottomWidth: 1,
		borderBottomColor: "#e9ecef",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.05,
		shadowRadius: 4,
		elevation: 3,
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "700",
		color: "#1a1a1a",
	},
	editButton: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 12,
		paddingVertical: 6,
		borderRadius: 20,
		backgroundColor: "#f0f8ff",
		borderWidth: 1,
		borderColor: "#007AFF",
	},
	editButtonText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#007AFF",
		marginLeft: 4,
	},
	content: {
		padding: 20,
	},
	avatarSection: {
		alignItems: "center",
		marginBottom: 32,
	},
	avatarContainer: {
		position: "relative",
		marginBottom: 12,
	},
	avatar: {
		width: 120,
		height: 120,
		borderRadius: 60,
		borderWidth: 3,
		borderColor: "#fff",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.2,
		shadowRadius: 8,
		elevation: 6,
	},
	avatarOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: "rgba(0, 0, 0, 0.6)",
		borderRadius: 60,
		justifyContent: "center",
		alignItems: "center",
	},
	avatarHint: {
		fontSize: 14,
		color: "#666",
		fontWeight: "500",
	},
	formSection: {
		backgroundColor: "#fff",
		borderRadius: 16,
		padding: 20,
		marginBottom: 20,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	inputGroup: {
		marginBottom: 24,
	},
	inputLabel: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	inputLabelText: {
		fontSize: 14,
		fontWeight: "600",
		color: "#1a1a1a",
		marginLeft: 8,
		textTransform: "uppercase",
		letterSpacing: 0.5,
	},
	textInput: {
		borderWidth: 1,
		borderColor: "#e9ecef",
		borderRadius: 12,
		paddingHorizontal: 16,
		paddingVertical: 14,
		fontSize: 16,
		color: "#1a1a1a",
		backgroundColor: "#f8f9fa",
	},
	displayText: {
		fontSize: 16,
		color: "#1a1a1a",
		paddingVertical: 14,
		paddingHorizontal: 16,
		backgroundColor: "#f8f9fa",
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "transparent",
	},
	infoSection: {
		borderTopWidth: 1,
		borderTopColor: "#e9ecef",
		paddingTop: 20,
	},
	infoItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 12,
	},
	infoLabel: {
		fontSize: 14,
		color: "#666",
		marginLeft: 8,
		flex: 1,
	},
	infoValue: {
		fontSize: 14,
		color: "#1a1a1a",
		fontWeight: "500",
	},
	buttonSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		gap: 12,
	},
	cancelButton: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 12,
		borderWidth: 1,
		borderColor: "#e9ecef",
		backgroundColor: "#fff",
		alignItems: "center",
	},
	cancelButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#666",
	},
	saveButton: {
		flex: 1,
		paddingVertical: 14,
		paddingHorizontal: 20,
		borderRadius: 12,
		backgroundColor: "#007AFF",
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#007AFF",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 4,
		elevation: 3,
	},
	saveButtonText: {
		fontSize: 16,
		fontWeight: "600",
		color: "#fff",
		marginLeft: 8,
	},
});
