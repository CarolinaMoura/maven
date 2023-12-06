<script setup lang="ts">
import VoteComponent from "@/components/Vote/VoteComponent.vue";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import DeleteSectionTranslation from "../Section/DeleteSectionTranslation.vue";
import { PayloadSectionTranslation } from "./PayloadSectionTranslation";

interface SectionTranslationProps {
  sectionTranslation: PayloadSectionTranslation;
}
const props = defineProps<SectionTranslationProps>();

const translatorName = props.sectionTranslation.translator;
const emit = defineEmits(["refreshSectionTranslations"]);
const isEdit = ref(false);
const edition = ref("");
const dialog = ref(false);
const totalVotes = ref(0);

const userStore = useUserStore();
const { isLoggedIn, currentUsername } = storeToRefs(userStore);

const enterEditMode = () => {
  isEdit.value = true;
  editCard();
};

const enterViewMode = async () => {
  try {
    await fetchy(`/api/sectionTranslation`, "PATCH", {
      query: {
        translation: edition.value,
        id: props.sectionTranslation._id,
      },
    });
  } catch (_) {
    return Error("Failed to save translation");
  }
  edition.value = "";
  isEdit.value = false;
  emit("refreshSectionTranslations");
};

const editCard = () => {
  edition.value = props.sectionTranslation.translation;
};

const getVotes = async () => {
  try {
    const votes = await fetchy("/api/votes", "GET", {
      query: { section: props.sectionTranslation._id },
    });
    totalVotes.value = votes; // set updated votes value here
  } catch {
    return;
  }
};

onBeforeMount(async () => {
  await getVotes();
});
</script>

<template>
  <div v-if="!isEdit">
    <v-card hover class="section-translation-card">
      <div class="display">
        <div class="column">
          <p>
            <b>Translator: </b><RouterLink :to="{ name: 'Profile', params: { username: props.sectionTranslation.translator } }"> {{ props.sectionTranslation.translator }} </RouterLink>
          </p>
          <p><b>Translation: </b>{{ props.sectionTranslation.translation }}</p>
        </div>
        <div class="button-col">
          <VoteComponent :section="props.sectionTranslation" :votes="totalVotes" @refreshVotes="getVotes" />

          <v-tooltip text="Edit translation">
            <template v-slot:activator="{ props }">
              <v-btn v-if="isLoggedIn && currentUsername === translatorName" icon="mdi-pencil" v-bind="props" variant="plain" size="x-small" @click="enterEditMode"></v-btn>
            </template>
          </v-tooltip>

          <DeleteSectionTranslation
            v-if="isLoggedIn && currentUsername === translatorName"
            :section-translation="props.sectionTranslation"
            @refresh-section-translations="emit('refreshSectionTranslations')"
          ></DeleteSectionTranslation>
        </div>
      </div>
    </v-card>
  </div>
  <div v-else>
    <v-card hover class="section-translation-card">
      <v-card-title>Edit Translation</v-card-title>

      <v-textarea label="Translation" auto-grow variant="outlined" class="edit-translation" v-model="edition"></v-textarea>
      <div class="button-row">
        <v-tooltip text="Save translation">
          <template v-slot:activator="{ props }">
            <v-btn v-if="isLoggedIn && currentUsername === translatorName" icon="mdi-content-save" v-bind="props" variant="plain" size="x-small" @click="enterViewMode"></v-btn>
          </template>
        </v-tooltip>
      </div>
    </v-card>
  </div>
</template>

<style scoped>
a {
  color: var(--primary-text);
}

.button-col {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.button-row {
  display: flex;
  flex-direction: row;
  justify-content: end;
}

.column {
  display: flex;
  flex-direction: column;
  align-items: start;
}
.display {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;
}
.v-card-actions {
  display: flex;
  flex-direction: column;
}

.section-translation-card {
  background-color: var(--secondary-20);
  box-sizing: border-box;
  word-wrap: break-word;
  padding: 1em;
}

.edit-translation {
  margin: 0.5rem 1rem;
}

.buttons-bar {
  display: flex;
  justify-content: right;
  gap: 0.5rem;
}
</style>
