<script setup lang="ts">
const donutRef = ref();

const { onBeforeRender } = useLoop();
onBeforeRender(({ elapsed }) => {
  if (donutRef.value) {
    donutRef.value.rotation.x = elapsed * 0.5;
    donutRef.value.rotation.y = elapsed * 0.3;
  }
});
</script>

<template>
  <TresPerspectiveCamera :position="[7, 7, 7]" :look-at="[0, 0, 0]" />
  <TresMesh :position="[0, 2, 0]" ref="donutRef">
    <TresTorusGeometry :args="[1, 0.4, 16, 32]" />
    <TresMeshBasicMaterial color="#ff6b35" />
  </TresMesh>
  <TresAxesHelper />
  <TresGridHelper />
</template>
