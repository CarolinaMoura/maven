<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, defineEmits, defineProps, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["section", "votes"]);
const emit = defineEmits(["refreshVotes", "refreshSectionTranslations"]);

const { isLoggedIn } = storeToRefs(useUserStore());
const curVote = ref<"UPVOTE" | "DOWNVOTE" | "NONE">("NONE");
const sectionId = computed(() => props.section._id);

async function removeVote() {
  await fetchy("/api/votes/removeVote", "DELETE", {
    query: { section: sectionId.value },
  });
  curVote.value = "NONE";
}
async function sendVote(upvote: boolean) {
  await fetchy("/api/votes/vote", "POST", {
    body: { section: sectionId.value, upvote },
  });
  curVote.value = upvote ? "UPVOTE" : "DOWNVOTE";
}

const vote = async (upvote: boolean) => {
  if ((upvote && curVote.value == "UPVOTE") || (!upvote && curVote.value == "DOWNVOTE")) {
    await removeVote();
  } else {
    await sendVote(upvote);
  }
  emit("refreshVotes");
};

async function getVoteType() {
  const res = await fetchy("/api/votes/myVote", "GET", { query: { section: sectionId.value } });
  curVote.value = res;
}

onBeforeMount(async () => {
  await getVoteType();
});
</script>

<template>
  <section v-if="isLoggedIn">
    <div class="vote-container">
      <v-btn @click="vote(true)" variant="plain" icon color="#95AEB3">
        <v-icon v-if="curVote == 'UPVOTE'" size=" 20">mdi-arrow-up-bold</v-icon>
        <v-icon v-else>mdi-arrow-up-bold-outline</v-icon>
      </v-btn>
      <div class="vote-count">
        <span>{{ props.votes }}</span>
      </div>
      <v-btn @click="vote(false)" variant="plain" icon color="#95AEB3">
        <v-icon v-if="curVote == 'DOWNVOTE'" size=" 20">mdi-arrow-down-bold</v-icon>
        <v-icon v-else>mdi-arrow-down-bold-outline</v-icon>
      </v-btn>
    </div>
  </section>
</template>

<style scoped>
.vote-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-left: 5px;
}

.vote-count {
  padding-right: 5px;
}

v-btn {
  height: 10px;
  width: 10px;
}

button {
  padding: 0.5em;
  cursor: pointer;
  margin-right: 5px;
}

img {
  width: 1em;
}
</style>
