<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const { getUsers } = useUserStore();

const props = defineProps(["section", "votes", "upvote"]);
const emit = defineEmits(["refreshVotes"]);

let votes = ref(props.votes);
let upvoteButton: Ref<boolean> = ref(props.upvote);

const { currentUsername } = storeToRefs(useUserStore());
const { isLoggedIn } = storeToRefs(useUserStore());

const vote = async () => {
    try {
        await fetchy("/api/votes/vote", "POST", {
            body: { section: props.section._id, upvote: upvoteButton.value },
        });
    } catch {
        return;
    }
    emit("refreshVotes");
};

async function getVotes(section: string) {
    let results;
    try {
        results = await fetchy("api/votes", "GET", { content: section });
        if (results[0]) {
            votes.value = results[0].votes || 0;
        }
    } catch {
    }
}

onBeforeMount(async () => {
    await getVotes();
});
</script>

<template>
    <section v-if="isLoggedIn">
        <div class="votes">
            <span>{{ votes }}</span>
            <button @click="vote">
                <img src="@/assets/images/up-arrow.png" />
            </button>
        </div>
    </section>
</template>

<style scoped>
button {
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
    box-shadow: none;
    background: none;
    border: none;
    padding: 0.5em;
    cursor: pointer;
    transition: .3s ease;
    margin-right: 5px;
}

img {
    width: 1em;
}
</style>