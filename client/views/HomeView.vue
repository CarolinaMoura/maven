<script setup lang="ts">
import Filter from "@/components/Filter/Filter.vue";
import TranslationRequestForm from "@/components/TranslationRequest/TranslationRequestForm.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import LoginWarning from "../components/Login/LoginWarning.vue";
import TranslationRequestPreview from "../components/TranslationRequest/TranslationRequestPreview.vue";
import { useTranslationRequestsStore } from "../stores/translationRequests";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const translationRequestsStore = useTranslationRequestsStore();
const { translationRequests } = storeToRefs(useTranslationRequestsStore());

const loaded = ref(false);

async function getRequests() {
  loaded.value = false;
  await translationRequestsStore.getTranslationRequests();
  loaded.value = true;
}

onBeforeMount(async () => {
  await getRequests();
});
</script>

<template>
  <main class="view-container">
    <LoginWarning v-if="!isLoggedIn"></LoginWarning>

    <v-row>
      <v-col :md="4" class="controls-container">
        <TranslationRequestForm @refresh-requests="getRequests" />
        <Filter />
      </v-col>
      <v-col :md="8">
        <div class="requests-container">
          <div v-for="request in translationRequests" v-bind:key="request._id">
            <TranslationRequestPreview :request="request" @refresh-requests="getRequests"></TranslationRequestPreview>
          </div>
        </div>
      </v-col>
    </v-row>
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
  padding: 0 1.5rem;
  width: 100%;
}

.controls-container {
  display: flex;
  flex-direction: column;
  row-gap: 1em;
  align-items: center;
}
.requests-container {
  display: flex;
  flex-direction: column;
  row-gap: 1em;
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
