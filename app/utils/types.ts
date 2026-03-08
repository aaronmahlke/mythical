export type Item = {
	color: string;
	size: ItemSize;
	layout: Array<number>;
};

export type ItemInstance = {
	ref: Item;
	pos: InventoryPosition;
	rot: InventoryRotation | null;
};

export type InventoryPosition = {
	col: number;
	row: number;
};

export type InventoryRotation = "R0" | "R90" | "R180" | "R270";

export type ItemSize = {
	width: number;
	height: number;
};

export type Offset = { x: number; y: number };
