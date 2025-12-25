import type { Request, Response } from "express";

export const sendN8NDataController = {
	sendN8NData: async (req: Request, res: Response): Promise<void> => {
		try {
			const data = req.body;

			if (!data) {
				res.status(400).json({ error: "Data is required" });
			}

			const response = await fetch(
				"http://localhost:5678/webhook-test/30e16805-1f4f-4bc6-b4db-08ae6ba3595a",
				{
					method: "POST",
					body: JSON.stringify({ data }),

					headers: {
						"Content-Type": "application/json",
					},
				},
			);

			if (!response.ok) {
				throw new Error("Failed to send data to N8N");
			}

			res.status(200).json({ success: true });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Failed to send data to N8N" });
		}
	},
};

export default sendN8NDataController;
