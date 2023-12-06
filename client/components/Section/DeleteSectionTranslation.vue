<script setup lang="ts">
import { ref } from "vue";
import { fetchy } from "../../utils/fetchy";

const menu = ref(false);
const props = defineProps(["sectionTranslation"]);
const emit = defineEmits(["refreshSectionTranslations"]);

async function deleteTranslation() {
  try {
    await fetchy(`/api/sectionTranslation/${props.sectionTranslation._id}`, "DELETE", {});
    emit("refreshSectionTranslations");
  } catch (_) {
    return Error("Failed to delete translation");
  }
}
</script>
<template>
  <div class="text-center">
    <v-menu v-model="menu" :close-on-content-click="false" location="end">
      <template v-slot:activator="{ props }">
        <v-btn variant="plain" v-bind="props" icon="mdi-trash-can"></v-btn>
      </template>

      <v-card min-width="400" max-width="500">
        <v-list>
          <v-list-item :title="`Delete Translation`" :subtitle="`Are you sure you want to delete this translation? `"> </v-list-item>
        </v-list>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="menu = false"> Cancel </v-btn>
          <v-btn color="primary" variant="text" @click="deleteTranslation"> Delete </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>
  </div>
</template>
