export function useInventory(size: number) {
	const inventory = ref<Array<ItemInstance | null>>(
		Array(size * size).fill(null),
	);

	function tryAddItem(itemInstance: ItemInstance): boolean {
		if (!isFree(itemInstance)) return false;
		addItem(itemInstance);
		return true;
	}

	function tryUpdateItem(
		itemInstance: ItemInstance,
		newPos: InventoryPosition,
	): boolean {
		let newItemInstance = JSON.parse(JSON.stringify(itemInstance));
		newItemInstance.pos = newPos;

		if (!isFree(newItemInstance, itemInstance)) return false;

		deleteItem(itemInstance);
		itemInstance.pos = newPos;
		addItem(itemInstance);

		return true;
	}

	function isFree(itemInstance: ItemInstance, ignore?: ItemInstance): boolean {
		let [layout, itemSize] = getRotatedLayout(itemInstance);
		for (const [index, cell] of layout.entries()) {
			if (cell === 0) continue;
			let row = (index - (index % itemSize.width)) / itemSize.width;
			let col = index - row * itemSize.width;

			const inventoryRow = row + itemInstance.pos.row;
			const inventoryCol = col + itemInstance.pos.col;

			if (inventoryCol < itemInstance.pos.col) return false;

			if (inventoryRow >= size || inventoryCol >= size) return false;
			const inventoryIndex = inventoryRow * size + inventoryCol;
			const occupant = inventory.value[inventoryIndex];
			if (occupant !== null && occupant !== ignore) return false;
		}
		return true;
	}

	function addItem(itemInstance: ItemInstance) {
		let [layout, itemSize] = getRotatedLayout(itemInstance);

		for (const [index, cell] of layout.entries()) {
			if (cell === 0) continue;
			let row = (index - (index % itemSize.width)) / itemSize.width;
			let col = index - row * itemSize.width;

			const inventoryRow = row + itemInstance.pos.row;
			const inventoryCol = col + itemInstance.pos.col;

			const inventoryIndex = inventoryRow * size + inventoryCol;

			inventory.value[inventoryIndex] = itemInstance;
		}
	}

	function getRotatedLayout(
		itemInstance: ItemInstance,
	): [Array<number>, ItemSize] {
		let layout = itemInstance.ref.layout;
		let size = itemInstance.ref.size;
		let rotation = itemInstance.rot;
		if (rotation === 90)
			return [
				rotateBy90Deg(layout, size),
				{ width: size.height, height: size.width },
			];
		if (rotation === 180) return [layout.reverse(), size];
		if (rotation === 270)
			return [
				rotateBy90Deg(layout, size).reverse(),
				{ width: size.height, height: size.width },
			];
		return [layout, size];
	}

	function rotateBy90Deg(layout: Array<number>, size: ItemSize): Array<number> {
		let newLayout: Array<number> = [];
		for (let col = 0; col <= size.width; col++) {
			let newRow: Array<number> = [];
			for (let row = 0; row <= size.height; row++) {
				newRow.splice(0, 0, layout[row * size.width + col]!);
			}
			newLayout.concat(newRow);
		}
		return newLayout;
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
				for (let rot = 0; rot < 270; rot += 90) {
					let pos = { row, col };
					let itemInstance: ItemInstance = {
						ref: item,
						pos,
						rot: rot as InventoryRotation,
					};
					if (isFree(itemInstance)) {
						addItem(itemInstance);
						return true;
					}
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
		rotateLayoutCw: getRotatedLayout,
	};
}
