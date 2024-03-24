<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["language"]);
const emit = defineEmits(["refreshTags"]);
const tagName = ref("");
const isLanguage = ref(props.language);
const menu = ref(false);

const createTag = async (tagName: string, isLanguage: boolean) => {
  try {
    await fetchy("/api/tag", "POST", {
      body: { name: tagName, isLanguage },
    });
    menu.value = false;
    emit("refreshTags");
  } catch (_) {
    return;
  }

  emit("refreshTags");
  emptyForm();
};

const emptyForm = () => {
  tagName.value = "";
  isLanguage.value = props.language;
};
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="end">
    <template v-slot:activator="{ props }">
      <v-btn variant="plain" v-bind="props" icon="mdi-plus-circle-outline"></v-btn>
    </template>
    <v-card min-width="400" max-width="500">
      <form @submit.prevent="createTag(tagName, isLanguage)">
        <template v-if="!isLanguage">
          <label for="tagName">Tag</label>
          <v-textarea rows="1" id="tagName" v-model="tagName" placeholder="Enter the tag name" required> </v-textarea>
        </template>
        <template v-if="isLanguage">
          <label for="tagName">Language</label>
          <v-textarea rows="1" id="tagName" v-model="tagName" placeholder="Enter the language" required> </v-textarea>
        </template>
        <v-btn type="submit" class="pure-button-primary pure-button">Create!</v-btn>
      </form>
    </v-card>
  </v-menu>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}
</style>
