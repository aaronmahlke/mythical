<script setup lang="ts">
type Props = {
  item: Item;
  gridSize: number;
};

const { item, gridSize } = defineProps<Props>();
const cellSize = computed(() => {
  return 100 / gridSize;
});
</script>
<template>
  <div
    class="grid"
    :style="[
      `grid-template-rows: repeat(${item.size.height}, minmax(0, 1fr))`,
      `grid-template-columns: repeat(${item.size.width}, minmax(0, 1fr))`,
      `width: ${item.size.width * cellSize}%`,
      `height: ${item.size.height * cellSize}%`,
    ]"
  >
    <div v-for="(cell, index) in item.layout" class="size-full">
      <div
        v-if="item.layout[index]"
        class="size-full"
        :style="`background-color: ${item.color}`"
      ></div>
      <div v-else></div>
    </div>
  </div>
</template>
