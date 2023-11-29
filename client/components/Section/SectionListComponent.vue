<script setup lang="ts">
import SectionComponent from "@/components/Section/SectionComponent.vue";
import SectionTranslationForm from "@/components/Section/SectionTranslationForm.vue";
import { fetchy } from "@/utils/fetchy";
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
let sections = ref<Array<Record<string, string>>>([]);
let editing = ref("");

async function getSections() {
  let sectionResults;
  try {
    sectionResults = await fetchy("/api/sections", "GET", {});
  } catch (_) {
    return;
  }
  sections.value = sectionResults;
}

function updateEditing(id: string) {
  editing.value = id;
}

onBeforeMount(async () => {
  await getSections();
  loaded.value = true;
});
</script>

<template>
  <section class="sections" v-if="loaded && sections.length !== 0">
    <article v-for="section in sections" :key="section._id">
      <SectionComponent v-if="editing !== section._id" :section="section"  @editPost="updateEditing" />
      <SectionTranslationForm v-else :section="section" @refreshPosts="getSections" @editPost="updateEditing" />
    </article>
  </section>
  <p v-else-if="loaded">No sections found</p>
  <p v-else>Loading...</p>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

section,
p,
.row {
  margin: 0 auto;
  max-width: 60em;
}

article {
  background-color: var(--base-bg);
  border-radius: 1em;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

.sections {
  padding: 1em;
}

.row {
  display: flex;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 60em;
}
</style>
