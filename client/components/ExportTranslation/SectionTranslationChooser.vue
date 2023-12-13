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
  <v-card hover class="section-translation-card" :class="{ 'is-chosen': isChosen }">
    <p @click="chooseTranslation">{{ translation.translation }}</p>
  </v-card>
</template>

<style scoped>
.is-chosen {
  border: 2px solid var(--primary-dark);
}

p {
  font-family: tweb;
}

.section-translation-card {
  background-color: var(--secondary-20);
  box-sizing: border-box;
  word-wrap: break-word;
  padding: 1em;
}
</style>
