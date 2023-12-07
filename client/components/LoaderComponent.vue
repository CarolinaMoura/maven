<template>
  <v-card class="loader-card card" hover>
    <div class="loading-state"><v-progress-circular indeterminate></v-progress-circular></div>
  </v-card>
</template>

<style scoped>
.loader-card.card {
  color: var(--primary-text);
  align-items: start;
  background-color: var(--secondary-20);
  border-radius: 10px;
  padding: 1.5em;
  margin: auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
}
</style>
