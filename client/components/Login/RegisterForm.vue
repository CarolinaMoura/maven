<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { ref } from "vue";

const username = ref("");
const password = ref("");
const { createUser, loginUser, updateSession } = useUserStore();

async function register() {
  await createUser(username.value, password.value);
  await loginUser(username.value, password.value);
  void updateSession();
  void router.push({ name: "Home" });
}
</script>

<template>
  <div class="text">
    <v-card class="card">
      <form class="pure-form pure-form-aligned" @submit.prevent="register">
        <v-card-title>Register User</v-card-title>
        <fieldset>
          <div class="pure-control-group">
            <label for="aligned-name">Username</label>
            <input v-model.trim="username" type="text" id="aligned-name" placeholder="Username" required />
          </div>
          <div class="pure-control-group">
            <label for="aligned-password">Password</label>
            <input type="password" v-model.trim="password" id="aligned-password" placeholder="Password" required />
          </div>
          <div class="pure-controls">
            <button type="submit" class="btn-primary">Register</button>
          </div>
        </fieldset>
      </form>
    </v-card>
  </div>
</template>

<style scoped>
h3 {
  display: flex;
  font-family: tweb;
  justify-content: center;
}

.text {
  font-family: tweb;
}

.card {
  color: var(--primary-text);
  align-items: start;
  background-color: var(--secondary-20);
  border-radius: 10px;
  padding: 1.5em;
}
</style>
