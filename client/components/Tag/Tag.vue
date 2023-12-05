<script setup lang="ts"></script>

<template>
  <div class="tag">
    <slot></slot>
  </div>
</template>

<style>
.tag {
  color: var(--primary-text);
  outline: 1px solid var(--primary-text);
  padding: 0.5em 1em;
  border-radius: 0.25em;
  font-size: 16px;
}
</style>
