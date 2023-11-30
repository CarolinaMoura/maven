<script setup lang="ts">
import { Author } from "../../types";
// const loaded = ref(false);
// const props = defineProps(["translationRequest"]);
// const document = ref();

// onBeforeMount(async () => {
//   const fetchedDocument = await fetchy("/api/document", "GET", { query: { _id: props.translationRequest.document } });
//   document.value = fetchedDocument;
//   loaded.value = true;
// });

const props = defineProps(["document"]);
</script>

<template>
  <div class="preview-container column">
    <p>{{ props.document.title }}</p>
    <p>
      {{
        props.document.authors
          .map((a: Author) => {
            return `${a.first} ${a.last}`;
          })
          .join(", ")
      }}
    </p>

    <p>{{ `Published ${props.document.year}` }}</p>
    <p>{{ props.document.domain }}</p>
  </div>
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
