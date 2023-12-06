<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import SectionListComponent from "../components/Section/SectionListComponent.vue";
import TranslationRequestPreview from "../components/TranslationRequest/TranslationRequestPreview.vue";
import { fetchy } from "../utils/fetchy";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const props = defineProps(["id"]);
const loaded = ref(false);
const translationRequest = ref();

async function getTranslationRequest() {
  console.log(props.id);
  const fetchedTranslationRequest = await fetchy(`/api/translationRequest/${props.id}`, "GET");
  console.log("fetchedTranslationRequest ", fetchedTranslationRequest);
  translationRequest.value = fetchedTranslationRequest;
}

onBeforeMount(async () => {
  await getTranslationRequest();
  loaded.value = true;
});
</script>

<template>
  <main>
    <h1>Translation Page</h1>
    <section>
      <h1 v-if="isLoggedIn"></h1>
      <h1 v-else>Please login!</h1>
    </section>

    <div v-if="loaded">
      <TranslationRequestPreview :request="translationRequest"></TranslationRequestPreview>
      <SectionListComponent :sectionsIds="translationRequest.sections" :requestId="props.id" />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
