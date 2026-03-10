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

const layout = computed(() => getRotatedLayout(item)[0]);
const size = computed(() => getRotatedLayout(item)[1]);

const imageTransform = computed(() => {
  const rot = item.rot;
  if (rot === 0) return "none";
  if (rot === 180) return "rotate(180deg)";
  const sx = size.value.width / size.value.height;
  const sy = size.value.height / size.value.width;
  return `scale(${sx}, ${sy}) rotate(${rot}deg)`;
});
</script>
<template>
  <div
    class="grid select-none"
    :style="[
      `grid-template-rows: repeat(${size.height}, minmax(0, 1fr))`,
      `grid-template-columns: repeat(${size.width}, minmax(0, 1fr))`,
      `width: ${size.width * cellSize}%`,
      `height: ${size.height * cellSize}%`,
    ]"
    style="background-size: 100%"
    ref="itemElement"
  >
    <img
      :src="item.ref.texture"
      class="pointer-events-none absolute inset-0 size-full object-fill"
      :style="{ transform: imageTransform }"
    />
    <div v-for="(cell, index) in layout" class="size-full">
      <div
        @pointerdown="onPointerDown"
        v-if="layout[index]"
        class="size-full"
      ></div>
      <div v-else class="pointer-events-none"></div>
    </div>
  </div>
</template>
