<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import SectionComponent from "../Section/SectionComponent.vue";
import TranslationComponent from "./TranslationComponent.vue";
import ChooseTranslationComponent from "./ChooseTranslationComponent.vue";
import { useToastStore } from "@/stores/toast";

const props = defineProps(["sectionsIds"]);
const loaded = ref(false);
const sections = ref();
const chosenTranslations = ref(Array<string | undefined>());
const { showToast } = useToastStore();

// let sections = ref<Array<Record<string, any>>>([]);
const activeSection = ref<string>("");

async function getSections() {
  let sectionResults;
  try {
    const sectionPromises = props.sectionsIds.map(async (id: string) => {
      return await fetchy(`/api/section/${id}`, "GET");
    });
    sectionResults = await Promise.all(sectionPromises);
  } catch (_) {
    return;
  }
  sections.value = sectionResults;
  chosenTranslations.value = await Promise.all(
    sectionResults.map(async (section): Promise<any> => {
      const chosenTranslation = await fetchy(`/api/getTranslation/byUpvotes/${section._id}`, "GET");
      if (chosenTranslation.found) {
        return chosenTranslation.translation;
      } else {
        return undefined;
      }
    }),
  );
  console.log("chosenTranslations.value ", chosenTranslations.value);
}

function logSection(section: string) {
  activeSection.value = section == activeSection.value ? "" : section;
}

function updateChosen(sectionIdx: Number, translationId: string) {
  chosenTranslations.value[sectionIdx] = translationId;
}

const displayTranslation = ref("");
async function exportTranslation() {
  if (chosenTranslations.value.includes(undefined)) {
    showToast({ message: "Exporting cannot be done without valid translations for each section", style: "error" });
    return;
  }

  const exportedTranslation = await fetchy("/api/export", "POST", { body: { chosenTranslations: chosenTranslations.value } });
  console.log("exportedTranslation ", exportedTranslation);
  displayTranslation.value = exportedTranslation;
}

onBeforeMount(async () => {
  await getSections();
  loaded.value = true;
});
</script>

<template>
  <section class="sections" v-if="loaded && sections.length !== 0">
    <div class="header-container">
      <h2>Original Text</h2>
    </div>
    <div class="sections-container" v-for="(section, idx) in sections" :key="section._id">
      <article @click="logSection(section._id)" :class="{ 'active-section': section._id == activeSection }">
        <SectionComponent :section="section" />
      </article>
      <div v-if="activeSection == section._id">
        <ChooseTranslationComponent v-bind:section="section" v-bind:chosenTranslation="chosenTranslations[idx]" @refresh-chosen="(id) => updateChosen(idx, id)" />
      </div>
      <div v-else>
        <TranslationComponent :translation-id="chosenTranslations[idx]" />
      </div>
    </div>
    <button @click="exportTranslation">EXPORT TRANSLATION</button>
    <div>{{ displayTranslation }}</div>
  </section>
  <p v-else-if="loaded">No sections found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
h2 {
  margin-bottom: 0px;
}

.instruction {
  margin-left: auto;
  overflow-y: auto;
  width: 90%;
}

.active-section {
  border: 2px solid rgb(15, 133, 78);
}

.header-container {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 0 2rem;
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

.sections-container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-gap: 10px;
}

@media (min-width: 800px) {
  .sections-container {
    grid-template-columns: 1fr 1fr;
    grid-gap: 0;
  }
}
</style>
