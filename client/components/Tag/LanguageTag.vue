<script setup lang="ts">
import { iso6392 } from "iso-639-2";
import { LANGUAGE_MAP } from "../../utils/languages";

const props = defineProps(["language"]);
const data = LANGUAGE_MAP.get(props.language);

function getLanguageCode(name: string): string | undefined {
  const language = iso6392.find((entry) => {
    const allNames = entry.name.split(";").map((altName) => altName.toLowerCase());
    return allNames.includes(name.toLowerCase());
  });
  return language ? language.iso6392B.toUpperCase() : "";
}

const code = getLanguageCode(props.language);
</script>

<template>
  <v-tooltip :text="props.language">
    <template v-slot:activator="{ props }">
      <div class="language-tag" v-bind="props" :style="{ 'background-color': `${data?.color}` }">
        <p>{{ code }}</p>
      </div>
    </template></v-tooltip
  >
</template>

<style scoped>
.language-tag {
  color: var(--primary-text);
  padding: 0.5em 1em;
  border-radius: 45px;
  font-size: 16px;
  width: fit-content;
}
</style>
