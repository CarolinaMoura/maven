<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import LoginWarning from "../components/Login/LoginWarning.vue";
import SectionListComponent from "../components/Section/SectionListComponent.vue";
import TranslationRequestPreview from "../components/TranslationRequest/TranslationRequestPreview.vue";
import { fetchy } from "../utils/fetchy";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["id"]);
const loaded = ref(false);
const translationRequest = ref();
const error = ref(false);

async function getTranslationRequest() {
  try {
    const fetchedTranslationRequest = await fetchy(`/api/translationRequest/${props.id}`, "GET");
    translationRequest.value = fetchedTranslationRequest;
  } catch (e) {
    console.log("ERROR");
    translationRequest.value = undefined;
    error.value = true;
  } finally {
    loaded.value = true;
  }
}

onBeforeMount(async () => {
  await getTranslationRequest();
});
</script>

<template>
  <main class="view-container">
    <section>
      <LoginWarning v-if="!isLoggedIn"></LoginWarning>
    </section>

    <div v-if="loaded">
      <TranslationRequestPreview :request="translationRequest"></TranslationRequestPreview>
      <RouterLink :to="`/exportTranslation/${props.id}`" class="export-button">
        <v-btn> Export Translation </v-btn>
      </RouterLink>
      <SectionListComponent :sectionsIds="translationRequest.sections" :requestId="props.id" />
    </div>

    <div v-if="error">Translation request could not be found.</div>
  </main>
</template>

<style scoped>
.export-button {
  text-align: center;
  font-size: 2em;
}
h1 {
  text-align: center;
}
</style>
