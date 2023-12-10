<script setup lang="ts">
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";
import { useTagStore } from "./stores/tags";
import { useTranslationRequestsStore } from "./stores/translationRequests";

const currentRoute = useRoute();
const currentRouteName = computed(() => currentRoute.name);
const userStore = useUserStore();
const tagStore = useTagStore();
const translationRequestsStore = useTranslationRequestsStore();
const { isLoggedIn, currentUsername } = storeToRefs(userStore);
const { toast } = storeToRefs(useToastStore());

// Make sure to update the session before mounting the app in case the user is already logged in
onBeforeMount(async () => {
  try {
    await userStore.updateSession();
    await tagStore.getLanguageTags();
    await tagStore.getOtherTags();
  } catch {
    // User is not logged in
  }
});
</script>

<template>
  <header>
    <nav>
      <div class="title">
        <RouterLink :to="{ name: 'Home' }" style="display: flex; justify-content: center; align-items: center; gap: 0.5em">
          <img src="../client/assets/images/logo.svg" />
          <h1>maven</h1>
        </RouterLink>
      </div>
      <ul>
        <li>
          <RouterLink :to="{ name: 'Home' }"> <v-icon :class="`${currentRouteName == 'Home' && 'selected'}`">mdi-home</v-icon> </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Profile', params: { username: currentUsername } }" :class="{ underline: currentRouteName == 'Profile' }">
            <v-icon :class="`${currentRoute.fullPath === `/profile/${currentUsername}` && 'selected'}`">mdi-account</v-icon>
          </RouterLink>
        </li>
        <li v-if="isLoggedIn">
          <RouterLink :to="{ name: 'Settings' }"> <v-icon :class="`${currentRouteName == 'Settings' && 'selected'}`">mdi-cog</v-icon> </RouterLink>
        </li>
        <li v-else>
          <RouterLink :to="{ name: 'Login' }"> <v-icon :class="`${currentRouteName == 'Login' && 'selected'}`">mdi-login</v-icon> </RouterLink>
        </li>
      </ul>
    </nav>
    <article v-if="toast !== null" class="toast" :class="toast.style">
      <p>{{ toast.message }}</p>
    </article>
  </header>
  <RouterView />
</template>

<style scoped>
@import "./assets/toast.css";

nav {
  padding: 1em 2em;
  background-color: var(--secondary);
  display: flex;
  align-items: center;
}

h1 {
  font-size: 2em;
  margin: 0;
}

.title {
  display: flex;
  align-items: center;
  gap: 0.5em;
}

img {
  height: 2em;
}

a {
  font-size: large;
  color: white;
  text-decoration: none;
  transition: all 0.25s ease-in;
}

a:hover,
.selected {
  color: var(--primary-text);
}

ul {
  list-style-type: none;
  margin-left: auto;
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: 1em;
}

.underline {
  text-decoration: underline;
}
</style>
