<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

let username = ref("");
let password = ref("");

const { updateUser, updateSession } = useUserStore();

async function updateUsername() {
  await updateUser({ username: username.value });
  await updateSession();
  username.value = "";
}

async function updatePassword() {
  await updateUser({ password: password.value });
  await updateSession();
  password.value = "";
}
</script>

<template>
  <main class="column view-container">
    <h2>Update user details</h2>
    <v-card class="card">
      <form @submit.prevent="updateUsername" class="pure-form">
        <fieldset>
          <legend>Change your username</legend>
          <input type="text" placeholder="New username" v-model="username" required />
          <button type="submit" class="btn-secondary">Update</button>
        </fieldset>
      </form>
    </v-card>

    <v-card class="card">
      <form @submit.prevent="updatePassword" class="pure-form">
        <fieldset>
          <legend>Change your password</legend>
          <input type="password" placeholder="New password" v-model="password" required />
          <button type="submit" class="btn-secondary">Update</button>
        </fieldset>
      </form>
    </v-card>
  </main>
</template>

<style scoped>
h2 {
  font-weight: normal;
  font-family: tweb;
}

legend {
  font-family: tweb;
}

button {
  font-family: tweb;
}

input {
  font-family: tweb;
}

.btn-secondary {
  margin-left: 1em;
  background-color: rgba(253, 253, 253, 0.804);
}

.card {
  color: var(--primary-text);
  align-items: start;
  background-color: var(--secondary-20);
  border-radius: 10px;
  padding: 1.5em;
}
</style>
