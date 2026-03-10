type DragOptions = {
	containerRef: Ref<HTMLElement | null>;
	inventory: Inventory;
	onDrop: (item: ItemInstance, pos: InventoryPosition) => void;
};

export function useDrag(options: DragOptions) {
	const isDragging = ref(false);
	const draggedItem = ref<ItemInstance | null>(null);
	const pointerPos = ref({ x: 0, y: 0 });
	const grabOffset = ref({ x: 0, y: 0 });

	const cellSize = computed(() =>
		options.inventory.size > 0 ? 100 / options.inventory.size : 0,
	);

	function startDrag(item: ItemInstance, offset: Offset, event: PointerEvent) {
		draggedItem.value = item;
		grabOffset.value = offset;
		pointerPos.value = { x: event.clientX, y: event.clientY };
		isDragging.value = true;
		document.addEventListener("pointermove", onPointerMove);
		document.addEventListener("pointerup", onPointerUp);
	}

	function onPointerMove(event: PointerEvent) {
		pointerPos.value = { x: event.clientX, y: event.clientY };
	}

	function onPointerUp() {
		if (draggedItem.value && previewPosition.value && canPlace.value) {
			options.onDrop(draggedItem.value, previewPosition.value);
		}

		isDragging.value = false;
		draggedItem.value = null;
		document.removeEventListener("pointermove", onPointerMove);
		document.removeEventListener("pointerup", onPointerUp);
	}

	const dragPosition = computed(() => {
		if (!options.containerRef.value) return { x: 0, y: 0 };
		const rect = options.containerRef.value.getBoundingClientRect();
		return {
			x: pointerPos.value.x - rect.left - grabOffset.value.x,
			y: pointerPos.value.y - rect.top - grabOffset.value.y,
		};
	});

	const previewPosition = computed<InventoryPosition | null>(() => {
		if (!isDragging.value || !draggedItem.value || !options.containerRef.value)
			return null;
		const rect = options.containerRef.value.getBoundingClientRect();
		const gridSize = options.inventory.size;

		const [, rotatedSize] = getRotatedLayout(draggedItem.value);

		const percentX = ((pointerPos.value.x - rect.left) / rect.width) * 100;
		const percentY = ((pointerPos.value.y - rect.top) / rect.height) * 100;

		const grabOffsetPercentX = (grabOffset.value.x / rect.width) * 100;
		const grabOffsetPercentY = (grabOffset.value.y / rect.height) * 100;

		const col = Math.round((percentX - grabOffsetPercentX) / cellSize.value);
		const row = Math.round((percentY - grabOffsetPercentY) / cellSize.value);

		const clampedCol = Math.max(0, Math.min(col, gridSize - rotatedSize.width));
		const clampedRow = Math.max(
			0,
			Math.min(row, gridSize - rotatedSize.height),
		);

		return { col: clampedCol, row: clampedRow };
	});

	const canPlace = computed(() => {
		if (!previewPosition.value || !draggedItem.value) return false;

		const preview: ItemInstance = {
			...draggedItem.value,
			pos: previewPosition.value,
		};

		return options.inventory.isFree(preview, draggedItem.value);
	});

	const highlightedCells = computed<Set<number>>(() => {
		if (!previewPosition.value || !draggedItem.value) return new Set();

		const preview: ItemInstance = {
			...draggedItem.value,
			pos: previewPosition.value,
		};

		return options.inventory.getOccupiedCells(preview);
	});

	return {
		startDrag,
		isDragging,
		draggedItem,
		dragPosition,
		previewPosition,
		canPlace,
		highlightedCells,
	};
}
