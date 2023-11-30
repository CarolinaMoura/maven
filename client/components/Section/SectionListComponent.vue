<script setup lang="ts">
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";
import SectionTranslationList from "../SectionTranslation/SectionTranslationList.vue";
import SectionComponent from "./SectionComponent.vue";

const loaded = ref(false);
let sections = ref<Array<Record<string, any>>>([]);
let editing = ref("");
const activeSection = ref<string>("");

async function getSections() {
  let sectionResults;
  try {
    sectionResults = await fetchy("/api/section", "GET", {});
  } catch (_) {
    return;
  }
  sections.value = sectionResults;
  console.log(sectionResults);
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
    <h2>Original Text</h2>
    <div class="sections-container" v-for="section in sections" :key="section._id">
      <article>
        <SectionComponent @click="logSection(section._id)" :section="section" />
      </article>
      <SectionTranslationList :section="section" v-if="section._id == activeSection" class="section-translation-list" />
      <!-- <SectionTranslationForm v-else :section="section" @refreshPosts="getSections" @editPost="updateEditing" /> -->
    </div>
  </section>
  <p v-else-if="loaded">No sections found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
h2 {
  margin-left: 50px;
  margin-bottom: 0px;
}

.sections {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

article {
  background-color: var(--base-bg);
  border-radius: 20px;
  padding: 20px;
  margin: 1px 0;
  margin-left: 50px;
  width: 50%;
  cursor: pointer;
}

.sections-container {
  display: flex;
  justify-content: left;
}

/*////////////////////
//   Responsivity   //
/////////////////////*/

.section-translation-list {
  margin-left: 5%;
}

@media (min-width: 1250px) {
  .section-translation-list {
    margin-left: 10%;
  }
}
</style>
