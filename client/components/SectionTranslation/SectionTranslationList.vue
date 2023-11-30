<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { ISectionTranslation } from "./ISectionTranslation";
import SectionTranslationForm from "./SectionTranslationForm.vue";

const props = defineProps(["section"]);
const sectionTranslations = ref<Array<ISectionTranslation>>([]);

const getAllSectionTranslations = async () => {
  try {
    const translations = await fetchy("/api/sectionTranslation", "GET");
    sectionTranslations.value = translations;
  } catch (_) {
    return Error("Failed to get section translations");
  }
};
</script>

<template>
  <SectionTranslationForm @refreshSectionTranslations="getAllSectionTranslations" :section="props.section" />
</template>
