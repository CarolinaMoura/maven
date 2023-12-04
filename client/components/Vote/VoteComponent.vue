<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const props = defineProps(["section", "votes"]);
const emit = defineEmits(["refreshVotes"]);

let votes = ref(props.votes);

const { isLoggedIn } = storeToRefs(useUserStore());

const vote = async (upvote: boolean) => {
    console.log("voted", upvote, props.section._id);
    try {
        await fetchy("/api/votes/vote", "POST", {
            body: { section: props.section._id, upvote: upvote },
        });
    } catch {
        return;
    }
    emit("refreshVotes");
};
</script>

<template>
    <section v-if="isLoggedIn">
        <button @click="vote(true)">
            <img src="@/assets/images/up-arrow.png" />
        </button>
        <span>{{ votes }}</span>
        <button @click="vote(false)">
            <img src="@/assets/images/down-arrow.png" />
        </button>
    </section>
</template>

<style scoped>
button {
    padding: 0.5em;
    cursor: pointer;
    margin-right: 5px;
}

img {
    width: 1em;
}
</style>
