<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">Edit Question</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-item>
          <q-item-section>
            <q-input
              outlined
              v-model="text"
              label="Text"
              autogrow
              :rules="[(val) => !!val || '* required']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              outlined
              v-model="type"
              label="Type"
              :options="['ABC', 'Text']"
              :rules="[(val) => !!val || '* required']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <TagsManager
              :type="'questions'"
              :model="tags"
              :borderless="false"
              placeholder="Question Tags"
              @update="(val) => (tags = val)"
            />
          </q-item-section>
        </q-item>
        <q-separator class="q-my-sm" />
        <ABCQuestionDialogPart
          v-if="type === 'ABC'"
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
          :disable="!isValid"
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
import { ref, computed, toRaw } from 'vue';
import TagsManager from '../Common/Tags/TagsManager.vue';
import { useDialogPluginComponent } from 'quasar';
import { putQuestion } from 'src/api/questions';
import { Question } from '../models';
import { useQueryClient, useMutation } from '@tanstack/vue-query';
import ABCQuestionDialogPart from './ABCType/ABCQuestionDialogPart.vue';

interface Props {
  question: Question;
}

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: questionUpdate } = useMutation({
  mutationFn: (data: { question: Question }) =>
    putQuestion(props.question.id, data.question),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: ['questions'],
    });
  },
});

let text = ref(props.question.text);
let tags = ref<string[]>([...props.question.tags]);
let type = ref<string>(props.question.type);
let questionObject = ref(structuredClone(toRaw(props.question.questionObject)));
let answerObject = ref(structuredClone(toRaw(props.question.answerObject)));

const isValid = computed(() => {
  if (text.value != undefined && text.value !== '') return true;
  else return false;
});

function onApplyClick() {
  questionUpdate({
    question: {
      id: props.question.id,
      text: text.value,
      tags: tags.value,
      type: type.value,
      questionObject: questionObject.value,
      answerObject: answerObject.value,
    },
  });
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
