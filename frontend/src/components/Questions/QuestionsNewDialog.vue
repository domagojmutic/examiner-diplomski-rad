<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">New Question</div>
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
          label="Create"
          color="primary"
          :disable="!isValid"
          @click="onCreateClick"
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
import { ref, computed } from 'vue';
import TagsManager from '../Common/Tags/TagsManager.vue';
import { useDialogPluginComponent } from 'quasar';
import { postSubjectQuestion } from 'src/api/subjects';
import { postQuestion } from 'src/api/questions';
import { Question } from '../models';
import { useQueryClient, useMutation } from '@tanstack/vue-query';
import ABCQuestionDialogPart from './ABCType/ABCQuestionDialogPart.vue';
import { postExamQuestion } from 'src/api/exams';

interface Props {
  subjectId?: string;
  examId?: string;
}

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: questionCreate } = useMutation({
  mutationFn: (data: { question: Omit<Question, 'id'> }) =>
    postQuestion(data.question),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({ queryKey: ['questions'] });
  },
});

const { mutate: subjectQuestionCreate } = useMutation({
  mutationFn: (data: { question: Omit<Question, 'id'> }) => {
    if (props.subjectId)
      return postSubjectQuestion(props.subjectId, data.question);
    throw Error('Expected subjectId');
  },
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({ queryKey: ['questions', props.subjectId] });
  },
});

const { mutate: examQuestionCreate } = useMutation({
  mutationFn: (data: { question: Omit<Question, 'id'> }) => {
    if (props.examId) return postExamQuestion(props.examId, data.question);
    throw Error('Expected examId');
  },
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({ queryKey: ['questions', props.examId] });
  },
});

let text = ref('');
let tags = ref<string[]>([]);
let type = ref<string>('');
let questionObject = ref({});
let answerObject = ref({});

const isValid = computed(() => {
  if (text.value != undefined && text.value !== '') return true;
  else return false;
});

function onCreateClick() {
  props.subjectId
    ? subjectQuestionCreate({
        question: {
          text: text.value,
          tags: tags.value,
          type: type.value,
          questionObject: questionObject.value,
          answerObject: answerObject.value,
        },
      })
    : props.examId
    ? examQuestionCreate({
        question: {
          text: text.value,
          tags: tags.value,
          type: type.value,
          questionObject: questionObject.value,
          answerObject: answerObject.value,
        },
      })
    : questionCreate({
        question: {
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
