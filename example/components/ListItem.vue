<script setup lang="ts">
defineProps({
  itemNumber: {
    type: Number,
    required: true,
  },
});
const height = [Math.random() * 100 + 100, "px"].join("");
</script>
<template>
  <div :style="{ height }">
    <p>item: {{ itemNumber }}</p>
  </div>
</template>

<style scoped>
div {
  background: #fcc;
}
</style>
