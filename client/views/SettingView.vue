<script setup lang="ts">
import router from "@/router";
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import UpdateUserForm from "../components/Setting/UpdateUserForm.vue";

const { currentUsername } = storeToRefs(useUserStore());
const { logoutUser, deleteUser } = useUserStore();

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_() {
  await deleteUser();
  void router.push({ name: "Home" });
}
</script>

<template>
  <main class="column">
    <h1>Settings for {{ currentUsername }}</h1>
    <div class="row"><button class="btn-primary" @click="logout">Logout</button> <button class="btn-red"
        @click="delete_">Delete Account</button></div>
    <UpdateUserForm />
  </main>
</template>

<style scoped>
h1 {
  font-weight: normal;
  font-family: tweb;
}

.btn-primary {
  border-radius: 1em;
  font-family: tweb;
}

.btn-red {
  border-radius: 1em;
  font-family: tweb;
}
</style>
