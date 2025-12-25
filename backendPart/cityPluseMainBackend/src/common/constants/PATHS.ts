import jetPaths from "jet-paths";

const PATHS = {
	_: "/api",
	Users: {
		_: "/users",
		Get: "/all",
		Add: "/add",
		Update: "/update",
		Delete: "/delete/:id",
		SendN8NData: "/send-n8n-data",
	},
} as const;

export const JET_PATHS = jetPaths(PATHS);
export default PATHS;
