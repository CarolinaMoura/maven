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
const requests = ref();

async function getRequests() {
  loaded.value = false;
  const fetchedRequests = await fetchy("/api/translationRequest", "GET");
  requests.value = fetchedRequests;
  loaded.value = true;
}

onBeforeMount(async () => {
  await getRequests();
});
</script>

<template>
  <main>
    <h1>Home Page</h1>
    <section>
      <h1 v-if="isLoggedIn"></h1>
      <h1 v-else>Please login!</h1>
    </section>
    <TranslationRequestForm @refresh-requests="getRequests" />
    <TranslationRequestList />

    <v-row>
      <v-col :sm="4"> </v-col>
      <v-col :sm="8">
        <TranslationRequestPreview v-for="request in requests" :request="request" v-bind:key="request._id" @refresh-requests="getRequests"></TranslationRequestPreview>
      </v-col>
    </v-row>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
