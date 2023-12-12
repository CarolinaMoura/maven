<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";
import { useTagStore } from "../../stores/tags";
import { Tag } from "../../types";
import CreateTagForm from "../Tag/CreateTagForm.vue";
const { languageTags, otherTags } = storeToRefs(useTagStore());
const { currentUsername, isLoggedIn } = storeToRefs(useUserStore());
const { getOtherTags } = useTagStore();

const TAGS = computed(() => otherTags.value.map((t: Tag) => t.name));
const LANGUAGES = computed(() => languageTags.value.map((t: Tag) => t.name));

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
  targetLanguage.value = "";
  description.value = "";
}

async function submitRequest() {
  return;
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
    if (!v) return true;
    if (v.length === 0) return true;
    const validYear = new RegExp("^[0-9]{4}$");
    if (validYear.test(v)) return true;
    return "Must be a valid year";
  },
];

async function getTags() {
  void getOtherTags();
}

const closeForm = () => {
  formOpen.value = false;
  clearForm();
};
</script>
<template>
  <div :class="!isLoggedIn && `disabled`">
    <button
      :disabled="!isLoggedIn"
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
  </div>

  <v-dialog v-model="formOpen" width="90%">
    <v-card>
      <v-form v-model="isFormValid" @submit.prevent="submitRequest()">
        <v-container class="form-container">
          <div class="row between">
            <div>
              <h2>Translation Request Form</h2>
            </div>
            <v-btn variant="plain" @click="closeForm" :icon="`mdi-close`"></v-btn>
          </div>

          <v-divider></v-divider>

          <div class="form-section">
            <h3 class="form-subheading">Tell us more about the document</h3>
            <v-row
              ><v-col><v-text-field label="Document Title" v-model="title" :rules="nonEmptyRule" color="#95AEB3"></v-text-field></v-col
            ></v-row>
            <v-row style="display: flex; align-items: start">
              <v-col :sm="4"><v-text-field label="Year Published" v-model="year" :rules="yearRules" color="#95AEB3"></v-text-field></v-col>
              <v-col :sm="8">
                <v-select label="Tags" v-model="tags" :items="TAGS" multiple chips color="#95AEB3"></v-select>
                <v-tooltip>
                  <template v-slot:activator="{ props }">
                    <v-row class="tags-row" style="display: flex; align-items: center">
                      <div class="tag-text">Didn't find the tag you were looking for? Create one</div>
                      <CreateTagForm :language="false" v-bind="props" v-on:refresh-tags="getTags"></CreateTagForm>
                    </v-row>
                  </template>
                </v-tooltip>
              </v-col>
            </v-row>

            <v-row>
              <v-col class="col">
                <div v-for="(author, idx) in authors" v-bind:key="`author-${idx}`" class="row">
                  <v-text-field :label="`Author #${idx + 1} (First)`" v-model="author.first" color="#95AEB3"></v-text-field>
                  <v-text-field :label="`Author #${idx + 1} (Last)`" v-model="author.last" color="#95AEB3"></v-text-field>

                  <v-btn v-if="authors.length > 1" variant="plain" @click="deleteAuthor(idx)" :icon="`mdi-close`"></v-btn>
                </div>

                <button class="btn-secondary add-author-btn" @click="addAuthor()" type="button">Add author</button>
              </v-col>
            </v-row>
          </div>
          <v-divider></v-divider>

          <div class="form-section">
            <h3 class="form-subheading">Document upload</h3>

            <v-textarea label="Document Content" :placeholder="`Submit text content of the document here.`" v-model="content" :rules="nonEmptyRule" color="#95AEB3"></v-textarea>
          </div>
          <v-divider></v-divider>

          <div class="form-section">
            <h3 class="form-subheading">Translation Request Details</h3>

            <v-row v-bind:style="{ 'align-items': 'center' }">
              <v-col :sm="5"><v-select label="Original language" v-model="originalLanguage" :items="LANGUAGES" :rules="selectRule" color="#95AEB3"></v-select></v-col>
              to
              <v-col :sm="5"><v-select label="Target language" v-model="targetLanguage" :items="LANGUAGES" :rules="selectRule" color="#95AEB3"></v-select></v-col>
            </v-row>
            <v-row>
              <v-col> <v-textarea label="Request description" v-model="description" :placeholder="`Provide more context or describe what you need help with.`" color="#95AEB3"></v-textarea> </v-col>
            </v-row>
          </div>

          <button class="btn-primary">Submit request</button>
        </v-container>
      </v-form>
    </v-card>
  </v-dialog>
</template>
<style scoped>
.tags-row {
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.8rem;
  padding: 0;
}
.disabled {
  cursor: not-allowed;
}

h3,
h2 {
  font-weight: normal;
}

h3 {
  padding: 1em 0 1.5em 0;
}

h2 {
  padding-bottom: 0.5em;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.row {
  display: flex;
  flex-direction: row;
  align-items: center;
  column-gap: 1em;
  row-gap: 1em;
}

.add-author-btn {
  align-self: end;
}

.row.between {
  justify-content: space-between;
}

.form-section {
  padding-bottom: 1.5em;
}
</style>
