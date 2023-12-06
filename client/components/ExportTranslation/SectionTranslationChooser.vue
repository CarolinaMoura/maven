<script setup lang="ts">
import { computed } from "vue";

const emits = defineEmits(["refresh-chosen"]);
const props = defineProps(["translation", "isChosen"]);
const isChosen = computed(() => props.isChosen);
const translation = computed(() => props.translation);

function chooseTranslation() {
  emits("refresh-chosen");
}
</script>

<template>
  <article @click="chooseTranslation" :class="{ 'is-chosen': isChosen }">{{ translation.translation }}</article>
</template>

<style scoped>
.is-chosen {
  border: 2px solid rgb(15, 133, 78);
}

article {
  background-color: var(--base-bg);
  border-radius: 20px;
  padding: 20px;
  margin: 1px 0;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}
.v-card-actions {
  display: flex;
  flex-direction: column;
}

.section-translation-card {
  background-color: var(--secondary-20);
  box-sizing: border-box;
  word-wrap: break-word;
  width: 100%;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.edit-translation {
  margin: 0.5rem 1rem;
}

.buttons-bar {
  display: flex;
  justify-content: right;
  gap: 0.5rem;
}
</style>
