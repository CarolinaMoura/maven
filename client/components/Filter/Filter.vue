<script setup lang="ts">
import { ref } from "vue";
import { watch } from "vue";
import { mdiInformationVariantCircleOutline } from "@mdi/js";
import Tag from "@/types/Tag";

// TODO
// CHECK IF LANGUAGES ARE VALID

function getTodaysYear(): number {
  const today = new Date();
  const year = today.getFullYear();
  return year;
}

interface ITranslation {
  from: Tag;
  to: Tag;
}

const emptyTag: Tag = {
  name: "",
  isLanguage: true,
};

const select = ref([]);
const items = ref(["Programming", "Design", "Vue", "Vuetify", "abc", "def", "ghi"]);
const value = ref([1800, getTodaysYear()]);
const translations = ref<ITranslation[]>([{ from: { ...emptyTag }, to: { ...emptyTag } }]);
const completelyTranslated = ref(false);
const untranslated = ref(false);

const addNewTranslationField = () => {
  const translation = { from: { ...emptyTag }, to: { ...emptyTag } };
  translations.value.push(translation);
};

const submitFilters = () => {};
</script>

<template>
  <section>
    <button class="clear-all-filters">CLEAR ALL</button>
    <div class="filter-type">
      <h2>Work filters</h2>
      <div class="filter-option">
        <h4>Tags</h4>
        <v-col cols="12">
          <v-combobox v-model="select" :items="items" label="" multiple>
            <template v-slot:selection="data">
              <v-chip :key="JSON.stringify(data.item)" v-bind="data.attrs" :model-value="data.selected" :disabled="data.disabled" size="small" @click:close="data.parent.selectItem(data.item)">
                <template v-slot:prepend>
                  <v-avatar class="bg-accent text-uppercase" start>{{ data.item.title.slice(0, 1) }}</v-avatar>
                </template>
                {{ data.item.title }}
              </v-chip>
            </template>
          </v-combobox>
        </v-col>
      </div>
      <div class="filter-option">
        <h4>
          Year published
          <v-tooltip text="Select the range of years of publication of the original work">
            <template v-slot:activator="{ props }">
              <v-icon v-bind="props">mdi-information-variant-circle-outline</v-icon>
            </template>
          </v-tooltip>
        </h4>
        <v-range-slider v-model="value" step="1" thumb-label="true" elevation="2" min="1800" max="2023" hide-details="true" thumb-size="15" track-size="2"></v-range-slider>
        <p style="text-align: center; margin-top: -0.8rem">
          From <b>{{ value[0] }}</b> to <b>{{ value[1] }}</b>
        </p>
      </div>
    </div>
    <div class="filter-type">
      <h2>Translation filters</h2>
      <div class="filter-option">
        <h4>Language</h4>
        <div v-for="(translation, ix) in translations" :key="ix">
          <div class="single-translation">
            From
            <v-combobox
              label="original"
              class="language-selector"
              v-model="translation.from.name"
              hide-details="true"
              :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
            ></v-combobox>
            to
            <v-combobox
              label="target"
              class="language-selector"
              v-model="translation.to.name"
              hide-details="true"
              :items="['California', 'Colorado', 'Florida', 'Georgia', 'Texas', 'Wyoming']"
            ></v-combobox>
          </div>
        </div>
        <v-btn variant="plain" @click="addNewTranslationField()">+ ADD A NEW LINE</v-btn>
      </div>
      <div class="filter-option">
        <h4>Translation status</h4>
        <div>
          <v-checkbox label="Completely translated" density="compact" hide-details="true" v-model="completelyTranslated"></v-checkbox>
          <v-checkbox label="Untranslated" density="compact" hide-details="true" v-model="untranslated"></v-checkbox>
        </div>
      </div>
    </div>
    <div class="filter-type">
      <v-col cols="12">
        <v-btn block rounded="lg" size="large" @click="submitFilters()">APPLY FILTERS</v-btn>
      </v-col>
    </div>
  </section>
</template>

<style scoped>
* {
  color: var(--primary-text);
}
.single-translation {
  display: flex;
  align-items: center;
}
.language-selector {
  padding: 0 1rem;
}
.filter-option {
  margin: 0.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 0.9rem;
}
h2 {
  text-align: center;
}
section {
  width: 100%;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: left;
  background-color: var(--tertiary-30);
  margin-bottom: 10rem;
  box-sizing: border-box;
}

.filter-type {
  /* margin: 0.8rem 0; */
  padding: 1rem 0;
  border-bottom: 1px solid var(--tertiary);
}

.clear-all-filters {
  color: rgb(81, 117, 183);
  text-decoration: underline;
  margin-bottom: -1rem;
  font-weight: bold;
  text-align: right;
}
</style>
