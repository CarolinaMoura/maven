<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { defineEmits, defineProps, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["section", "votes"]);
const emit = defineEmits(["refreshVotes", "refreshSectionTranslations"]);

let downSelected = ref(false);
let upSelected = ref(false);
const { isLoggedIn } = storeToRefs(useUserStore());

const vote = async (upvote: boolean) => {
  try {
    if (upvote) upSelected.value = !upSelected.value;
    if (!upvote) downSelected.value = !downSelected.value;
    await fetchy("/api/votes/vote", "POST", {
      body: { section: props.section._id, upvote: upvote },
    });
    emit("refreshVotes");
    emit("refreshSectionTranslations");
  } catch {
    return new Error("Error voting");
  }
};

const getButtonColor = (upvote: boolean) => {
  if (upvote && upSelected.value) return "success";
  else if (!upvote && downSelected.value) return "success";
  return "white"
}
</script>

<template>
  <section v-if="isLoggedIn">
    <div class="vote-container">
      <v-btn size="x-small" @click="vote(true)" :color="getButtonColor(true)" icon>
        <v-icon size="20">{{ "mdi-chevron-up" }}</v-icon>
      </v-btn>
      <div class="vote-count">
        <span>{{ props.votes }}</span>
      </div>
      <v-btn size="x-small" @click="vote(false)" :color="getButtonColor(false)" icon>
        <v-icon size=" 20">{{ "mdi-chevron-down" }}</v-icon>
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
