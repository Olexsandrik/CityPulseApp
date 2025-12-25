import * as FileSystem from "expo-file-system";
import supabase from "./supabase";

// Storage configuration
const BUCKET_NAME = "MarkersPhoto"; // Replace with your actual bucket name
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export interface UploadResult {
	success: boolean;
	url?: string;
	error?: string;
	fileName?: string;
}

export interface FileUploadOptions {
	fileName?: string;
	bucket?: string;
	upsert?: boolean;
}

/**
 * Uploads a file to Supabase Storage
 * @param fileUri - Local file URI from image picker
 * @param options - Upload options
 * @returns Promise with upload result
 */

export const uploadFile = async (
	fileUri: string,
	options: FileUploadOptions = {},
) => {
	const {
		fileName = generateFileName(),
		bucket = BUCKET_NAME,
		upsert = true,
	} = options;

	try {
		if (!fileUri) {
			return { success: false, error: "No file provided" };
		}

		// get base64
		const base64 = await FileSystem.readAsStringAsync(fileUri, {
			encoding: "base64",
		});

		// convert to bytes
		const arrayBuffer = base64ToArrayBuffer(base64);

		// file size
		const fileSize = arrayBuffer.byteLength;
		if (fileSize > MAX_FILE_SIZE) {
			return {
				success: false,
				error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
			};
		}

		// Upload
		const { data, error } = await supabase.storage
			.from(bucket)
			.upload(fileName, arrayBuffer, {
				contentType: "image/png",
				upsert,
			});

		if (error) {
			return { success: false, error: error.message };
		}

		// get public url
		const { data: urlData } = supabase.storage
			.from(bucket)
			.getPublicUrl(data.path);

		return {
			success: true,
			url: urlData.publicUrl,
			fileName: data.path,
		};
	} catch (e) {
		return {
			success: false,
			error: e instanceof Error ? e.message : "Unknown error",
		};
	}
};

/**
 * Uploads an image from base64 string
 * @param base64Data - Base64 encoded image data (with or without data URL prefix)
 * @param mimeType - MIME type of the image
 * @param options - Upload options
 * @returns Promise with upload result
 */
export const uploadBase64Image = async (
	base64Data: string,
	mimeType: string,
	options: FileUploadOptions = {},
): Promise<UploadResult> => {
	try {
		const {
			fileName = generateFileName(mimeType),
			bucket = BUCKET_NAME,
			upsert = false,
		} = options;

		// Remove data URL prefix if present (e.g., "data:image/jpeg;base64,")
		const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, "");

		// Convert base64 to ArrayBuffer
		const arrayBuffer = base64ToArrayBuffer(cleanBase64);

		// Validate file type
		if (!ALLOWED_TYPES.includes(mimeType)) {
			return {
				success: false,
				error: `File type ${mimeType} not allowed. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
			};
		}

		// Upload to Supabase Storage
		const { data, error } = await supabase.storage
			.from(bucket)
			.upload(fileName, arrayBuffer, {
				contentType: mimeType,
				upsert,
			});

		if (error) {
			console.error("Base64 upload error:", error);
			return {
				success: false,
				error: error.message,
			};
		}

		// Get public URL
		const { data: urlData } = supabase.storage
			.from(bucket)
			.getPublicUrl(data.path);

		return {
			success: true,
			url: urlData.publicUrl,
			fileName: data.path,
		};
	} catch (error) {
		console.error("Base64 upload failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown upload error",
		};
	}
};

/**
 * Converts base64 string to ArrayBuffer
 * @param base64 - Base64 encoded string
 * @returns ArrayBuffer
 */
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
	const binaryString = atob(base64);
	const bytes = new Uint8Array(binaryString.length);
	for (let i = 0; i < binaryString.length; i++) {
		bytes[i] = binaryString.charCodeAt(i);
	}
	return bytes.buffer;
};

/**
 * Deletes a file from Supabase Storage
 * @param fileName - Name of the file to delete
 * @param bucket - Bucket name (optional, defaults to BUCKET_NAME)
 * @returns Promise with deletion result
 */
export const deleteFile = async (
	fileName: string,
	bucket: string = BUCKET_NAME,
): Promise<{ success: boolean; error?: string }> => {
	try {
		const { error } = await supabase.storage.from(bucket).remove([fileName]);

		if (error) {
			console.error("Delete error:", error);
			return {
				success: false,
				error: error.message,
			};
		}

		return { success: true };
	} catch (error) {
		console.error("File deletion failed:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown deletion error",
		};
	}
};

/**
 * Gets public URL for a file
 * @param fileName - Name of the file
 * @param bucket - Bucket name (optional, defaults to BUCKET_NAME)
 * @returns Public URL string
 */
export const getPublicUrl = (
	fileName: string,
	bucket: string = BUCKET_NAME,
): string => {
	const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);

	return data.publicUrl;
};

/**
 * Generates a unique filename with timestamp and random string
 * @param extension - File extension (optional)
 * @returns Generated filename
 */
const generateFileName = (mimeType?: string): string => {
	const timestamp = Date.now();
	const random = Math.random().toString(36).substring(2, 15);
	let extension = "jpg";

	if (mimeType) {
		switch (mimeType) {
			case "image/jpeg":
				extension = "jpg";
				break;
			case "image/png":
				extension = "png";
				break;
			case "image/webp":
				extension = "webp";
				break;
			default:
				extension = "jpg";
		}
	}

	return `upload_${timestamp}_${random}.${extension}`;
};

/**
 * Validates file before upload
 * @param fileUri - File URI to validate
 * @returns Promise with validation result
 */
export const validateFile = async (
	fileUri: string,
): Promise<{
	valid: boolean;
	error?: string;
	size?: number;
	type?: string;
}> => {
	try {
		const response = await fetch(fileUri);
		const blob = await response.blob();

		if (blob.size > MAX_FILE_SIZE) {
			return {
				valid: false,
				error: `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`,
				size: blob.size,
				type: blob.type,
			};
		}

		if (!ALLOWED_TYPES.includes(blob.type)) {
			return {
				valid: false,
				error: `File type ${blob.type} not allowed. Allowed types: ${ALLOWED_TYPES.join(", ")}`,
				size: blob.size,
				type: blob.type,
			};
		}

		return {
			valid: true,
			size: blob.size,
			type: blob.type,
		};
	} catch {
		return {
			valid: false,
			error: "Failed to validate file",
		};
	}
};
