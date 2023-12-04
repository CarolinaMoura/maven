import { defineStore } from "pinia";
import { ref } from "vue";
import { Tag } from "../types";
import { fetchy } from "../utils/fetchy";

export const useTagStore = defineStore(
  "tag",
  () => {
    const languageTags = ref<Tag[]>([]);
    const otherTags = ref([]);

    const getLanguageTags = async () => {
      const languageTagDocs = await fetchy(`/api/tag/language`, "GET");
      languageTags.value = languageTagDocs.map((t: Tag) => {
        return {
          isLanguage: t.isLanguage,
          name: t.name,
          _id: t._id,
        };
      });
    };

    const getOtherTags = async () => {
      const otherTagDocs = await fetchy(`/api/tag/other`, "GET");
      otherTags.value = otherTagDocs.map((t: Tag) => t.name);
    };

    return { languageTags, getLanguageTags, getOtherTags, otherTags };
  },
  { persist: true },
);
