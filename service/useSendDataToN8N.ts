import type { ApiResponse } from "../types/api";

// N8N Integration Types
type SendDataToN8NProps = {
	data: {
		markerId: string;
		userId: string;
	};
};

type SendDataToN8NResponse = ApiResponse<{
	message: string;
	processed: boolean;
}>;

// Generic Hook Return Type
interface UseSendDataToN8NReturn {
	sendDataToN8N: (data: SendDataToN8NProps) => Promise<SendDataToN8NResponse>;
}

export const useSendDataToN8N = (): UseSendDataToN8NReturn => {
	const sendDataToN8N = async (
		data: SendDataToN8NProps,
	): Promise<SendDataToN8NResponse> => {
		try {
			const response = await fetch(
				"http://localhost:3000/api/users/send-n8n-data",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(data),
				},
			);

			if (!response.ok) {
				throw new Error("Failed to send data to N8N");
			}

			const result = await response.json();
			return {
				success: true,
				data: result,
			};
		} catch (error) {
			console.error("Send data to N8N failed:", error);

			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
				data: { message: "", processed: false },
			};
		}
	};
	return { sendDataToN8N };
};
