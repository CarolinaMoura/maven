<script setup lang="ts">
import TranslationRequestPreview from "@/components/TranslationRequest/TranslationRequestPreview.vue";
import { onMounted, ref, watchEffect } from "vue";
import { fetchy } from "../utils/fetchy";

import PieChart from "../components/Profile/PieChart.vue";
import SectionComponent from "../components/Section/SectionComponent.vue";
import SectionTranslationCard from "../components/SectionTranslation/SectionTranslationCard.vue";
import LanguageTag from "../components/Tag/LanguageTag.vue";
import Tag from "../components/Tag/TagComponent.vue";

import LoaderComponent from "../components/LoaderComponent.vue";

const loaded = ref(false);
const view = ref("REQUEST");
const requests = ref();
const contributions = ref();
const tags = ref();
const languageDistribution = ref();

const props = defineProps(["username"]);

async function getuserData(username: string) {
  try {
    loaded.value = false;
    const fetchedRequests = await fetchy(`/api/user/requests/${username}`, "GET");
    const fetchedContributions = await fetchy(`/api/user/contributions/${username}`, "GET");
    requests.value = fetchedRequests;
    contributions.value = fetchedContributions;

    if (!contributions.value) return;
    let totalCount = 0;
    const languageFrequency = new Map<string, number>([]);
    for (const request of contributions.value.requests) {
      const languageTo = request.languageTo;
      totalCount += 1;
      if (languageFrequency.has(languageTo)) {
        const count = languageFrequency.get(languageTo);
        if (count !== undefined) languageFrequency.set(languageTo, count + 1);
      } else {
        languageFrequency.set(languageTo, 1);
      }
    }

    for (const language of languageFrequency.keys()) {
      const count = languageFrequency.get(language);
      if (count) languageFrequency.set(language, Math.round(((count * 100) / totalCount) * 1e2) / 1e2);
    }

    const formattedData = [];

    for (let [key, value] of languageFrequency.entries()) {
      formattedData.push({ language: key, value });
    }

    languageDistribution.value = formattedData;

    if (!contributions.value) return;

    const allTags = new Set();

    const promises = contributions.value.documents.map(async (document: any) => {
      return fetchy(`/api/tag/object/${document._id}`, "GET");
    });

    const fetchedTags = await Promise.all(promises);
    fetchedTags.map((list) => {
      list.map((tag: any) => {
        if (tag && !tag.isLanguage) {
          allTags.add(tag.name);
        }
      });
    });

    tags.value = Array.from(allTags);
  } catch {
    // User is not logged in
  }
  loaded.value = true;
}

onMounted(async () => {
  await getuserData(props.username);
});

watchEffect(async () => {
  await getuserData(props.username);
});
</script>
<template>
  <main class="view-container column">
    <div>
      <h1>
        {{ props.username }}
      </h1>
    </div>

    <div v-if="loaded">
      <div v-if="languageDistribution && languageDistribution.length > 0" class="row">
        <PieChart :data="languageDistribution"></PieChart>

        <div class="column">
          <v-card class="mx-auto pa-2">
            <v-list>
              <v-list-subheader>Languages translated to</v-list-subheader>

              <v-list-item>
                <div class="tags-row">
                  <div v-for="language in languageDistribution" v-bind:key="`${language.language}-${language.value}`">
                    <div class="row">
                      <LanguageTag :language="language.language"></LanguageTag>
                      <p>{{ language.value }}%</p>
                    </div>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </v-card>
          <v-card class="mx-auto pa-2" v-if="tags.length > 0">
            <v-list>
              <v-list-subheader>Type of documents translated</v-list-subheader>
              <v-list-item>
                <div class="tags-row">
                  <Tag v-for="tag in tags" v-bind:key="tag">{{ tag }}</Tag>
                </div>
              </v-list-item>
            </v-list>
          </v-card>
        </div>
      </div>
      <div v-else>No translator stats to show for {{ props.username }}!</div>
    </div>
    <LoaderComponent v-else></LoaderComponent>

    <div class="viewer">
      <v-btn-toggle v-model="view" rounded="0" color="#95AEB3" group variant="outlined">
        <v-btn :value="`REQUEST`"> Requested Translations </v-btn>
        <v-btn :value="`TRANSLATION`"> Contributed Translations </v-btn>
      </v-btn-toggle>
      <div v-if="view === `REQUEST`" class="requests-container">
        <div v-if="requests && requests.length > 0" class="list">
          <div v-for="request in requests" v-bind:key="request._id">
            <TranslationRequestPreview :request="request" @refresh-requests="getuserData"></TranslationRequestPreview>
          </div>
        </div>
        <div v-else>{{ props.username }} hasn't requested any translations yet!</div>
      </div>
      <div v-else-if="view === `TRANSLATION`" class="requests-container">
        <div v-if="contributions && contributions.translations.length > 0" class="list">
          <v-row v-for="(translation, idx) in contributions.translations" v-bind:key="translation._id">
            <v-col>
              <SectionComponent :section="contributions.sections[idx]"></SectionComponent>
            </v-col>
            <v-col>
              <SectionTranslationCard :section-translation="translation" @refresh-section-translations="getuserData">
              </SectionTranslationCard>
            </v-col>
            <v-divider></v-divider>
          </v-row>
        </div>
        <div v-else>{{ props.username }} hasn't translated anything yet!</div>
      </div>
      <div v-else class="requests-container">Please select a view!</div>
    </div>
  </main>
</template>
<style scoped>
h1 {
  font-weight: normal;
  font-family: tweb;
}

.requests-container {
  outline: 1px solid var(--tertiary);
  padding: 1em;
  max-height: 80vh;
  overflow-y: scroll;
  width: 100%;
}

.tags-col {
  padding: 0.25em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  flex-wrap: wrap;
}

.tags-row {
  padding: 0.25em;
  display: flex;
  flex-direction: row;
  row-gap: 1em;
  column-gap: 1.5em;
  flex-wrap: wrap;
}

.list {
  display: flex;
  flex-direction: column;
  row-gap: 1em;
}

.view-container.column {
  gap: 3em;
}

.column {
  align-items: start;
}

.viewer {
  width: 100%;
}</style>
