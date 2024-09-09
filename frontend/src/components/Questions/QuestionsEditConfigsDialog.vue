<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">Edit Question Configs</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <ABCQuestionDialogPart
          v-if="question.type === 'ABC'"
          :questionObject="(questionObject as unknown as undefined)"
          :answerObject="(answerObject as unknown as undefined)"
          @update="
            (qObj, aObj) => {
              questionObject = qObj;
              answerObject = aObj;
            }
          "
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Apply"
          color="primary"
          @click="onApplyClick"
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

<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { Question } from '../models';
import ABCQuestionDialogPart from './ABCType/ABCQuestionDialogPart.vue';
import { toRaw } from 'vue';

interface Props {
  question: Question;
}

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

let questionObject = ref(structuredClone(toRaw(props.question.questionObject)));
let answerObject = ref(structuredClone(toRaw(props.question.answerObject)));

function onApplyClick() {
  onDialogOK({
    questionObject: toRaw(questionObject.value),
    answerObject: toRaw(answerObject.value),
  });
}

function onCancelClick() {
  onDialogCancel();
}
</script>
