<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ExportTranslationComponent from "../components/ExportTranslation/ExportTranslationComponent.vue";
import TranslationRequestPreview from "../components/TranslationRequest/TranslationRequestPreview.vue";
import { fetchy } from "../utils/fetchy";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["id"]);
const loaded = ref(false);
const translationRequest = ref();

async function getTranslationRequest() {
  const fetchedTranslationRequest = await fetchy(`/api/translationRequest/${props.id}`, "GET");
  translationRequest.value = fetchedTranslationRequest;
}

onBeforeMount(async () => {
  await getTranslationRequest();
  loaded.value = true;
});
</script>

<template>
  <main class="view-container">
    <div class="col">
      <h1>Export Translation</h1>
      <section v-if="loaded">
        <TranslationRequestPreview :request="translationRequest"></TranslationRequestPreview>
      </section>

      <div v-if="loaded">
        <ExportTranslationComponent :sectionsIds="translationRequest.sections" />
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
  font-weight: normal;
}

.col {
  display: flex;
  flex-direction: column;
  row-gap: 3em;
}
</style>
