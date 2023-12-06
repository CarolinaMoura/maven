<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useTagStore } from "../../stores/tags";
import { Tag } from "../../types";
import { fetchy } from "../../utils/fetchy";
const { languageTags, otherTags } = storeToRefs(useTagStore());

const LANGUAGES = computed(() => languageTags.value.map((t: Tag) => t.name));

const menu = ref(false);
const targetLanguage = ref();
const description = ref();
const props = defineProps(["document"]);
const emit = defineEmits(["refreshRequests"]);

const selectRule = [
  (v: string) => {
    if (v) return true;
    return "Field cannot be empty";
  },

  (v: Array<string>) => {
    if (v.length > 0) return true;
    return "Field cannot be empty";
  },
];

async function submitRequest() {
  try {
    await fetchy("/api/translationRequest/", "POST", { body: { document: props.document._id, languageTo: targetLanguage.value, description: description.value } });
    emit("refreshRequests");
    menu.value = false;
  } catch (e) {
    return;
  }
}
</script>
<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn variant="plain" v-bind="props" icon="mdi-file-document-alert"></v-btn>
      </template>

      <v-card min-width="400" max-width="500">
        <v-list>
          <v-list-item :title="`New translation request for ${document.title}`"> </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>
          <v-list-item subtitle="Select new target language"></v-list-item>
          <v-list-item>
            <v-select label="Original language" v-model="$props.document.originalLanguage" disabled></v-select>
          </v-list-item>
          <v-list-item>
            <v-select label="Target language" v-model="targetLanguage" :items="LANGUAGES" :rules="selectRule"></v-select>
          </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-list>
          <v-list-item subtitle="Provide more context or describe what you need help with (optional)"></v-list-item>
          <v-list-item>
            <v-textarea label="Request description" v-model="description"></v-textarea>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="menu = false"> Cancel </v-btn>
          <v-btn color="primary" variant="text" @click="submitRequest"> Submit </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
