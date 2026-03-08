<script setup lang="ts">
const itemBankItems = ref<Array<Item>>([]);

const { addItemToNextFreePos, inventory } = useInventory(5);

function addRandomItem() {
  const index = getRandomIntegerInclusive(0, sampleItems.length - 1);
  if (sampleItems[index]) {
    let add = addItemToNextFreePos(sampleItems[index]);
    console.log(add);
  }

  console.log(inventory.value);
}
</script>

<template>
  <main class="h-dvh w-dvh">
    <Inventory :inventory="inventory" :size="5" />
    <ItemBank :items="itemBankItems" @add="addRandomItem" />
    <TresCanvas clear-color="#82DBC5" window-size>
      <FirstExperience />
    </TresCanvas>
  </main>
</template>
