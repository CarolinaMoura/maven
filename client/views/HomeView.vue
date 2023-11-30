<script setup lang="ts">
import TranslationRequestList from "@/components/Translation/TranslationRequestList.vue";
import TranslationRequestForm from "@/components/TranslationRequest/TranslationRequestForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import TranslationRequestPreview from "../components/TranslationRequest/TranslationRequestPreview.vue";
import { fetchy } from "../utils/fetchy";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const loaded = ref(false);
const documents = ref();

async function getDocuments() {
  loaded.value = false;
  const fetchedDocuments = await fetchy("/api/document", "GET");
  documents.value = fetchedDocuments;
  loaded.value = true;
}

onBeforeMount(async () => {
  await getDocuments();
});
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn"></h1>
      <h1 v-else>Please login!</h1>
    </section>
    <TranslationRequestForm @refresh-documents="getDocuments" />
    <TranslationRequestList />

    <div>
      UPLOADED DOCUMENTS (FOR ALPHA)
      <TranslationRequestPreview v-for="document in documents" :document="document" v-bind:key="document._id"></TranslationRequestPreview>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
