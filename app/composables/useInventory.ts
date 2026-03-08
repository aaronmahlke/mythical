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
		const oldItem = item.ref;
		if (!isFree(item.ref, newPos)) return false;

		deleteItem(item);
		addItem(oldItem, newPos);

		return true;
	}

	function isFree(item: Item, pos: InventoryPosition): boolean {
		for (const [index, cell] of item.layout.entries()) {
			if (cell === 0) continue;
			let row = (index - (index % item.size.width)) / item.size.width;
			let col = index - row * item.size.width;

			const inventoryRow = row + pos.row;
			const inventoryCol = col + pos.col;

			if (inventoryCol < pos.col) return false;

			if (inventoryRow >= size || inventoryCol >= size) return false;
			const inventoryIndex = inventoryRow * size + inventoryCol;
			if (inventory.value[inventoryIndex] !== null) return false;
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
		for (const index in inventory) {
			if (inventory.value[index] === item) {
				inventory.value[index] = null;
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
