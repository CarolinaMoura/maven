<script setup lang="ts">
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useTagStore } from "../../stores/tags";
import { fetchy } from "../../utils/fetchy";
const { languageTags, otherTags } = storeToRefs(useTagStore());

const TAGS = otherTags;
const LANGUAGES = languageTags;

// keeps track of if form is open or not
const formOpen = ref(false);

// keeps track of if form fields are valid or not
const isFormValid = ref(false);

// keep track of field values for document
const title = ref("");
const authors = ref([{ first: "", last: "" }]);
const year = ref();
const tags = ref([]);
const content = ref("");
const originalLanguage = ref();

// keep track of field values for translationRequest
const targetLanguage = ref();
const description = ref("");

const emit = defineEmits(["refreshRequests"]);

function addAuthor() {
  authors.value = [...authors.value, { first: "", last: "" }];
}

function deleteAuthor(idx: number) {
  authors.value.splice(idx, 1);
}

function clearForm() {
  formOpen.value = false;
  title.value = "";
  authors.value = [{ first: "", last: "" }];
  year.value = undefined;
  tags.value = [];
  content.value = "";
  originalLanguage.value = "";
}

async function submitRequest() {
  if (isFormValid.value) {
    try {
      // create document first
      const document = await fetchy("/api/document", "POST", {
        body: {
          title: title.value,
          authors: authors.value,
          year: Number.parseInt(year.value),
          tags: tags.value,
          content: content.value,
          originalLanguage: originalLanguage.value,
        },
      });

      // then use returned id to create request
      await fetchy("/api/translationRequest", "POST", { query: { document: document._id, languageTo: targetLanguage.value } });
      emit("refreshRequests");
      closeForm();
    } catch (e) {
      return;
    }
  }
}

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

const nonEmptyRule = [
  (v: string) => {
    if (v) return true;
    return "Field cannot be empty.";
  },
];

const yearRules = [
  (v: string) => {
    if (v) return true;
    return "Field cannot be empty.";
  },
  (v: string) => {
    const validYear = new RegExp("^[0-9]{4}$");
    if (validYear.test(v)) return true;
    return "Must be a valid year";
  },
];

const closeForm = () => {
  formOpen.value = false;
  clearForm();
};
</script>
<template>
  <button
    class="btn-primary"
    @click="
      () => {
        formOpen = !formOpen;
      }
    "
  >
    <v-icon>mdi-file-document-alert</v-icon>
    Request a translation
  </button>

  <v-dialog v-model="formOpen" width="90%">
    <v-card>
      <v-form v-model="isFormValid" @submit.prevent="submitRequest()">
        <v-container class="form-container">
          <div class="row between">
            Translation Request Form
            <v-btn variant="plain" @click="closeForm"><v-icon>mdi-close</v-icon></v-btn>
          </div>

          <div class="form-section">
            Document Details
            <v-text-field label="Document Title" v-model="title" :rules="nonEmptyRule"></v-text-field>
            <v-row>
              <v-col :sm="4"><v-text-field label="Year Published" v-model="year" :rules="yearRules"></v-text-field></v-col>
              <v-col :sm="4"><v-select label="Tags" v-model="tags" :items="TAGS" multiple chips></v-select></v-col>
            </v-row>

            <v-row>
              <v-col>
                <div v-for="(author, idx) in authors" v-bind:key="`author-${idx}`" class="row">
                  <v-text-field :rules="nonEmptyRule" :label="`Author #${idx + 1} (First)`" v-model="author.first"></v-text-field>
                  <v-text-field :rules="nonEmptyRule" :label="`Author #${idx + 1} (Last)`" v-model="author.last"></v-text-field>

                  <v-btn v-if="authors.length > 1" variant="plain" @click="deleteAuthor(idx)" :icon="`mdi-close`"></v-btn>
                </div>

                <button class="btn-primary" @click="addAuthor()" type="button">Add author</button>
              </v-col>
            </v-row>
          </div>

          <div class="form-section">
            Document Upload
            <v-textarea label="Document Content" v-model="content" :rules="nonEmptyRule"></v-textarea>
          </div>

          <div class="form-section">
            Translation Request Details
            <v-row v-bind:style="{ 'align-items': 'center' }">
              <v-col :sm="4"><v-select label="Original language" v-model="originalLanguage" :items="LANGUAGES" :rules="selectRule"></v-select></v-col>
              to
              <v-col :sm="4"><v-select label="Target language" v-model="targetLanguage" :items="LANGUAGES" :rules="selectRule"></v-select></v-col>
            </v-row>
            <v-row>
              <v-col> <v-textarea label="Request description" v-model="description" :placeholder="`Provide more context or describe what you need help with`"></v-textarea> </v-col>
            </v-row>
          </div>

          <button class="btn-primary">Submit request</button>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.col {
  display: flex;
  flex-direction: column;
  gap: 1em;
}
.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1em;
}

.row.between {
  justify-content: space-between;
}

.form-container > div {
  padding-bottom: 1.5em;
}
</style>
