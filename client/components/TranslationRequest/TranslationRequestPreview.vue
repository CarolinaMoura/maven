<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Author } from "../../types";
import { fetchy } from "../../utils/fetchy";
import LanguageTag from "../Tag/LanguageTag.vue";
import Tag from "../Tag/Tag.vue";
import TranslationRequestFromDocumentForm from "./TranslationRequestFromDocumentForm.vue";
const { currentUsername } = storeToRefs(useUserStore());

const router = useRouter();
const route = useRoute();

const loaded = ref(false);
const document = ref();
const tags = ref();

onBeforeMount(async () => {
  const fetchedDocument = await fetchy(`/api/document/${props.request.document}`, "GET");
  const fetchedTags = await fetchy(`/api/tag/object/${fetchedDocument._id}`, "GET");
  document.value = fetchedDocument;
  tags.value = fetchedTags;
  loaded.value = true;
});

const props = defineProps(["request"]);
const emit = defineEmits(["refreshRequests"]);

async function deleteRequest() {
  await fetchy(`/api/translationRequest/${props.request._id}`, "DELETE");
  emit("refreshRequests");
}

async function toTranslations() {
  await router.push({ path: `/translationRequest/${props.request._id}` });
}
</script>

<template>
  <v-card v-if="loaded" class="preview-card card" hover @click="toTranslations">
    <div class="card-container">
      <div class="card-content">
        <div>
          <h3>{{ document.title }}</h3>
          <p>
            {{
              document.authors
                .map((a: Author) => {
                  return `${a.first} ${a.last}`;
                })
                .join(", ")
            }}
          </p>

          <p>{{ `Published ${document.year}` }}</p>
          <p>{{ request.description }}</p>
        </div>

        <div class="row small">
          <LanguageTag :langauge="document.originalLanguage"></LanguageTag>
          <v-icon>mdi-arrow-right</v-icon>
          <LanguageTag :langauge="request.languageTo"></LanguageTag>
        </div>

        <div class="row">
          <Tag v-for="tag in tags" :key="tag">{{ tag }}</Tag>
        </div>
      </div>

      <div class="card-actions">
        <v-tooltip text="See translations">
          <template v-slot:activator="{ props }">
            <v-btn variant="plain" v-bind="props" icon="mdi-translate-variant" @click="toTranslations"></v-btn>
          </template>
        </v-tooltip>

        <v-tooltip text="Request translation in a different language">
          <template v-slot:activator="{ props }">
            <TranslationRequestFromDocumentForm v-bind="props" :document="document" @refresh-requests="emit('refreshRequests')"></TranslationRequestFromDocumentForm>
          </template>
        </v-tooltip>
        <v-tooltip text="Delete request">
          <template v-slot:activator="{ props }">
            <v-btn v-if="currentUsername === request.requester" v-bind="props" variant="plain" @click="deleteRequest" icon="mdi-trash-can"></v-btn>
          </template>
        </v-tooltip>
      </div>
    </div>
  </v-card>

  <v-card v-else class="preview-card card" hover>
    <div class="loading-state"><v-progress-circular indeterminate></v-progress-circular></div>
  </v-card>
</template>

<style scoped>
h3 {
  font-size: 24px;
  font-weight: normal;
}

.card-container {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.card-actions {
  display: flex;
  flex-direction: column;
  row-gap: 0em;
}

.card-content {
  display: flex;
  flex-direction: column;
  row-gap: 1em;
}
.heading {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
  width: 100%;
}

.small {
  row-gap: 0em;
  column-gap: 0em;
}
.preview-card.card {
  color: var(--primary-text);
  align-items: start;
  background-color: var(--secondary-20);
  border-radius: 10px;
  padding: 1.5em;
}

.loading-state {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
