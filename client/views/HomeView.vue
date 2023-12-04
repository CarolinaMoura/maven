<script setup lang="ts">
import Filter from "@/components/Filter/Filter.vue";
import TranslationRequestList from "@/components/Translation/TranslationRequestList.vue";
import TranslationRequestForm from "@/components/TranslationRequest/TranslationRequestForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import TranslationRequestPreview from "../components/TranslationRequest/TranslationRequestPreview.vue";
import { useTranslationRequestsStore } from "../stores/translationRequests";
import { fetchy } from "../utils/fetchy";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { translationRequests } = storeToRefs(useTranslationRequestsStore());
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

    <div class="documents-display">
      <Filter />

      <div>
        TRANSLATION REQUESTS
        <TranslationRequestPreview v-for="request in translationRequests" :request="request" v-bind:key="request._id" @refresh-requests="getRequests"></TranslationRequestPreview>
      </div>
    </div>
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}

.documents-display {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 0 1.5rem;
  width: 100%;
}

@media (min-width: 700px) {
  .documents-display {
    display: grid;
    grid-template-columns: 1fr 2fr;
  }
}

@media screen and (min-width: 900px) {
  .documents-display {
    display: grid;
    grid-template-columns: 1fr 3fr;
  }
}
</style>
