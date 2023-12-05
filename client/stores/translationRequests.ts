import { defineStore } from "pinia";
import { ref } from "vue";
import { IFilter, TranslationRequest } from "../types";
import { fetchy } from "../utils/fetchy";

export const useTranslationRequestsStore = defineStore(
  "translationRequests",
  () => {
    // Translation requests that match the filters
    const translationRequests = ref<Array<TranslationRequest>>([]);
    const lastFilteredUsed = ref<IFilter>({});

    const getTranslationRequests = async (filter: IFilter = {}) => {
      lastFilteredUsed.value = filter;
      translationRequests.value = [
        ...(await fetchy(`/api/filter`, "PUT", {
          body: { filter: { ...filter } },
        })),
      ];
    };

    return { translationRequests, lastFilteredUsed, getTranslationRequests };
  },
  { persist: true },
);
