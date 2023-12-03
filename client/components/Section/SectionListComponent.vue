<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import SectionTranslationList from "../SectionTranslation/SectionTranslationList.vue";
import SectionComponent from "./SectionComponent.vue";

const props = defineProps(["sectionsIds"]);
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
  console.log("Clicked Section:", section);
  activeSection.value = section == activeSection.value ? "" : section;
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
      <h2 class="instruction" v-if="!activeSection">(select a section)</h2>
    </div>
    <div class="sections-container" v-for="section in sections" :key="section._id">
      <article @click="logSection(section._id)" :class="{ 'active-section': section._id == activeSection }">
        <SectionComponent :section="section" />
      </article>
      <SectionTranslationList :section="section._id" v-if="section._id == activeSection" class="section-translation-list" />
    </div>
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
