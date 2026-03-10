<script setup lang="ts">
type Props = {
  item: ItemInstance;
  gridSize: number;
};

const { item, gridSize } = defineProps<Props>();
type Emits = {
  dragstart: [item: ItemInstance, offset: Offset, event: PointerEvent];
};

const emit = defineEmits<Emits>();

const cellSize = computed(() => {
  return 100 / gridSize;
});

const itemElement = ref<HTMLElement | null>(null);

function onPointerDown(event: PointerEvent) {
  if (!itemElement.value) return;
  const rect = itemElement.value.getBoundingClientRect();
  const offset = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top,
  };
  emit("dragstart", item, offset, event);
}
</script>
<template>
  <div
    class="grid select-none"
    :style="[
      `grid-template-rows: repeat(${item.ref.size.height}, minmax(0, 1fr))`,
      `grid-template-columns: repeat(${item.ref.size.width}, minmax(0, 1fr))`,
      `width: ${item.ref.size.width * cellSize}%`,
      `height: ${item.ref.size.height * cellSize}%`,
    ]"
    style="background-size: 100%"
    ref="itemElement"
  >
    <img
      :src="item.ref.texture"
      class="object-cover absolute inset-0 pointer-events-none"
      :style="`transform: rotate(${item.rot}deg)`"
    />
    <div v-for="(cell, index) in item.ref.layout" class="size-full">
      <div
        @pointerdown="onPointerDown"
        v-if="item.ref.layout[index]"
        class="size-full"
        :style="`background: ${item.ref.color}`"
      ></div>
      <div v-else class="pointer-events-none"></div>
    </div>
  </div>
</template>
