<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { ISectionTranslation } from "./ISectionTranslation";
import SectionTranslationForm from "./SectionTranslationForm.vue";

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const props = defineProps(["section"]);
const sectionTranslations = ref<Array<ISectionTranslation>>([]);

const getAllSectionTranslations = async () => {
  try {
    const translations = await fetchy(`/api/sectionTranslation/${props.section}`, "GET");
    sectionTranslations.value = translations;
  } catch (_) {
    ``;
    return Error("Failed to get section translations");
  }
};

onBeforeMount(async () => {
  try {
    await getAllSectionTranslations();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <div class="wrapper">
    <div class="section-translation-container">
      <header>
        <h2>Translated Text</h2>
        <i>Showing all translations for section</i>
      </header>
      <SectionTranslationForm v-if="isLoggedIn" @refreshSectionTranslations="getAllSectionTranslations" :section="props.section" />
      <div class="section-translation-list">
        <div v-for="translation in sectionTranslations" :key="translation._id">
          <p>{{ translation.translation }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
header {
  margin: 1rem 0;
}

.wrapper {
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  /* align-items: center; */
}

h2 {
  font-weight: normal;
}

.section-translation-container {
  position: absolute;
  overflow: auto;
}

/* @media screen and (min-width: 768px) {
  .section-translation-container {
  }
} */
</style>
