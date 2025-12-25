//Map integration.

export type DataTypeOfMarkers = {
	id?: string;
	user_id?: string;
	name: string;
	type: string;
	latitude: number;
	longitude: number;
	description?: string;
	image?: string;
	typeOfMarker?: string;
	color?: string;
	created_at?: Date;
};

export type MarkerConfig = {
	color: string;
	gradient: string[];
	icon: string;
	backgroundColor: string;
	shadowColor: string;
};

// User Profile Types
export type UserProfile = {
	id: string;
	username: string;
	email: string;
	avatar?: string;
	createdAt: Date;
	updatedAt: Date;
};

//Map integration
