<script setup lang="ts">
import LoginForm from "@/components/Login/LoginForm.vue";
import RegisterForm from "@/components/Login/RegisterForm.vue";
</script>

<template>
  <main class="column">
    <h1>Please login or register!</h1>
    <v-row class="gap">
      <v-col> <LoginForm /> </v-col>
      <v-col><RegisterForm /></v-col>
    </v-row>
  </main>
</template>

<style scoped>
h1 {
  font-weight: normal;
}

.gap {
  gap: 1em;
}
</style>
