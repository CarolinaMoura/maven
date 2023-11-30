<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const tagName = ref("");
const isLanguage = ref(false);

const createTag = async (tagName: string, isLanguage: boolean) => {
  try {
    await fetchy("/api/tag", "POST", {
      body: { name: tagName, isLanguage },
    });
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
    <label for="tagName">Tag Name:</label>
    <textarea id="tagName" v-model="tagName" placeholder="Type in Tag Name!" required> </textarea>

    <input type="checkbox" id="checkbox" v-model="isLanguage" />
    <label for="checkbox">Is Language: {{ isLanguage }}</label>

    <button type="submit" class="pure-button-primary pure-button">Create Tag</button>
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
