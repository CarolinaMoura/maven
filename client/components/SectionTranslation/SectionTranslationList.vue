<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { ISectionTranslation } from "./ISectionTranslation";
import SectionTranslationForm from "./SectionTranslationForm.vue";

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
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
  <SectionTranslationForm v-if="isLoggedIn" @refreshSectionTranslations="getAllSectionTranslations" :section="props.section" />
</template>
