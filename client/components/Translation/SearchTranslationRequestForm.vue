<script setup lang="ts">
import { ref } from "vue";
const author = ref("");
const emit = defineEmits(["getPostsByAuthor"]);
</script>

<template>
  <form @submit.prevent="emit('getPostsByAuthor', author)" class="pure-form">
    <div class="flex-container">
      <input
        id="author"
        type="text"
        v-model="author"
        placeholder="Search a paper title, author or domain"
      />
      <button type="submit" class="pure-button pure-button-primary">
        Search
      </button>
    </div>
  </form>
</template>

<style scoped>
  .flex-container {
    display: flex;
    gap: 0.5em;
    align-items: center;
  }

  input {
    width: 50em;
  }

  form {
    padding: 1em;
  }
</style>
