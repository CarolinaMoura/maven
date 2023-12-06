<script setup lang="ts">
import { onBeforeMount, ref } from "vue";

const loaded = ref(false);
const showRequests = ref(true);
const requests = ref();
const contributions = ref();

onBeforeMount(async () => {
  try {
    await userStore.updateSession();
    await tagStore.getLanguageTags();
    await tagStore.getOtherTags();
    await translationRequestsStore.getTranslationRequests({});
  } catch {
    // User is not logged in
  }
});
</script>
<template>
  <main class="view-container">
    <v-btn-toggle v-model="showRequests" rounded="0" color="#95AEB3" group>
      <v-btn :value="true"> Requested Translations </v-btn>
      <v-btn :value="false"> Contributed Translations </v-btn>
    </v-btn-toggle>
    <div class="requests-container">hi</div>
  </main>
</template>
<style scoped>
.requests-container {
  outline: 1px solid var(--tertiary);
  padding: 1em;
}
</style>
