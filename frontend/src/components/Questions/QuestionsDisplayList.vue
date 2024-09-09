<template>
  <div class="col q-gutter-md q-ma-md" style="min-width: 360px">
    <div class="row q-ml-none justify-between">
      <span class="text-blue-grey-5">Questions</span>
      <div>
        <q-btn
          v-if="subjectId || examId"
          color="primary"
          icon="sym_o_attach_file_add"
          class="q-ml-sm"
          round
          size="sm"
          dense
          @click="openExistingQuestionDialog()"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
            Existing Question
          </q-tooltip>
        </q-btn>
        <q-btn
          color="positive"
          icon="add"
          class="q-ml-sm"
          round
          size="sm"
          dense
          @click="openNewQuestionDialog()"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
            New Question
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-card
      v-for="(question, index) of questions"
      :key="question.id"
      class="q-pa-md"
    >
      <div class="absolute fixed-top-right">
        <q-btn-group>
          <q-btn
            v-if="examId && (question as any).overwritten"
            size="sm"
            dense
            @click="openRemoveQuestionOverwritesDialog(examId, question.id)"
          >
            <q-icon name="sym_o_manufacturing"></q-icon>
            <q-icon style="position: absolute">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#000"
              >
                <path d="M790-56 414-434T140-708l-84-84 56-56 736 736-58 56Z" />
                <path
                  d="M790-56 414-434T140-708l-84-84 56-56 736 736-58 56Z"
                  fill="#fff"
                  transform="translate(60, -60)"
                />
              </svg>
            </q-icon>
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Remove overwrites for question
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="examId"
            size="sm"
            dense
            @click="openEditQuestionConfigsDialog(question)"
          >
            <q-icon name="sym_o_manufacturing" />
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Overwrite question configs
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="edit"
            size="sm"
            dense
            @click="openEditQuestionDialog(question)"
          >
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Edit Question
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="subjectId || examId"
            icon="sym_o_attach_file_off"
            size="sm"
            dense
            @click="openDetachDialog(question)"
          >
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Remove Question from
              {{ subjectId ? 'subject' : examId ? 'exam' : '' }}
            </q-tooltip>
          </q-btn>
        </q-btn-group>
      </div>
      <div
        style="float: right; height: 1lh; shape-outside: margin-box"
        :style="{ width: examId ? '50px' : '30px' }"
      ></div>
      <ABCQuestionDisplay
        v-if="question.type === 'ABC'"
        :question="(question as any)"
      />
      <TextQuestionDisplay
        v-else-if="question.type === 'Text'"
        :question="question"
      />
      <div class="absolute fixed-bottom-right">
        <q-btn size="sm" flat dense @click="expanded[index] = !expanded[index]">
          <q-icon
            name="keyboard_arrow_down"
            style="transition: all 250ms"
            :style="{
              transform: expanded[index] ? 'rotate(180deg)' : 'rotate(0deg)',
            }"
          />
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
            Show Details
          </q-tooltip>
        </q-btn>
      </div>
      <div v-if="expanded[index]" style="font-size: 0.8em">
        <div>
          <span>Tags:</span>
          <TagsDisplay :tags="question.tags" />
        </div>
        <div>
          <span>Type: </span>
          <span>{{ question.type }}</span>
        </div>
        <div v-if="examId && (question as any).overwritten !== undefined">
          <span>Overwritten: </span>
          <span>{{ (question as any).overwritten }}</span>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Exam, Question } from '../models';
import ABCQuestionDisplay from './ABCType/ABCQuestionDisplay.vue';
import QuestionsNewDialog from './QuestionsNewDialog.vue';
import QuestionsEditDialog from './QuestionsEditDialog.vue';
import TextQuestionDisplay from './TextType/TextQuestionDisplay.vue';
import TagsDisplay from '../Common/Tags/TagsDisplay.vue';
import { ref, toRaw } from 'vue';
import QuestionsDetachDialog from './QuestionsDetachDialog.vue';
import SubjectsAttachQuestions from '../Subjects/SubjectsAttachQuestions.vue';
import ExamsAttachQuestions from '../Exams/ExamsAttachQuestions.vue';
import QuestionsEditConfigsDialog from './QuestionsEditConfigsDialog.vue';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { patchExam } from 'src/api/exams';
import ExamRemoveOverwriteDialog from '../Exams/ExamRemoveOverwriteDialog.vue';

interface Props {
  subjectId?: string;
  examId?: string;
  questions: Question[];
}

defineOptions({
  name: 'QuestionDisplayList',
});

const props = defineProps<Props>();
const $q = useQuasar();
const queryClient = useQueryClient();

const { mutate: examUpdate } = useMutation({
  mutationFn: (data: { exam: Partial<Exam> }) => {
    if (props.examId) return patchExam(props.examId, data.exam);
    throw Error('Expected examId');
  },
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: ['exam', props.examId],
    });
  },
});

const expanded = ref<boolean[]>([]);

function openNewQuestionDialog() {
  $q.dialog({
    component: QuestionsNewDialog,
    componentProps: {
      subjectId: props.subjectId,
      examId: props.examId,
    },
  });
}
function openEditQuestionDialog(question: Question) {
  $q.dialog({
    component: QuestionsEditDialog,
    componentProps: {
      question: toRaw(question),
    },
  });
}
function openEditQuestionConfigsDialog(question: Question) {
  $q.dialog({
    component: QuestionsEditConfigsDialog,
    componentProps: {
      question: toRaw(question),
    },
  }).onOk(({ questionObject, answerObject }) => {
    examUpdate({
      exam: {
        configs: {
          questions: { [question.id]: { questionObject, answerObject } },
        },
      },
    });
  });
}
function openExistingQuestionDialog() {
  $q.dialog({
    component: props.subjectId ? SubjectsAttachQuestions : ExamsAttachQuestions,
    componentProps: {
      subjectId: props.subjectId,
      examId: props.examId,
    },
  });
}
function openDetachDialog(question: Question) {
  $q.dialog({
    component: QuestionsDetachDialog,
    componentProps: {
      subjectId: props.subjectId,
      examId: props.examId,
      question: toRaw(question),
      type: props.subjectId ? 'subject' : props.examId ? 'exam' : '',
    },
  });
}
function openRemoveQuestionOverwritesDialog(
  examId: string,
  questionId: string
) {
  $q.dialog({
    component: ExamRemoveOverwriteDialog,
    componentProps: {
      examId: examId,
      questionId: questionId,
    },
  });
}
</script>
