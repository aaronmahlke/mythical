<script setup lang="ts">
type Props = {
  size: number;
};

const { size } = defineProps<Props>();

const {
  inventory,
  tryUpdateItem,
  addItemToNextFreePos,
} = useInventory(size);

const itemsContainer = ref<HTMLElement | null>(null);
const { startDrag, isDragging, draggedItem, dragPosition, highlightedCells } = useDrag({
  containerRef: itemsContainer,
  inventory: inventory.value,
  onDrop: (item, pos) => tryUpdateItem(item, pos),
});

const cellSize = computed(() => {
  return 100 / size;
});

const uniqueItemInstances = computed(() => {
  let instances: Array<ItemInstance> = [];
  for (let [index, item] of inventory.value.grid.entries()) {
    if (!item) continue;
    if (instances.includes(item)) continue;
    instances.push(item);
  }
  return instances;
});

const itemBankItems = ref<Array<Item>>([]);

function addRandomItem() {
  const index = getRandomIntegerInclusive(0, sampleItems.length - 1);
  if (sampleItems[index]) {
    addItemToNextFreePos(sampleItems[index]);
  }
}

onKeyStroke("r", (e) => {
  e.preventDefault();
  if (!isDragging || !draggedItem.value) return;
  const nextRot = ((draggedItem.value.rot + 90) % 360) as InventoryRotation;
  draggedItem.value.rot = nextRot;
});
</script>

<template>
  <div
    class="z-10 absolute bg-black/80 backdrop-blur-xl rounded-xl size-80 top-1/2 left-1/2 -translate-1/2 grid grid-cols-5 grid-rows-5 p-1"
  >
    <div v-for="(_, i) in size * size" class="p-1 group">
      <div
        class="size-full grid place-items-center border-white/10 border rounded-lg transition-colors duration-150"
        :class="highlightedCells.has(i) ? 'bg-white/20' : ''"
      ></div>
    </div>
    <div ref="itemsContainer" class="absolute size-full">
      <UiItem
        v-for="itemInstance in uniqueItemInstances"
        class="absolute"
        :class="draggedItem === itemInstance ? 'opacity-0' : ''"
        :style="[
          `left: ${itemInstance.pos.col * cellSize}%`,
          `top: ${itemInstance.pos.row * cellSize}%`,
        ]"
        :item="itemInstance"
        :grid-size="size"
        @dragstart="startDrag"
      />

      <UiItem
        v-if="isDragging && draggedItem"
        :item="draggedItem"
        :grid-size="size"
        class="absolute pointer-events-none z-50"
        :style="{
          left: `${dragPosition.x}px`,
          top: `${dragPosition.y}px`,
        }"
      />
    </div>
  </div>
  <ItemBank :items="itemBankItems" @add="addRandomItem" />
</template>
