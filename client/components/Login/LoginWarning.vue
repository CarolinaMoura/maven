<template>
  <div class="login-warning-container">
    <v-card class="login-warning-card">
      <v-card-title class="row"><v-icon>mdi-alert</v-icon>Log in</v-card-title>
      <v-card-text>You must be logged in to create requests for translations or contribute translations. </v-card-text>
    </v-card>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  flex-direction: row;
  column-gap: 0.5em;
}
.login-warning-container {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5em 0;
}
.login-warning-card {
  outline: 1px solid #cf6262;
  padding: 1.5em;
  border-radius: 10px;
  /* width: 80%;
  max-width: 500px; */
  width: 100%;
  color: #cf6262;
}
</style>
