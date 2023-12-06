<script setup lang="ts">
import TranslationRequestPreview from "@/components/TranslationRequest/TranslationRequestPreview.vue";
import { onBeforeMount, ref } from "vue";
import SectionComponent from "../components/Section/SectionComponent.vue";
import SectionTranslationCard from "../components/SectionTranslation/SectionTranslationCard.vue";
import { fetchy } from "../utils/fetchy";

const loaded = ref(false);
const showRequests = ref(true);
const requests = ref();
const contributions = ref();

const props = defineProps(["username"]);

onBeforeMount(async () => {
  try {
    const fetchedRequests = await fetchy(`/api/user/requests/${props.username}`, "GET");
    const fetchedContributions = await fetchy(`/api/user/contributions/${props.username}`, "GET");
    requests.value = fetchedRequests;
    contributions.value = fetchedContributions;
    loaded.value = true;
  } catch {
    // User is not logged in
  }
});
</script>
<template>
  <main class="view-container">
    <div>
      <h1>
        {{ props.username }}
        <p>TODO: TRANSLATOR STATISTICS</p>
      </h1>
    </div>

    <v-btn-toggle v-model="showRequests" rounded="0" color="#95AEB3" group>
      <v-btn :value="true"> Requested Translations </v-btn>
      <v-btn :value="false"> Contributed Translations </v-btn>
    </v-btn-toggle>
    <div v-if="showRequests" class="requests-container">
      <TranslationRequestPreview v-for="request in requests" v-bind:key="request._id" :request="request"></TranslationRequestPreview>
    </div>
    <div v-else class="requests-container">
      <v-row v-for="(translation, idx) in contributions.translations" v-bind:key="translation._id">
        <v-col><SectionComponent :section="contributions.sections[idx]"></SectionComponent></v-col>
        <v-col><SectionTranslationCard :section-translation="translation"></SectionTranslationCard></v-col>
        <v-divider></v-divider>
      </v-row>
    </div>
  </main>
</template>
<style scoped>
.requests-container {
  outline: 1px solid var(--tertiary);
  padding: 1em;
  max-height: 80vh;
  overflow-y: scroll;

  display: flex;
  flex-direction: column;
  row-gap: 1em;
}
</style>
