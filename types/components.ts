import type { DataTypeOfMarkers } from "./type";

// Base component props
export interface BaseComponentProps {
	className?: string;
	testID?: string;
	accessibilityLabel?: string;
}

// Union Types для станів компонентів
export type ComponentState =
	| { status: "idle" }
	| { status: "loading" }
	| { status: "success" }
	| { status: "error"; error: string };

// Generic для спискових компонентів
export interface ListComponentProps<T> extends BaseComponentProps {
	data: T[];
	isLoading?: boolean;
	error?: string | null;
	onRefresh?: () => void;
	emptyMessage?: string;
}

// Specific для маркерів
export type MarkerListProps = ListComponentProps<DataTypeOfMarkers>;

// Event Handlers
export type ChangeHandler<T> = (value: T) => void;
export type SubmitHandler<T = void> = (data?: T) => void | Promise<void>;

export type MarkerSelectHandler = ChangeHandler<DataTypeOfMarkers>;
export type FormSubmitHandler<T> = SubmitHandler<T>;

// Intersection Types для компонентів
export interface InteractiveComponentProps extends BaseComponentProps {
	onPress?: () => void;
	disabled?: boolean;
	loading?: boolean;
}

export interface ModalComponentProps extends BaseComponentProps {
	visible: boolean;
	onClose: () => void;
}
