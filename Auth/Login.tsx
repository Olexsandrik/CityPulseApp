import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type React from "react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
	ActivityIndicator,
	Alert,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { useAuthStore } from "../store/auth.store";

interface LoginFormData {
	email: string;
	password: string;
}

type AuthStackParamList = {
	Login: undefined;
	Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
	AuthStackParamList,
	"Login"
>;

interface LoginProps {
	navigation: LoginScreenNavigationProp;
}

const Login: React.FC<LoginProps> = ({ navigation }) => {
	const { login, isLoading, error, clearError, pushProvider } = useAuthStore();
	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>();

	useEffect(() => {
		if (error) {
			Alert.alert("Error", error);
			clearError();
		}
	}, [error, clearError]);

	const onSubmit = async (data: LoginFormData) => {
		await login(data.email, data.password);
		const { user } = useAuthStore.getState();
		if (user?.id) {
			await pushProvider();
		}
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Login</Text>

			<View style={styles.form}>
				<View style={styles.inputContainer}>
					<Text style={styles.label}>Email</Text>
					<Controller
						control={control}
						rules={{
							required: "Email is required",
							pattern: {
								value: /^\S+@\S+$/i,
								message: "Enter a valid email",
							},
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={[styles.input, errors.email && styles.inputError]}
								placeholder="Enter your email"
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								keyboardType="email-address"
								autoCapitalize="none"
								autoCorrect={false}
							/>
						)}
						name="email"
					/>
					{errors.email && (
						<Text style={styles.errorText}>{errors.email.message}</Text>
					)}
				</View>

				<View style={styles.inputContainer}>
					<Text style={styles.label}>Password</Text>
					<Controller
						control={control}
						rules={{
							required: "Password is required",
							minLength: {
								value: 6,
								message: "Password must be at least 6 characters",
							},
						}}
						render={({ field: { onChange, onBlur, value } }) => (
							<TextInput
								style={[styles.input, errors.password && styles.inputError]}
								placeholder="Enter your password"
								value={value}
								onBlur={onBlur}
								onChangeText={onChange}
								secureTextEntry
								autoCapitalize="none"
								autoCorrect={false}
							/>
						)}
						name="password"
					/>
					{errors.password && (
						<Text style={styles.errorText}>{errors.password.message}</Text>
					)}
				</View>

				<TouchableOpacity
					style={[styles.button, isLoading && styles.buttonDisabled]}
					onPress={handleSubmit(onSubmit)}
					disabled={isLoading}
				>
					{isLoading ? (
						<ActivityIndicator color="white" />
					) : (
						<Text style={styles.buttonText}>Login</Text>
					)}
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.linkButton}
					onPress={() => navigation.navigate("Register")}
				>
					<Text style={styles.linkText}>
						Don't have an account? Register here
					</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		padding: 20,
		backgroundColor: "#f5f5f5",
	},
	title: {
		fontSize: 32,
		fontWeight: "bold",
		textAlign: "center",
		marginBottom: 40,
		color: "#333",
	},
	form: {
		backgroundColor: "white",
		padding: 20,
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.1,
		shadowRadius: 3.84,
		elevation: 5,
	},
	inputContainer: {
		marginBottom: 20,
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
		color: "#333",
	},
	input: {
		borderWidth: 1,
		borderColor: "#ddd",
		padding: 12,
		borderRadius: 8,
		fontSize: 16,
		backgroundColor: "#f9f9f9",
	},
	inputError: {
		borderColor: "#e74c3c",
	},
	errorText: {
		color: "#e74c3c",
		fontSize: 14,
		marginTop: 4,
	},
	button: {
		backgroundColor: "#3498db",
		padding: 15,
		borderRadius: 8,
		alignItems: "center",
		marginTop: 10,
	},
	buttonDisabled: {
		backgroundColor: "#bdc3c7",
	},
	buttonText: {
		color: "white",
		fontSize: 18,
		fontWeight: "600",
	},
	linkButton: {
		marginTop: 20,
		alignItems: "center",
	},
	linkText: {
		color: "#3498db",
		fontSize: 16,
	},
});

export default Login;
