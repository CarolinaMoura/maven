<script setup lang="ts">
import { LANGUAGE_MAP } from "../../utils/languages";
const props = defineProps(["langauge"]);
const data = LANGUAGE_MAP.get(props.langauge);
</script>

<template>
  <v-tooltip :text="props.langauge">
    <template v-slot:activator="{ props }">
      <div class="language-tag" v-bind="props" :style="{ 'background-color': `${data?.color}` }">
        <p>{{ data?.abbreviation }}</p>
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
}
</style>
