<script setup lang="ts">

const props = defineProps(["section"]);
// const emit = defineEmits([""]);

</script>

<template>
  <div class="base">
    <p class="text">{{ props.section.text }}</p>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.text {
  font-weight: bold;
  font-size: 1.2em;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
