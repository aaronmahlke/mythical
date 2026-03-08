<script setup lang="ts">
type Props = {
  items: Array<Item>;
};
const { items } = defineProps<Props>();

const emit = defineEmits(["add"]);
</script>
<template>
  <div
    class="bg-black/20 bottom-5 left-5 right-5 z-10 absolute h-50 flex items-start p-4 rounded-lg"
  >
    <div class="flex flex-1 flex-wrap gap-2">
      <div
        v-for="item in items"
        class="size-10 rounded-full"
        :style="`background-color: ${item.color}`"
      ></div>
    </div>
    <button class="px-3 py-1.5 rounded-md bg-white" @click="emit('add')">
      Add
    </button>
  </div>
</template>
