<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";

const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
</script>

<template>
  <main>
    <h1>Translation Page</h1>
    <section>
      <h1 v-if="isLoggedIn">Translations</h1>
      <h1 v-else>Please login!</h1>
    </section>
    <SectionListComponent />
  </main>
</template>

<style scoped>
h1 {
  text-align: center;
}
</style>
