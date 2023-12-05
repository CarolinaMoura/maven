<script setup lang="ts">
import { onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["translationId"]);
const translationId = ref<string>(props.translationId);
const translation = ref();

async function loadTranslation() {
  const translationResult = await fetchy(`/api/sectionTranslation/byId/${translationId.value}`, "GET");
  translation.value = translationResult.translation;
}

onBeforeMount(async () => {
  await loadTranslation();
});
</script>

<template>
  <div class="base">
    <p class="text">{{ translation }}</p>
  </div>
</template>

<style scoped>
p {
  margin: 0em;
}

.text {
  font-weight: bold;
  font-size: 1.2em;
}

.base {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.base article:only-child {
  margin-left: auto;
}
</style>
