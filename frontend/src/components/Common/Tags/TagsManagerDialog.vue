<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-card-section>
        <div class="text-h6">Tags Manager</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <TagsManager
          :model="model"
          :borderless="borderless"
          :type="type"
          :placeholder="placeholder"
          @update="(val) => (localModel = val)"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="OK"
          color="primary"
          @click="onOkClick"
          v-close-popup
        />
        <q-btn
          flat
          label="Cancel"
          color="negative"
          @click="onCancelClick"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts" generic="T extends { [key: string]: unknown }">
import { useDialogPluginComponent } from 'quasar';
import { ref } from 'vue';
import TagsManager from './TagsManager.vue';

interface Props {
  type: 'subjects' | 'questions' | 'exams' | 'students';
  model: string[];
  borderless: boolean;
  placeholder: string;
}

const props = defineProps<Props>();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent<string[]>();

const localModel = ref<string[]>(props.model);

function onOkClick() {
  onDialogOK(localModel.value);
}

function onCancelClick() {
  onDialogCancel();
}
</script>
