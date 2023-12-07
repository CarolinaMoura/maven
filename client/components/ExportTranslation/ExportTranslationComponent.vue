<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { useToastStore } from "../../stores/toast";
import { fetchy } from "../../utils/fetchy";
import LoaderComponent from "../LoaderComponent.vue";
import SectionComponent from "../Section/SectionComponent.vue";
import ChooseTranslationComponent from "./ChooseTranslationComponent.vue";
import TranslationComponent from "./TranslationComponent.vue";
const props = defineProps(["sectionsIds"]);
const loaded = ref(false);
const sections = ref();
const chosenTranslations = ref(Array<string | undefined>());
const sectionsWithoutTranslation = ref<Array<Record<string, any>>>([]);
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
        sectionsWithoutTranslation.value.push(section);
        return undefined;
      }
    }),
  );
}

function logSection(section: string) {
  activeSection.value = section == activeSection.value ? "" : section;
}

function updateChosen(sectionIdx: number, translationId: string) {
  chosenTranslations.value[sectionIdx] = translationId;
}

const displayTranslation = ref("");
const isActive = ref(false);
const dialogVisible = ref(false);
async function exportTranslation() {
  if (chosenTranslations.value.includes(undefined)) {
    showToast({ message: "Exporting cannot be done without valid translations for each section", style: "error" });
    return;
  }

  const chosenTranslationsIds: string[] = chosenTranslations.value.map((id) => id ?? "");
  const exportedTranslation = await fetchy("/api/export", "POST", {
    body: { chosenTranslations: chosenTranslationsIds },
  });
  displayTranslation.value = exportedTranslation;
  dialogVisible.value = true;
}

onBeforeMount(async () => {
  await getSections();
  loaded.value = true;
});

async function copyToClipboard(text: string) {
  console.log(text);
  await navigator.clipboard.writeText(text);
}
</script>

<template>
  <v-btn @click="exportTranslation" class="export-button">Export</v-btn>
  <v-dialog v-model="dialogVisible" width="1000">
    <v-card title="Translation">
      <v-card-text> {{ displayTranslation }} </v-card-text>

      <v-card-actions>
        <v-btn @click="copyToClipboard(displayTranslation)" class="copy-button">
          <v-icon>mdi-content-copy</v-icon>
        </v-btn>
        <v-spacer></v-spacer>

        <v-btn text="Close" @click="dialogVisible = false"></v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <section class="sections" v-if="loaded && sections.length !== 0">
    <v-row>
      <v-col sm="6">
        <v-card-title>Original Text</v-card-title>
        <v-card-subtitle class="instruction" v-if="!activeSection">(Select a section to see all possible translations!)</v-card-subtitle>
      </v-col>
      <v-col sm="6">
        <v-card-title>Translated Text</v-card-title>
      </v-col>
    </v-row>

    <div class="sections-container" v-for="(section, idx) in sections" :key="section._id">
      <SectionComponent :section="section" @click="logSection(section._id)" :class="{ 'active-section': section._id == activeSection }" />
      <div v-if="activeSection == section._id">
        <ChooseTranslationComponent v-bind:section="section" v-bind:chosenTranslation="chosenTranslations[idx]" @refresh-chosen="(id) => updateChosen(idx, id)" />
      </div>
      <div v-else-if="activeSection.length === 0">
        <TranslationComponent :translation-id="chosenTranslations[idx]" />
      </div>

      <div v-if="idx === sections.length - 1" class="last-section-padding"></div>
    </div>
  </section>
  <p v-else-if="loaded">No sections found</p>
  <LoaderComponent v-else></LoaderComponent>
</template>

<style scoped>
.active-section {
  border: 2px solid var(--secondary);
}

.text-right {
  padding-right: 20px;
  padding-bottom: 20px;
}

.export-button {
  color: white;
  text-align: center;
  font-size: 1.5em;
  width: auto;
  margin: 0;
  position: fixed;
  bottom: 10px;
  right: 30px;
  text-transform: none;
  font-size: 1em;
  background-color: rgb(179, 203, 183);
}

h2 {
  margin-bottom: 0px;
}

.instruction {
  font-style: italic;
  overflow-y: auto;
  width: 90%;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin: 0 2rem;
}

article {
  border-radius: 5px;
  box-sizing: border-box;
  cursor: pointer;
}

.last-section-padding {
  margin-bottom: 30px;
  min-height: 30px;
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
