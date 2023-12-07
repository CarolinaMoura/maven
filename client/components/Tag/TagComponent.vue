<script setup lang="ts"></script>

<template>
  <v-chip class="tag" variant="tonal">
    <slot></slot>
  </v-chip>
</template>

<style>
.tag {
  width: max-content;
  color: var(--primary-text);
  outline: 1px solid var(--primary-text);
  padding: 0.5em 1em;
  border-radius: 0.25em;
  font-size: 16px;
}
</style>
