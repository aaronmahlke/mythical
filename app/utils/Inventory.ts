export class Inventory {
	readonly size: number;
	grid: Array<ItemInstance | null>;

	constructor(size: number) {
		this.size = size;
		this.grid = Array(size * size).fill(null);
	}

	tryAddItem(item: ItemInstance): boolean {
		if (!this.isFree(item)) return false;
		this.addItem(item);
		return true;
	}

	tryUpdateItem(item: ItemInstance, newPos: InventoryPosition): boolean {
		const snapshot = { ...item, pos: newPos };
		if (!this.isFree(snapshot, item)) return false;

		this.deleteItem(item);
		item.pos = newPos;
		this.addItem(item);
		return true;
	}

	isFree(item: ItemInstance, ignore?: ItemInstance): boolean {
		const [layout, itemSize] = getRotatedLayout(item);

		for (let index = 0; index < layout.length; index++) {
			if (layout[index] === 0) continue;

			const row = Math.floor(index / itemSize.width);
			const col = index % itemSize.width;

			const gridRow = row + item.pos.row;
			const gridCol = col + item.pos.col;

			if (gridRow < 0 || gridCol < 0) return false;
			if (gridRow >= this.size || gridCol >= this.size) return false;

			const gridIndex = gridRow * this.size + gridCol;
			const occupant = this.grid[gridIndex];
			if (occupant !== null && occupant !== ignore) return false;
		}

		return true;
	}

	deleteItem(item: ItemInstance): boolean {
		let found = false;
		for (let i = 0; i < this.grid.length; i++) {
			if (this.grid[i] === item) {
				this.grid[i] = null;
				found = true;
			}
		}
		return found;
	}

	addItemToNextFreePos(item: Item): boolean {
		for (let row = 0; row < this.size; row++) {
			for (let col = 0; col < this.size; col++) {
				for (let rot = 0; rot <= 270; rot += 90) {
					const instance: ItemInstance = {
						ref: item,
						pos: { row, col },
						rot: rot as InventoryRotation,
					};
					if (this.isFree(instance)) {
						this.addItem(instance);
						return true;
					}
				}
			}
		}
		return false;
	}

	getOccupiedCells(item: ItemInstance): Set<number> {
		const cells = new Set<number>();
		const [layout, itemSize] = getRotatedLayout(item);

		for (let index = 0; index < layout.length; index++) {
			if (layout[index] === 0) continue;

			const row = Math.floor(index / itemSize.width);
			const col = index % itemSize.width;

			const gridRow = row + item.pos.row;
			const gridCol = col + item.pos.col;

			if (
				gridRow >= 0 &&
				gridCol >= 0 &&
				gridRow < this.size &&
				gridCol < this.size
			) {
				cells.add(gridRow * this.size + gridCol);
			}
		}

		return cells;
	}

	private addItem(item: ItemInstance): void {
		const [layout, itemSize] = getRotatedLayout(item);

		for (let index = 0; index < layout.length; index++) {
			if (layout[index] === 0) continue;

			const row = Math.floor(index / itemSize.width);
			const col = index % itemSize.width;

			const gridRow = row + item.pos.row;
			const gridCol = col + item.pos.col;

			const gridIndex = gridRow * this.size + gridCol;
			this.grid[gridIndex] = item;
		}
	}
}

export function getRotatedLayout(
	item: ItemInstance,
): [Array<number>, ItemSize] {
	const layout = item.ref.layout;
	const size = item.ref.size;

	switch (item.rot) {
		case 90:
			return [
				rotateBy90Deg(layout, size),
				{ width: size.height, height: size.width },
			];
		case 180:
			return [[...layout].reverse(), size];
		case 270:
			return [
				rotateBy90Deg(layout, size).reverse(),
				{ width: size.height, height: size.width },
			];
		default:
			return [[...layout], size];
	}
}

function rotateBy90Deg(layout: Array<number>, size: ItemSize): Array<number> {
	const newLayout: Array<number> = [];
	for (let col = 0; col < size.width; col++) {
		for (let row = size.height - 1; row >= 0; row--) {
			newLayout.push(layout[row * size.width + col]!);
		}
	}
	return newLayout;
}
