<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import LoaderComponent from "../LoaderComponent.vue";
import SectionTranslationList from "../SectionTranslation/SectionTranslationList.vue";
import SectionComponent from "./SectionComponent.vue";

const props = defineProps(["sectionsIds", "requestId"]);
const loaded = ref(false);
const sections = ref();

// let sections = ref<Array<Record<string, any>>>([]);
let editing = ref("");
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
}

function logSection(section: string) {
  activeSection.value = section == activeSection.value ? "" : section;
}

onBeforeMount(async () => {
  await getSections();
  loaded.value = true;
});
</script>

<template>
  <section class="sections" v-if="loaded && sections.length !== 0">
    <v-row>
      <v-col sm="6">
        <v-card-title>Original Text</v-card-title>
        <v-card-subtitle class="instruction" v-if="!activeSection">(Click on a section to view and rate all translations for that section)</v-card-subtitle>
      </v-col>
    </v-row>
    <div class="sections-container" v-for="section in sections" :key="section._id">
      <SectionComponent :section="section" @click="logSection(section._id)" :class="{ 'active-section': section._id == activeSection }" />
      <SectionTranslationList :section="section._id" v-if="section._id == activeSection" class="section-translation-list" />
    </div>
    <RouterLink :to="`/exportTranslation/${props.requestId}`" class="export-button"> EXPORT TRANSLATION</RouterLink>
  </section>
  <p v-else-if="loaded">No sections found</p>
  <LoaderComponent v-else></LoaderComponent>
</template>

<style scoped>
.export-button {
  text-align: center;
  font-size: 2em;
}
h2 {
  margin-bottom: 0px;
}

.instruction {
  font-style: italic;
}

.active-section {
  border: 2px solid var(--secondary);
}

.header-container {
  display: flex;
  flex-direction: column;
}

.sections {
  padding: 2em 0;

  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 0 2rem;
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
