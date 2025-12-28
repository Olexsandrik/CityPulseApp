import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	type NavigationProp,
	type RouteProp,
	useNavigation,
	useRoute,
} from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { Controller, useForm } from "react-hook-form";
import {
	Alert,
	Button,
	Image,
	ScrollView,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { uploadFile } from "../../api/supabase/store";
import supabase from "../../api/supabase/supabase";
import { useSendDataToN8N } from "../../service/useSendDataToN8N";
import { useMapStore } from "../../store/map.store";
import type { DataTypeOfMarkers } from "../../types/type";
import { colors, markerTypes } from "../../untils/unitls";

type MarkerFormData = Omit<DataTypeOfMarkers, "id">;

export type CustomMarkerPropsNavigation = {
	CustomMarker: { coordinates: [number, number] };
};

const CustomMarker = () => {
	const navigation =
		useNavigation<NavigationProp<CustomMarkerPropsNavigation>>();
	const route = useRoute<RouteProp<CustomMarkerPropsNavigation>>();
	const { sendDataToN8N } = useSendDataToN8N();
	const { addMarkers } = useMapStore();
	const { coordinates } = route.params || {};

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset,
		setValue,
		watch,
	} = useForm<MarkerFormData>({
		defaultValues: {
			name: "",
			type: "",
			latitude: coordinates?.[1] || 0,
			longitude: coordinates?.[0] || 0,
			description: "",
			image: "",
			typeOfMarker: "",
		},
	});

	const watchedImage = watch("image");

	const onSubmit = async (data: MarkerFormData) => {
		const user = await AsyncStorage.getItem("user_data");

		const userId = JSON.parse(user || "").id;

		try {
			const newMarker: DataTypeOfMarkers = {
				user_id: userId,
				name: data.name,
				type: data.type,
				latitude: coordinates?.[1] || data.latitude,
				description: data.description,
				longitude: coordinates?.[0] || data.longitude,
				image: data.image || "",
				typeOfMarker: "custom",
			};

			const { data: markerId, error } = await supabase
				.from("markers")
				.insert(newMarker)
				.select("id");
			if (error) {
				throw error;
			}

			// Set the ID from the database response
			const markerWithId = { ...newMarker, id: markerId[0].id };

			await sendDataToN8N({ data: { markerId: markerId[0].id, userId } });

			addMarkers(markerWithId);
			navigation.goBack();
			Alert.alert("Success", "Marker created successfully!");
			reset();
		} catch (error) {
			Alert.alert("Error", "Failed to create marker");

			console.error("Marker creation error:", error);
		}
	};

	const takePhoto = async () => {
		try {
			// Request permissions
			const permission =
				await ImagePicker.requestMediaLibraryPermissionsAsync();
			if (!permission.granted) {
				Alert.alert(
					"Permission denied",
					"Media library permission is required to select photos",
				);
				return;
			}

			// Launch image picker
			const result = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1], // Square aspect for avatar
				quality: 0.8,
			});

			if (!result.canceled && result.assets && result.assets[0]) {
				const localUri = result.assets[0].uri;

				// Show loading indicator (you can add a loading state)
				Alert.alert("Uploading...", "Please wait while we upload your image");

				// Upload to Supabase Storage
				const uploadResult = await uploadFile(localUri, {
					fileName: `marker_${Date.now()}_${Math.random().toString(36).substring(2, 15)}.png`,
				});

				if (uploadResult.success && uploadResult.url) {
					// Set the uploaded URL in the form
					setValue("image", uploadResult.url, {
						shouldValidate: false,
						shouldDirty: true,
						shouldTouch: true,
					});

					Alert.alert("Success", "Image uploaded successfully!");
				} else {
					Alert.alert(
						"Upload Failed",
						uploadResult.error || "Failed to upload image",
					);
				}
			}
		} catch (error) {
			console.error("Photo selection/upload error:", error);
			Alert.alert("Error", "Failed to select or upload photo");
		}
	};

	return (
		<ScrollView style={styles.container}>
			<View style={styles.form}>
				{/* Name Input */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Marker Name *</Text>
					<Controller
						control={control}
						rules={{ required: "Name is required" }}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={[styles.input, errors.name && styles.inputError]}
								placeholder="Enter marker name"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								maxLength={50}
							/>
						)}
						name="name"
					/>
					{errors.name && (
						<Text style={styles.errorText}>{errors.name.message}</Text>
					)}
				</View>

				<View style={styles.inputGroup}>
					<Text style={styles.label}>Marker Type *</Text>
					<View style={styles.typeButtons}>
						{markerTypes.map((type) => (
							<Controller
								key={type.value}
								control={control}
								rules={{ required: "Type is required" }}
								render={({ field: { onChange, value } }) => (
									<TouchableOpacity
										style={[
											styles.typeButton,
											value === type.value && styles.typeButtonSelected,
										]}
										onPress={() => onChange(type.value)}
									>
										<Text
											style={[
												styles.typeButtonText,
												value === type.value && styles.typeButtonTextSelected,
											]}
										>
											{type.label}
										</Text>
									</TouchableOpacity>
								)}
								name="type"
							/>
						))}
					</View>
					{errors.type && (
						<Text style={styles.errorText}>{errors.type.message}</Text>
					)}
				</View>

				{/* Description Input */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Description</Text>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={[styles.input, styles.textArea]}
								placeholder="Enter marker description (optional)"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
								multiline
								numberOfLines={3}
								maxLength={200}
							/>
						)}
						name="description"
					/>
				</View>

				{/* Color Selection */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Color</Text>
					<View style={styles.colorButtons}>
						{colors.map((color) => (
							<Controller
								key={color.value}
								control={control}
								render={({ field: { onChange, value } }) => (
									<TouchableOpacity
										style={[
											styles.colorButton,
											{ backgroundColor: color.value },
											value === color.value && styles.colorButtonSelected,
										]}
										onPress={() => onChange(color.value)}
									>
										{value === color.value && (
											<Text style={styles.colorCheck}>✓</Text>
										)}
									</TouchableOpacity>
								)}
								name="color"
							/>
						))}
					</View>
				</View>

				{/* Image Input */}
				{/* <Pressable onPress={takePhoto} style={styles.imageContainer}>
					<Image
						source={watchedImage ? { uri: watchedImage } : undefined}
						style={styles.image}
					/>
					{!watchedImage && (
						<View style={styles.imageOverlay}>
							<Ionicons name="camera" size={30} color="#666" />
						</View>
					)}
				</Pressable> */}

				<Button title="Take Photo" onPress={takePhoto} />

				{watchedImage && (
					<Image source={{ uri: watchedImage }} style={styles.image} />
				)}

				{/* Marker Type Input */}
				<View style={styles.inputGroup}>
					<Text style={styles.label}>Marker Category</Text>
					<Controller
						control={control}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={styles.input}
								placeholder="Enter marker category (optional)"
								onBlur={onBlur}
								onChangeText={onChange}
								value={value}
							/>
						)}
						name="typeOfMarker"
					/>
				</View>
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={styles.cancelButton}
					onPress={() => navigation.goBack()}
				>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.submitButton}
					onPress={handleSubmit(onSubmit)}
				>
					<Text style={styles.submitButtonText}>Create Marker</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#fff",
		padding: 35,
		marginTop: 35,
	},
	header: {
		marginBottom: 30,
		alignItems: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: "#333",
		marginBottom: 10,
	},
	subtitle: {
		fontSize: 14,
		color: "#666",
		textAlign: "center",
	},
	form: {
		flex: 1,
	},
	inputGroup: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		color: "#333",
		marginBottom: 8,
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 8,
		padding: 12,
		fontSize: 16,
		backgroundColor: "#f9f9f9",
	},
	inputError: {
		borderColor: "#ff4757",
	},
	textArea: {
		height: 80,
		textAlignVertical: "top",
	},
	errorText: {
		color: "#ff4757",
		fontSize: 14,
		marginTop: 4,
	},
	typeButtons: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 8,
	},
	typeButton: {
		paddingHorizontal: 16,
		paddingVertical: 8,
		borderRadius: 20,
		borderWidth: 1,
		borderColor: "#ddd",
		backgroundColor: "#f9f9f9",
	},
	typeButtonSelected: {
		backgroundColor: "#007AFF",
		borderColor: "#007AFF",
	},
	typeButtonText: {
		fontSize: 14,
		color: "#666",
	},
	typeButtonTextSelected: {
		color: "#fff",
		fontWeight: "600",
	},
	colorButtons: {
		flexDirection: "row",
		flexWrap: "wrap",
		gap: 12,
	},
	colorButton: {
		width: 40,
		height: 40,
		borderRadius: 20,
		borderWidth: 2,
		borderColor: "#ddd",
		alignItems: "center",
		justifyContent: "center",
	},
	colorButtonSelected: {
		borderColor: "#333",
		borderWidth: 3,
	},
	colorCheck: {
		color: "#fff",
		fontSize: 18,
		fontWeight: "bold",
		textShadowColor: "#000",
		textShadowOffset: { width: 0, height: 0 },
		textShadowRadius: 2,
	},
	image: {
		width: 100,
		height: 100,
		borderRadius: 50,
		alignSelf: "center",
		marginVertical: 10,
		borderWidth: 2,
		borderColor: "#ddd",
	},
	imageContainer: {
		position: "relative",
		alignSelf: "center",
		marginVertical: 10,
	},
	imageOverlay: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(255, 255, 255, 0.7)",
		borderRadius: 50,
	},
	buttonContainer: {
		flexDirection: "row",
		gap: 12,
		marginTop: 30,
		marginBottom: 20,
	},
	cancelButton: {
		flex: 1,
		padding: 16,
		borderRadius: 8,
		borderWidth: 1,
		borderColor: "#ddd",
		alignItems: "center",
	},
	cancelButtonText: {
		fontSize: 16,
		color: "#666",
		fontWeight: "600",
	},
	submitButton: {
		flex: 2,
		padding: 16,
		borderRadius: 8,
		backgroundColor: "#007AFF",
		alignItems: "center",
	},
	submitButtonText: {
		fontSize: 16,
		color: "#fff",
		fontWeight: "600",
	},
});

export default CustomMarker;
