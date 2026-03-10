export function useInventory(size: number) {
	const inventory = ref(new Inventory(size));

	function tryAddItem(item: ItemInstance): boolean {
		return inventory.value.tryAddItem(item);
	}

	function tryUpdateItem(
		item: ItemInstance,
		newPos: InventoryPosition,
	): boolean {
		return inventory.value.tryUpdateItem(item, newPos);
	}

	function deleteItem(item: ItemInstance): boolean {
		return inventory.value.deleteItem(item);
	}

	function addItemToNextFreePos(item: Item): boolean {
		return inventory.value.addItemToNextFreePos(item);
	}

	return {
		inventory,
		tryAddItem,
		tryUpdateItem,
		deleteItem,
		addItemToNextFreePos,
	};
}
