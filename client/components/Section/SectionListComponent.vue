<script setup lang="ts">
import SectionComponent from "@/components/Section/SectionComponent.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
let sections = ref<Array<Record<string, any>>>([]);
let editing = ref("");

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

function updateEditing(id: string) {
  editing.value = id;
}

function logSection(section: Record<string, any>) {
  console.log("Clicked Section:", section);
}

onBeforeMount(async () => {
  await getSections();
  loaded.value = true;
});

</script>

<template>
  <section class="sections" v-if="loaded && sections.length !== 0">
    <h2>Original Text</h2>
    <article v-for="section in sections" :key="section._id" @click="logSection(section)">
      <SectionComponent v-if="editing !== section._id" :section="section" @editPost="updateEditing" />
      <!-- <SectionTranslationForm v-else :section="section" @refreshPosts="getSections" @editPost="updateEditing" /> -->
    </article>
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

</style>
