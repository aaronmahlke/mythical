export function useInventory(size: number) {
	const instance = new Inventory(size);
	const state = shallowRef(instance);

	function tryAddItem(item: ItemInstance): boolean {
		const result = instance.tryAddItem(item);
		triggerRef(state);
		return result;
	}

	function tryUpdateItem(
		item: ItemInstance,
		newPos: InventoryPosition,
	): boolean {
		const result = instance.tryUpdateItem(item, newPos);
		triggerRef(state);
		return result;
	}

	function deleteItem(item: ItemInstance): boolean {
		const result = instance.deleteItem(item);
		triggerRef(state);
		return result;
	}

	function addItemToNextFreePos(item: Item): boolean {
		const result = instance.addItemToNextFreePos(item);
		triggerRef(state);
		return result;
	}

	return {
		inventory: state,
		tryAddItem,
		tryUpdateItem,
		deleteItem,
		addItemToNextFreePos,
	};
}
