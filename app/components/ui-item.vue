<script setup lang="ts">
type Props = {
  item: ItemInstance;
  gridSize: number;
};

const { item, gridSize } = defineProps<Props>();
const { startDrag } = useDrag();

const cellSize = computed(() => {
  return 100 / gridSize;
});

const itemElement = ref<HTMLElement | null>(null);

function onPointerDown(event: PointerEvent) {
  console.log("hi");
  if (!itemElement.value) return;
  const rect = itemElement.value.getBoundingClientRect();
  const offset = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  startDrag(item, offset, event);
}
</script>
<template>
  <div
    @pointerdown="onPointerDown"
    class="grid"
    :style="[
      `grid-template-rows: repeat(${item.ref.size.height}, minmax(0, 1fr))`,
      `grid-template-columns: repeat(${item.ref.size.width}, minmax(0, 1fr))`,
      `width: ${item.ref.size.width * cellSize}%`,
      `height: ${item.ref.size.height * cellSize}%`,
    ]"
    ref="itemElement"
  >
    <div v-for="(cell, index) in item.ref.layout" class="size-full">
      <div
        v-if="item.ref.layout[index]"
        class="size-full"
        :style="`background-color: ${item.ref.color}`"
      ></div>
      <div v-else></div>
    </div>
  </div>
</template>
