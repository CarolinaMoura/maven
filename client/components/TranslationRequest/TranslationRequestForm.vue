<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

// keeps track of if form is open or not
const formOpen = ref(false);

// keep track of field values
const title = ref("");
const authors = ref([{ first: "hi", last: "bye" }]);
const year = ref();
const domains = ref([]);

const DOMAINS = ["Computer Science", "Chemical Engineering"];

function addAuthor() {
  authors.value = [...authors.value, { first: "", last: "" }];
}

function deleteAuthor(idx: number) {
  authors.value.splice(idx, 1);
}

async function submitRequest() {
  try {
    await fetchy("/api/document", "POST", {
      body: {
        title: title.value,
        authors: authors.value,
        year: year.value,
        domains: domains.value,
      },
    });
  } catch (e) {
    return;
  }

  // close form
  formOpen.value = false;
}

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

/** TODO: fix rule, does not detect empty state */
const domainRules = [
  (v: Array<string>) => {
    if (v.length > 0) return true;
    return "You must choose at least one domain.";
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
      <v-container class="form-container">
        <div class="row between">
          Translation Request Form
          <v-btn variant="plain" @click="closeForm"><v-icon>mdi-close</v-icon></v-btn>
        </div>

        <div class="form-section">
          Document Details
          <v-text-field label="Document Title" v-model="title" :rules="nonEmptyRule"></v-text-field>
          <v-row>
            <v-col :sm="6"><v-text-field label="Year Published" v-model="year" :rules="yearRules"></v-text-field></v-col>
            <v-col :sm="6"><v-select label="Domain" v-model="domains" :items="DOMAINS" multiple :rule="domainRules"></v-select></v-col>
          </v-row>

          <v-row>
            <v-col>
              <div v-for="(author, idx) in authors" v-bind:key="`author-${idx}`" class="row">
                <v-text-field :rules="nonEmptyRule" :label="`Author #${idx + 1} (First)`" v-model="author.first"></v-text-field>
                <v-text-field :rules="nonEmptyRule" :label="`Author #${idx + 1} (Last)`" v-model="author.last"></v-text-field>
                <v-btn v-if="authors.length > 1" variant="plain" @click="deleteAuthor(idx)"><v-icon>mdi-close</v-icon></v-btn>
              </div>

              <button class="btn-primary" @click="addAuthor()">Add author</button>
            </v-col>
          </v-row>
        </div>

        <div class="form-section">
          Document Upload
          <v-textarea label="Document Content"></v-textarea>
          <button class="btn-primary">Upload document</button>
        </div>

        <button class="btn-primary" @click="submitRequest()">Submit request</button>
      </v-container>
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
