import { defineStore } from "pinia";
import { ref } from "vue";
import { Tag } from "../types";
import { fetchy } from "../utils/fetchy";

export const useTagStore = defineStore(
  "tag",
  () => {
    const languageTags = ref([]);
    const contentTags = ref([]);

    const getLanguageTags = async () => {
      const languageTagDocs = await fetchy(`/api/tag/language`, "GET");
      languageTags.value = languageTagDocs.map((t: Tag) => t.name);
    };

    return { languageTags, contentTags, getLanguageTags };
  },
  { persist: true },
);
