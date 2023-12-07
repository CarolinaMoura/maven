<script setup lang="ts">
import { useUserStore } from "@/stores/user";
import { storeToRefs } from "pinia";
import { computed, onBeforeMount, ref } from "vue";
import { fetchy } from "../../utils/fetchy";
import SectionTranslationChooser from "../ExportTranslation/SectionTranslationChooser.vue";

const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
const props = defineProps(["section", "chosenTranslation"]);
const emits = defineEmits(["refresh-chosen"]);

const sectionTranslations = ref<Array<any>>([]);

const section = computed(() => props.section);

const chosenTranslation = computed(() => props.chosenTranslation);

const getAllSectionTranslations = async () => {
  try {
    const translations = await fetchy(`/api/sectionTranslation/${section.value._id}`, "GET");
    sectionTranslations.value = sectionTranslations.value.filter(() => false);
    sectionTranslations.value.push(...translations);
  } catch (_) {
    return Error("Failed to get section translations");
  }
};

onBeforeMount(async () => {
  await getAllSectionTranslations();
});

const refreshChosen = (id: any) => {
  emits("refresh-chosen", id);
};
</script>

<template>
  <div class="wrapper">
    <div class="section-translation-container">
      <header>
        <v-card-subtitle><i>(Choose a translation to export)</i></v-card-subtitle>
      </header>
      <div class="grid-1em">
        <div class="section-translation-list grid-1em">
          <div v-for="translation in sectionTranslations" :key="translation._id">
            <SectionTranslationChooser v-bind:translation="translation"
              v-bind:is-chosen="translation._id == chosenTranslation" @refresh-chosen="refreshChosen(translation._id)" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
header {
  margin: 1rem 0;
}

.wrapper {
  position: relative;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
}

.section-translation-container {
  padding-bottom: 100px;
}

h2 {
  font-weight: normal;
}

.grid-1em {
  display: flex;
  flex-direction: column;
  gap: 1em;
  /* justify-content: center; */
}

.section-translation-list {
  width: 100%;
}

.section-translation-container {
  position: absolute;
  overflow-y: auto;
  width: 90%;
}

@media screen and (min-width: 768px) {
  .section-translation-container {
    width: 80%;
  }
}
</style>
