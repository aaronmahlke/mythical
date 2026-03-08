type DragOptions = {
	containerRef: Ref<HTMLElement | null>;
	gridSize: number;
	isFree: (
		item: Item,
		pos: InventoryPosition,
		ignore?: ItemInstance,
	) => boolean;
	onDrop: (item: ItemInstance, pos: InventoryPosition) => void;
};

const isDragging = ref(false);
const draggedItem = ref<ItemInstance | null>(null);
const pointerPos = ref({ x: 0, y: 0 });
const grabOffset = ref({ x: 0, y: 0 });

let _containerRef = ref<HTMLElement | null>(null);
let _gridSize = 0;
let _isFree: DragOptions["isFree"] = () => false;
let _onDrop: DragOptions["onDrop"] = () => {};

export function useDrag(options?: DragOptions) {
	if (options) {
		_containerRef = options.containerRef;
		_gridSize = options.gridSize;
		_isFree = options.isFree;
		_onDrop = options.onDrop;
	}

	const cellSize = computed(() => (_gridSize > 0 ? 100 / _gridSize : 0));

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
			_onDrop(draggedItem.value, previewPosition.value);
		}

		isDragging.value = false;
		draggedItem.value = null;
		document.removeEventListener("pointermove", onPointerMove);
		document.removeEventListener("pointerup", onPointerUp);
	}

	const dragPosition = computed(() => {
		if (!_containerRef.value) return { x: 0, y: 0 };
		const rect = _containerRef.value.getBoundingClientRect();
		return {
			x: pointerPos.value.x - rect.left - grabOffset.value.x,
			y: pointerPos.value.y - rect.top - grabOffset.value.y,
		};
	});

	const previewPosition = computed<InventoryPosition | null>(() => {
		if (!isDragging.value || !draggedItem.value || !_containerRef.value)
			return null;
		const rect = _containerRef.value.getBoundingClientRect();

		const percentX = ((pointerPos.value.x - rect.left) / rect.width) * 100;
		const percentY = ((pointerPos.value.y - rect.top) / rect.height) * 100;

		const grabOffsetPercentX = (grabOffset.value.x / rect.width) * 100;
		const grabOffsetPercentY = (grabOffset.value.y / rect.height) * 100;

		const col = Math.round((percentX - grabOffsetPercentX) / cellSize.value);
		const row = Math.round((percentY - grabOffsetPercentY) / cellSize.value);

		const clampedCol = Math.max(
			0,
			Math.min(col, _gridSize - draggedItem.value.ref.size.width),
		);
		const clampedRow = Math.max(
			0,
			Math.min(row, _gridSize - draggedItem.value.ref.size.height),
		);

		return { col: clampedCol, row: clampedRow };
	});

	const canPlace = computed(() => {
		if (!previewPosition.value || !draggedItem.value) return false;
		return _isFree(
			draggedItem.value.ref,
			previewPosition.value,
			draggedItem.value,
		);
	});

	const highlightedCells = computed<Set<number>>(() => {
		const cells = new Set<number>();
		if (!previewPosition.value || !draggedItem.value) return cells;

		const item = draggedItem.value.ref;
		const pos = previewPosition.value;

		for (const [index, cell] of item.layout.entries()) {
			if (cell === 0) continue;
			const row = Math.floor(index / item.size.width);
			const col = index % item.size.width;

			const inventoryRow = row + pos.row;
			const inventoryCol = col + pos.col;

			if (inventoryRow < _gridSize && inventoryCol < _gridSize) {
				cells.add(inventoryRow * _gridSize + inventoryCol);
			}
		}

		return cells;
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
