<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useTagStore } from "../../stores/tags";
import { useToastStore } from "../../stores/toast";
import { fetchy } from "../../utils/fetchy";
import { tagFindSimilars, tagFormatter, tagValidator } from "../../utils/tagFormatter";
const { languageTags, otherTags } = storeToRefs(useTagStore());
const { showToast } = useToastStore();

const props = defineProps(["language"]);
const emit = defineEmits(["refreshTags"]);
const tagName = ref("");
const isLanguage = ref(props.language);
const menu = ref(false);
const errorMessage = ref("");

const createTag = async (tagName: string, isLanguage: boolean) => {
  // format tag name
  const formatted = tagFormatter(tagName);

  // find similarities with existing tags
  const tags = isLanguage ? languageTags.value : otherTags.value;
  const similarTags = tagFindSimilars(
    tags.map((t) => t.name),
    formatted,
  );
  if (similarTags.length > 0) {
    errorMessage.value = "The tag is too similar to existing tags: " + similarTags.slice(0, 3).join(", ");
    return;
  }

  try {
    await fetchy("/api/tag", "POST", {
      body: { name: formatted, isLanguage },
    });
    menu.value = false;
    showToast({ message: "Tag created!", style: "success" });
    emit("refreshTags");
  } catch (_) {
    return;
  }

  emit("refreshTags");
  emptyForm();
};

const emptyForm = () => {
  tagName.value = "";
  isLanguage.value = props.language;
};
</script>

<template>
  <v-menu v-model="menu" :close-on-content-click="false" location="end">
    <template v-slot:activator="{ props }">
      <v-btn variant="plain" v-bind="props" icon="mdi-plus-circle-outline"></v-btn>
    </template>
    <v-card min-width="400" max-width="500">
      <form @submit.prevent="createTag(tagName, isLanguage)">
        <template v-if="!isLanguage">
          <label for="tagName">Tag</label>
          <v-textarea
            @update:modelValue="() => (errorMessage = '')"
            rows="1"
            id="tagName"
            v-model="tagName"
            placeholder="Enter the tag name"
            required
            :rules="[(e) => tagValidator(e) || 'Invalid character(s)']"
            :hint="errorMessage"
            :persistent-hint="true"
          >
          </v-textarea>
        </template>
        <template v-if="isLanguage">
          <label for="tagName">Language</label>
          <v-textarea rows="1" id="tagName" v-model="tagName" class="text" placeholder=" Enter the language" required> </v-textarea>
        </template>
        <v-btn type="submit" class="pure-button-primary pure-button">Create!</v-btn>
      </form>
    </v-card>
  </v-menu>
</template>

<style scoped>
form {
  background-color: var(--base-bg);
  display: flex;
  flex-direction: column;
  gap: 0.5em;
  padding: 1em;
}

textarea {
  font-family: inherit;
  font-size: inherit;
  height: 6em;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

.text {
  font-family: tweb;
}
</style>
