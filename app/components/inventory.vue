<script setup lang="ts">
import { instance } from "three/tsl";

type Props = {
  inventory: Array<ItemInstance | null>;
  size: number;
};

const { inventory, size } = defineProps<Props>();

const cellSize = computed(() => {
  return 100 / size;
});

const uniqueItemInstances = computed(() => {
  let instances: Array<ItemInstance> = [];
  for (let [index, item] of inventory.entries()) {
    if (!item) continue;
    if (instances.includes(item)) continue;
    instances.push(item);
  }
  return instances;
});
</script>

<template>
  <div
    class="z-10 absolute bg-black/80 backdrop-blur-xl rounded-xl size-80 top-1/2 left-1/2 -translate-1/2 grid grid-cols-5 grid-rows-5 p-1"
  >
    <div v-for="i in size * size" class="p-1 group">
      <div
        class="size-full grid place-items-center border-white/10 border rounded-lg"
      ></div>
    </div>
    <div class="absolute size-full">
      <UiItem
        v-for="item in uniqueItemInstances"
        class="absolute"
        :style="[
          `left: ${item.pos.col * cellSize}%`,
          `top: ${item.pos.row * cellSize}%`,
        ]"
        :item="item.ref"
        :grid-size="size"
      />
    </div>
  </div>
</template>
