<script setup lang="ts">
import VoteComponent from "@/components/Vote/VoteComponent.vue";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { useUserStore } from "../../stores/user";
import { fetchy } from "../../utils/fetchy";
import { PayloadSectionTranslation } from "./PayloadSectionTranslation";

interface SectionTranslationProps {
  sectionTranslation: PayloadSectionTranslation;
}
const props = defineProps<SectionTranslationProps>();
const translatorName = props.sectionTranslation.translatorName;
const emit = defineEmits(["refreshSectionTranslations"]);
const isEdit = ref(false);
const edition = ref("");
const dialog = ref(false);

const upvotes = ref(0);
const downvotes = ref(0);

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

const removeSectionTranslation = async () => {
  try {
    await fetchy(`/api/sectionTranslation/${props.sectionTranslation._id}`, "DELETE", {});
    emit("refreshSectionTranslations");
  } catch (_) {
    return Error("Failed to delete translation");
  }
};

const closeDialogAndRemoveTranslation = async () => {
  dialog.value = false;
  await removeSectionTranslation();
};

async function getVotes() {
  try {
    const votes = await fetchy("/api/votes", "GET", {
      query: { content: props.sectionTranslation._id },
    });
    upvotes.value = votes.upvotes;
    downvotes.value = votes.downvotes;
  } catch {
    return;
  }
}

// await getVotes();

</script>

<template>
  <v-card hover class="section-translation-card">
    <div v-if="!isEdit">
      <v-card-title class="title">
        <div style="display: inline-block">
          <b>Translator: </b>
          <u>{{ translatorName }}</u>
        </div>
        <v-btn v-if="isLoggedIn && currentUsername === translatorName" icon size="x-small" class="ml-auto"
          @click="enterEditMode">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <VoteComponent :section="props.sectionTranslation._id" :initUpvotes="upvotes" :initDownvotes="downvotes" />
      </v-card-title>
      <v-card-title>Translation:</v-card-title>
      <v-card-text>{{ props.sectionTranslation.translation }}</v-card-text>
    </div>
    <div v-else>
      <v-card-title class="title">
        <div style="display: inline-block">
          <b>Edit translation</b>
        </div>
        <div class="buttons-bar">
          <v-btn icon size="x-small" class="ml-auto" @click="enterViewMode">
            <v-icon>mdi-content-save</v-icon>
          </v-btn>
          <v-btn icon size="x-small" class="ml-auto">
            <v-icon>mdi-trash-can-outline</v-icon>
            <v-dialog v-model="dialog" activator="parent" width="auto">
              <v-card>
                <v-card-text> Are you sure you want to delete this translation? </v-card-text>
                <v-card-actions class="v-card-actions">
                  <v-btn color="primary" block @click="closeDialogAndRemoveTranslation">YES</v-btn>
                  <v-btn color="primary" style="padding: 0; margin: 0" block @click="dialog = false">NO</v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </v-btn>
        </div>
      </v-card-title>
      <v-textarea label="Translation" auto-grow variant="outlined" class="edit-translation"
        v-model="edition"></v-textarea>
    </div>
  </v-card>
</template>

<style scoped>
.v-card-actions {
  display: flex;
  flex-direction: column;
}

.section-translation-card {
  background-color: var(--secondary-20);
  box-sizing: border-box;
  word-wrap: break-word;
  width: 100%;
}

.title {
  display: flex;
  align-items: center;
  justify-content: space-between;
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
