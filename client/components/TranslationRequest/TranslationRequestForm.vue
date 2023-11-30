<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

// keeps track of if form is open or not
const formOpen = ref(false);
const isFormValid = ref(false);

// keep track of field values
const title = ref("");
const authors = ref([{ first: "", last: "" }]);
const year = ref();
const domain = ref("");
const content = ref("");
const originalLanguage = ref("");

const DOMAINS = ["Computer Science", "Biology"];
const LANGUAGES = ["English", "Portuguese", "Spanish"];

function addAuthor() {
  authors.value = [...authors.value, { first: "", last: "" }];
}

function deleteAuthor(idx: number) {
  authors.value.splice(idx, 1);
}

async function submitRequest() {
  if (isFormValid.value) {
    try {
      await fetchy("/api/document", "POST", {
        body: {
          title: title.value,
          authors: authors.value,
          year: Number.parseInt(year.value),
          domain: domain.value,
          content: content.value,
          originalLanguage: originalLanguage.value,
        },
      });
    } catch (e) {
      return;
    }
  }

  // close form
  //   formOpen.value = false;
}

const domainRule = [
  (v: string) => {
    if (v.length > 0) return true;
    return "Field cannot be empty.";
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
    console.log("v ", v);
    const validYear = new RegExp("^[0-9]{4}$");
    if (validYear.test(v)) return true;
    return "Must be a valid year";
  },
];

const closeForm = () => {
  formOpen.value = false;
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
              <v-col :sm="4"><v-select label="Domain" v-model="domain" :items="DOMAINS" :rules="domainRule"></v-select></v-col>
              <v-col :sm="4"><v-select label="Language" v-model="originalLanguage" :items="LANGUAGES" :rules="domainRule"></v-select></v-col>
            </v-row>

            <v-row>
              <v-col>
                <div v-for="(author, idx) in authors" v-bind:key="`author-${idx}`" class="row">
                  <v-text-field :rules="nonEmptyRule" :label="`Author #${idx + 1} (First)`" v-model="author.first"></v-text-field>
                  <v-text-field :rules="nonEmptyRule" :label="`Author #${idx + 1} (Last)`" v-model="author.last"></v-text-field>

                  <v-btn v-if="authors.length > 1" variant="plain" @click="deleteAuthor(idx)"><v-icon>mdi-close</v-icon></v-btn>
                </div>

                <button class="btn-primary" @click="addAuthor()" type="button">Add author</button>
              </v-col>
            </v-row>
          </div>

          <div class="form-section">
            Document Upload
            <v-textarea label="Document Content" v-model="content" :rules="nonEmptyRule"></v-textarea>
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
