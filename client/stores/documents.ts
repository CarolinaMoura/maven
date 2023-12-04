import { defineStore } from "pinia";
import { ref } from "vue";

export const useDocumentStore = defineStore(
  "documents",
  () => {
    // Documents that match the filters
    const documents = ref([]);
  },
  { persist: true },
);
