<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { Author } from "../../types";
import { fetchy } from "../../utils/fetchy";
const { currentUsername } = storeToRefs(useUserStore());

const loaded = ref(false);
const document = ref();

onBeforeMount(async () => {
  const fetchedDocument = await fetchy(`/api/document/${props.request.document}`, "GET");
  document.value = fetchedDocument;
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
  <div v-if="loaded" class="preview-container column">
    <v-btn v-if="currentUsername === request.requester" variant="plain" @click="deleteRequest"><v-icon>mdi-trash-can</v-icon></v-btn>
    <p>{{ document.title }}</p>
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
    <p v-for="tag in document.tags" :key="tag">{{ tag }}</p>
  </div>
  <div v-else class="preview-container column">Loading...</div>
</template>

<style>
.preview-container {
  align-items: start;
  background-color: var(--secondary);
  border-radius: 10px;
  padding: 1em;
  margin-bottom: 1em;
}
</style>
