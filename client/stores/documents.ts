import { defineStore } from "pinia";
import { ref } from "vue";

export const useDocumentStore = defineStore(
  "documents",
  () => {
    // Documents that match the filters
    const documents = ref([]);

    // const getDocuments = async (filter:) => {

    // }
  },
  { persist: true },
);
