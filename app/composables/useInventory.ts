export function useInventory(size: number) {
	const inventory = ref<Array<ItemInstance | null>>(
		Array(size * size).fill(null),
	);

	function tryAddItem(item: Item, pos: InventoryPosition): boolean {
		if (!isFree(item, pos)) return false;
		addItem(item, pos);
		return true;
	}

	function tryUpdateItem(
		item: ItemInstance,
		newPos: InventoryPosition,
	): boolean {
		if (!isFree(item.ref, newPos, item)) return false;

		deleteItem(item);

		// update the existing instance in-place instead of creating a new one
		item.pos = newPos;

		for (const [index, cell] of item.ref.layout.entries()) {
			if (cell === 0) continue;
			const row = Math.floor(index / item.ref.size.width);
			const col = index % item.ref.size.width;

			const inventoryRow = row + newPos.row;
			const inventoryCol = col + newPos.col;

			const inventoryIndex = inventoryRow * size + inventoryCol;
			inventory.value[inventoryIndex] = item;
		}

		return true;
	}

	function isFree(item: Item, pos: InventoryPosition, ignore?: ItemInstance): boolean {
		for (const [index, cell] of item.layout.entries()) {
			if (cell === 0) continue;
			let row = (index - (index % item.size.width)) / item.size.width;
			let col = index - row * item.size.width;

			const inventoryRow = row + pos.row;
			const inventoryCol = col + pos.col;

			if (inventoryCol < pos.col) return false;

			if (inventoryRow >= size || inventoryCol >= size) return false;
			const inventoryIndex = inventoryRow * size + inventoryCol;
			const occupant = inventory.value[inventoryIndex];
			if (occupant !== null && occupant !== ignore) return false;
		}
		return true;
	}

	function addItem(item: Item, pos: InventoryPosition) {
		console.log("addItem:", pos);
		const itemInstance: ItemInstance = {
			ref: item,
			pos: pos,
			rot: null,
		};

		for (const [index, cell] of item.layout.entries()) {
			if (cell === 0) continue;
			let row = (index - (index % item.size.width)) / item.size.width;
			let col = index - row * item.size.width;

			const inventoryRow = row + pos.row;
			const inventoryCol = col + pos.col;

			const inventoryIndex = inventoryRow * size + inventoryCol;

			inventory.value[inventoryIndex] = itemInstance;
		}
	}

	function deleteItem(item: ItemInstance): boolean {
		let found = false;
		for (let i = 0; i < inventory.value.length; i++) {
			if (inventory.value[i] === item) {
				inventory.value[i] = null;
				found = true;
			}
		}
		return found;
	}

	function addItemToNextFreePos(item: Item): boolean {
		for (let row = 0; row < size; row++) {
			for (let col = 0; col < size; col++) {
				let pos = { row, col };
				if (isFree(item, pos)) {
					addItem(item, pos);
					return true;
				}
			}
		}
		return false;
	}

	return {
		inventory,
		tryAddItem,
		deleteItem,
		tryUpdateItem,
		isFree,
		addItemToNextFreePos,
	};
}
