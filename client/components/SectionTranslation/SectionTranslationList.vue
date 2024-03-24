<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import { PayloadSectionTranslation } from "./PayloadSectionTranslation";
import SectionTranslationCard from "./SectionTranslationCard.vue";
import SectionTranslationForm from "./SectionTranslationForm.vue";

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const props = defineProps(["section"]);
const sectionTranslations = ref<Array<PayloadSectionTranslation>>([]);

const getAllSectionTranslations = async () => {
  try {
    const translations = await fetchy(`/api/sectionTranslation/${props.section}`, "GET");
    sectionTranslations.value = sectionTranslations.value.filter(() => false);
    sectionTranslations.value.push(...translations);
  } catch (_) {
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
        <v-card-title class="text">Translated Text</v-card-title>
        <v-card-subtitle><i>Showing all translations for section</i></v-card-subtitle>
      </header>
      <div class="grid-1em">
        <SectionTranslationForm v-if="isLoggedIn" @refreshSectionTranslations="getAllSectionTranslations"
          :section="props.section" />
        <div class="section-translation-list grid-1em">
          <div v-if="sectionTranslations.length" v-for="translation in sectionTranslations" :key="translation._id">
            <SectionTranslationCard :sectionTranslation="translation"
              @refreshSectionTranslations="getAllSectionTranslations" />
          </div>
          <p v-else>Nothing to see here... Be the first to translate!</p>
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
}

.section-translation-container {
  padding-bottom: 100px;
}

.text {
  font-family: tweb;
}

h2 {
  font-weight: normal;
}

.grid-1em {
  display: flex;
  flex-direction: column;
  gap: 1em;
  /* justify-content: center; */
}

.section-translation-list {
  width: 100%;
}

.section-translation-container {
  position: absolute;
  overflow-y: auto;
  width: 90%;
}

@media screen and (min-width: 768px) {
  .section-translation-container {
    width: 80%;
  }
}</style>
