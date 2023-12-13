<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const emit = defineEmits(["refreshSectionTranslations"]);
const props = defineProps(["section"]);
const content = ref<string>("");

const emptyForm = () => {
  content.value = "";
};

const createSectionTranslation = async (translation: string) => {
  try {
    await fetchy("/api/sectionTranslation", "POST", {
      query: {
        section: props.section,
        translation,
      },
    });
    emptyForm();
    emit("refreshSectionTranslations");
  } catch (_) {
    return Error("Failed to create section translation");
  }
};
</script>

<template>
  <form @submit.prevent="createSectionTranslation(content)">
    <div class="form-inner-container">
      <v-textarea class="inner-text text" placeholder="Write your own translation here" v-model="content"></v-textarea>
      <!-- <textarea id="content" v-model="content" placeholder="Write your own translation here" required> </textarea> -->
      <v-btn type="submit" class="pure-button-primary pure-button submit-button text">Post translation</v-btn>
    </div>
  </form>
</template>

<style scoped>
.form-inner-container {
  position: relative;
}

.text {
  font-family: tweb;
}

.submit-button {
  /* position: absolute; */
  /*
  bottom: 30px;
  right: 10px; */
  float: right;
  background-color: var(--quaternary);
}
</style>
