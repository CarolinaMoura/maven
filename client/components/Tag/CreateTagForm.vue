<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const tagName = ref("");
const isLanguage = ref(false);
const menu = ref(false);

const createTag = async (tagName: string, isLanguage: boolean) => {
  try {
    await fetchy("/api/tag", "POST", {
      body: { name: tagName, isLanguage },
    });
    menu.value = false;
  } catch (_) {
    return;
  }
  emptyForm();
};

const emptyForm = () => {
  tagName.value = "";
  isLanguage.value = false;
};
</script>

<template>
  <form @submit.prevent="createTag(tagName, isLanguage)">
    <label for="tagName">Tag</label>
    <v-textarea id="tagName" v-model="tagName" placeholder="Type in Tag Name!" required> </v-textarea>
    <v-switch v-model="isLanguage" :label="isLanguage ? 'This tag is a language' : 'This tag is not a language'"
      :label-value="isLanguage" />
    <v-btn type="submit" class="pure-button-primary pure-button">Create Tag</v-btn>
  </form>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  border-radius: 1em;
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
