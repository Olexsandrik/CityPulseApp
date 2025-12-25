type SendDataToN8NProps = {
	data: {
		markerId: string;
		userId: string;
	};
};
export const useSendDataToN8N = () => {
	const sendDataToN8N = async (data: SendDataToN8NProps) => {
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

			return response.json();
		} catch (e) {
			console.log("e", e);
		}
	};
	return { sendDataToN8N };
};
