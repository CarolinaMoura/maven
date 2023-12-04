import { defineStore } from "pinia";
import { ref } from "vue";

export const useDocumentStore = defineStore(
  "documents",
  () => {
    const documents = ref([]);
  },
  { persist: true },
);
