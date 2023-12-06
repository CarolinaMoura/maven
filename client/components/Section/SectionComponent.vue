<script setup lang="ts">
const props = defineProps(["section"]);
// const emit = defineEmits([""]);
</script>

<template>
  <!-- <div class="base">
    <p class="text">{{ props.section.text }}</p>
  </div> -->

  <v-card class="section">
    <v-card-text>{{ props.section.text }}</v-card-text>
  </v-card>
</template>

<style scoped>
.section {
  background-color: var(--base-bg);
}
</style>
