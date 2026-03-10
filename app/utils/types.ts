export type Item = {
	color?: string;
	texture?: string;
	size: ItemSize;
	layout: Array<number>;
};

export type ItemInstance = {
	ref: Item;
	pos: InventoryPosition;
	rot: InventoryRotation;
};

export type InventoryPosition = {
	col: number;
	row: number;
};

export type InventoryRotation = 0 | 90 | 180 | 270;

export type ItemSize = {
	width: number;
	height: number;
};

export type Offset = { x: number; y: number };
