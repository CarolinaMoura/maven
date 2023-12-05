<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, onUnmounted, ref, watchEffect } from "vue";
import { useTagStore } from "../../stores/tags";
import { useTranslationRequestsStore } from "../../stores/translationRequests";
import { Tag } from "../../types";

const { languageTags, otherTags } = storeToRefs(useTagStore());
const translationRequestsStore = useTranslationRequestsStore();

// TODO
// CHECK IF LANGUAGES ARE VALID

// TODO
// ADD 'X' TO REMOVE A LINE

// TODO
// REMOVE CHIP BY CLICKING ON IT

// TODO
// JUST ONE FIELD IN LANGUAGE

function getTodaysYear(): number {
  const today = new Date();
  const year = today.getFullYear();
  return year;
}

interface IExtendedTag extends Tag {
  title: string;
}

interface ITranslation {
  from: IExtendedTag;
  to: IExtendedTag;
}

const emptyTag: IExtendedTag = {
  title: "",
  name: "",
  isLanguage: true,
  _id: "0",
};

const languages = computed(() => languageTags.value.map((t: Tag) => ({ ...t, title: t.name })));
const nonLanguages = computed(() => otherTags.value.map((t: Tag) => ({ ...t, title: t.name })));

const canAppear = ref(false);
const windowSize = ref(window.innerWidth);

const select = ref([]);
const value = ref([1800, getTodaysYear()]);
const translations = ref<ITranslation[]>([{ from: { ...emptyTag }, to: { ...emptyTag } }]);
const completelyTranslated = ref(false);
const untranslated = ref(false);

const addNewTranslationField = () => {
  const translation = { from: { ...emptyTag }, to: { ...emptyTag } };
  translations.value.push(translation);
};

const submitFilters = async () => {
  const filters = {
    tags: select.value.map((t: Tag) => t._id ?? ""),
    yearFrom: value.value[0],
    yearTo: value.value[1],
    translations: translations.value.map(({ from, to }) => ({
      from: from._id ?? "",
      to: to._id ?? "",
    })),
    completelyTranslated: completelyTranslated.value,
    untranslated: untranslated.value,
  };

  await translationRequestsStore.getTranslationRequests(filters);
};

watchEffect(submitFilters);

const removeTranslationLine = (ix: number) => {
  translations.value.splice(ix, 1);
};

const clearAllFilters = async () => {
  select.value = [];
  value.value = [1800, getTodaysYear()];
  translations.value = [{ from: { ...emptyTag }, to: { ...emptyTag } }];
  completelyTranslated.value = false;
  untranslated.value = false;
  await translationRequestsStore.getTranslationRequests({});
};

const updateWindowSize = () => {
  windowSize.value = window.innerWidth;
};

onMounted(() => {
  window.addEventListener("resize", updateWindowSize);

  onUnmounted(() => {
    window.removeEventListener("resize", updateWindowSize);
  });
});

const myFunc = () => {
  console.log("entrei");
};
</script>

<template>
  <section>
    <button v-if="windowSize < 700" class="filter-button" @click="canAppear = !canAppear">
      Advanced search
      <v-icon v-if="canAppear" size="x-small">mdi-triangle-down</v-icon>
    </button>
    <div v-if="canAppear || windowSize >= 700">
      <button class="clear-all-filters" @click="clearAllFilters()">CLEAR ALL</button>
      <div class="filter-type">
        <h2>Document filters</h2>
        <div class="filter-option">
          <h4>
            Tags
            <v-tooltip text="A document with at least one of the selected tags will match your search">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props">mdi-information-variant-circle-outline</v-icon>
              </template>
            </v-tooltip>
          </h4>
          <v-col cols="12">
            <!-- <v-combobox v-model="select" :items="languageTags" label="" multiple></v-combobox> -->

            <v-combobox v-model="select" :items="nonLanguages" label="" multiple>
              <template v-slot:selection="data">
                <v-chip :key="JSON.stringify(data.item)" size="small">
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
            <v-tooltip text="Select the range of years of publication of the original document">
              <template v-slot:activator="{ props }">
                <v-icon v-bind="props">mdi-information-variant-circle-outline</v-icon>
              </template>
            </v-tooltip>
          </h4>
          <v-range-slider v-model="value" step="1" :thumb-label="true" elevation="2" min="1800" max="2023" :hide-details="true" thumb-size="15" track-size="2"></v-range-slider>
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
              <!-- <v-select :return-object="true" @update:modelValue="(e) => (translation = e)" :items="languages" label="original"></v-select> -->
              <v-combobox label="original" class="language-selector" v-model="translation.from" :hide-details="true" :items="languages"></v-combobox>
              to
              <v-combobox label="target" class="language-selector" v-model="translation.to" :hide-details="true" :items="languages"></v-combobox>
              <v-icon color="var(--primary-text-60)" size="x-small" @click="removeTranslationLine(ix)">mdi-close</v-icon>
            </div>
          </div>
          <v-btn variant="plain" @click="addNewTranslationField()">+ ADD A NEW LINE</v-btn>
        </div>
        <!-- <div class="filter-option">
          <h4>Translation status</h4>
          <div>
            <v-checkbox label="Completely translated" density="compact" :hide-details="true" v-model="completelyTranslated"></v-checkbox>
            <v-checkbox label="Untranslated" density="compact" :hide-details="true" v-model="untranslated"></v-checkbox>
          </div>
        </div> -->
      </div>
      <div class="filter-type">
        <v-col cols="12">
          <v-btn block rounded="lg" size="large" @click="submitFilters()">APPLY FILTERS</v-btn>
        </v-col>
      </div>
    </div>
  </section>
</template>

<style scoped>
* {
  color: var(--primary-text);
}
.single-translation {
  display: flex;
  /* align-items: center; */
  width: 100%;
}
.language-selector {
  padding: 0 1rem;
  width: 10%;
}

.filter-button {
  text-decoration: underline;
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
  display: flex;
  flex-direction: column;
  gap: 1rem;
  justify-content: left;
  box-sizing: border-box;
  margin-bottom: 3rem;
  padding: 0 2rem;
}

.filter-type {
  /* margin: 0.8rem 0; */
  padding: 1rem 0;
  border-bottom: 1px solid var(--tertiary);
}

.filter-type:last-child {
  border-bottom: none;
}

.clear-all-filters {
  color: rgb(81, 117, 183);
  text-decoration: underline;
  margin-bottom: -1rem;
  font-weight: bold;
  text-align: right;
}

@media (min-width: 700px) {
  section {
    padding: 2rem;
    margin-bottom: 10rem;
    background-color: var(--tertiary-30);
    text-decoration: none;
  }
}
</style>
