<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["translationId"]);
const translationId = ref<string>(props.translationId);
const translation = ref();

async function loadTranslation() {
  console.log("translationId.value ", translationId.value);
  if (!translationId.value) {
    translation.value = "No translation found";
    return;
  }
  const translationResult = await fetchy(`/api/sectionTranslation/byId/${translationId.value}`, "GET");
  translation.value = translationResult.translation;
}

onBeforeMount(async () => {
  await loadTranslation();
});
</script>

<template>
  <div class="base" :class="{ 'no-translation': translation === 'No translation found' }">
    <p class="text-body-1 font-weight-regular">{{
      translation }}</p>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.no-translation {
  color: red;
  font-style: italic;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 20px;
}

.base article:only-child {
  margin-left: auto;
}
</style>
