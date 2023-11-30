<script setup lang="ts">
import { PayloadSectionTranslation } from "./PayloadSectionTranslation";

interface SectionTranslationProps {
  sectionTranslation: PayloadSectionTranslation;
}
const props = defineProps<SectionTranslationProps>();
</script>

<template>
  <v-card hover class="section-translation-card">
    <v-card-title>
      <b>Translator: </b>
      <u>{{ props.sectionTranslation.translatorName }}</u>
    </v-card-title>
    <v-card-title>Translation:</v-card-title>
    <v-card-text>{{ props.sectionTranslation.translation }}</v-card-text>
  </v-card>
</template>

<style scoped>
.section-translation-card {
  background-color: var(--secondary-20);
  box-sizing: border-box;
  word-wrap: break-word;
  width: 100%;
}
</style>
