<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ExportTranslationComponent from "../components/ExportTranslation/ExportTranslationComponent.vue";
import LoginWarning from "../components/Login/LoginWarning.vue";
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
    <h1>Export Translation</h1>
    <section>
      <LoginWarning v-if="!isLoggedIn"></LoginWarning>
    </section>

    <div v-if="loaded">
      <ExportTranslationComponent :sectionsIds="translationRequest.sections" />
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
