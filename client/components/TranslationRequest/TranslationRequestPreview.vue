<script setup lang="ts">
import Tag from "@/components/Tag/Tag.vue";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { Author } from "../../types";
import { fetchy } from "../../utils/fetchy";
const { currentUsername } = storeToRefs(useUserStore());

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
</script>

<template>
  <v-card v-if="loaded" class="preview-card card" hover>
    <v-btn v-if="currentUsername === request.requester" variant="plain" @click="deleteRequest"><v-icon>mdi-trash-can</v-icon></v-btn>
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
    <p>{{ `${document.originalLanguage} ==> ${request.languageTo}` }}</p>

    <div class="row">
      <Tag v-for="tag in tags" :key="tag">{{ tag }}</Tag>
    </div>
    <RouterLink :to="{ name: 'Translation', params: { id: props.request._id } }">View Translations</RouterLink>
    <v-btn>request translation in a different language</v-btn>
  </v-card>

  <div v-else class="preview-container column">Loading...</div>
</template>

<style>
.preview-card.card {
  align-items: start;
  background-color: var(--secondary-20);
  border-radius: 10px;
  padding: 1.5em;
  margin-bottom: 1em;
}
</style>
