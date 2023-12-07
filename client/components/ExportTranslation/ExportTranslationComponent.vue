<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import SectionComponent from "../Section/SectionComponent.vue";
import ChooseTranslationComponent from "./ChooseTranslationComponent.vue";
import TranslationComponent from "./TranslationComponent.vue";
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
}

function logSection(section: string) {
  activeSection.value = section == activeSection.value ? "" : section;
}

function updateChosen(sectionIdx: number, translationId: string) {
  chosenTranslations.value[sectionIdx] = translationId;
}

onBeforeMount(async () => {
  await getSections();
  loaded.value = true;
});

async function copyToClipboard(text: string) {
  console.log(text);
  await navigator.clipboard.writeText(text);
}

const displayTranslation = ref("");
const isActive = ref(false);
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

const dialogVisible = ref(false);
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
    <div class="header-container">
      <h2>Original Text</h2>
    </div>
    <div class="sections-container" v-for="(section, idx) in sections" :key="section._id">
      <SectionComponent :section="section" @click="logSection(section._id)" :class="{ 'active-section': section._id == activeSection }" />
      <div v-if="activeSection == section._id">
        <ChooseTranslationComponent v-bind:section="section" v-bind:chosenTranslation="chosenTranslations[idx]" @refresh-chosen="(id) => updateChosen(idx, id)" />
      </div>
      <div v-else-if="activeSection.length === 0">
        <TranslationComponent :translation-id="chosenTranslations[idx]" />
      </div>
    </div>
  </section>
  <p v-else-if="loaded">No sections found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
.export-button {
  text-align: center;
  font-size: 2em;
  width: 20%;
  margin-left: 40%;
}
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
