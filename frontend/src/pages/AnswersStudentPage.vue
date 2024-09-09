<template>
  <q-page class="column items-center justify-start" v-if="examData">
    <div
      class="relative-position column items-center justify-start"
      style="width: 100%"
    >
      <h5 class="q-mb-sm q-mt-lg">Answer sheet for</h5>
      <h6 class="q-mb-sm q-mt-none">
        {{ `${studentData?.firstName} ${studentData?.lastName}` }}
      </h6>
      <div class="flex justify-end no-wrap absolute fixed-top-right">
        <q-btn
          flat
          round
          icon="delete"
          size="sm"
          color="negative"
          @click.stop="openDeleteDialog()"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[5, 5]">
            Delete
          </q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-tabs
      v-model="selectedScan"
      dense
      class="bg-grey-2 text-grey-7"
      active-color="primary"
      indicator-color="primary"
      align="justify"
    >
      <q-tab
        v-for="studentAnswer of studentAnswersData"
        :name="studentAnswer.scanNumber"
        :label="'Scan ' + (studentAnswer.scanNumber + 1)"
        :key="studentAnswer.scanNumber"
      />
      <q-tab
        v-if="studentAnswersData && studentAnswersData.length > 1"
        name="all"
        label="Aggregate"
      />
    </q-tabs>

    <q-tab-panels v-model="selectedScan" animated>
      <q-tab-panel
        v-for="studentAnswer of studentAnswersData"
        :key="studentAnswer.scanNumber"
        :name="studentAnswer.scanNumber"
      >
        <q-splitter v-model="splitterModel" style="width: 100%">
          <template v-slot:before>
            <div class="col q-gutter-md q-ma-md" style="min-width: 360px">
              <div v-if="studentAnswer.answerObject.group">
                Group: {{ studentAnswer.answerObject.group }}
              </div>
              <q-card
                v-for="(question, index) of questionsData"
                :key="question.id"
                class="q-pa-sm q-pr-md row no-wrap relative-position"
              >
                <q-btn
                  icon="edit"
                  style="
                    position: absolute;
                    top: 50%;
                    transform: translateY(-50%) translateX(-50%);
                    left: 100%;
                  "
                  class="no-shadow bg-white"
                  size="sm"
                  dense
                  @click="
                    openEditDialog(studentAnswer.answerObject, question.id)
                  "
                ></q-btn>
                <span>{{ index + 1 }}.&nbsp;</span>
                <div
                  style="display: inline-block; flex-grow: 1"
                  v-if="studentAnswer.answerObject[question.id] === undefined"
                >
                  <span class="text-negative"
                    >Scanner could not read the answer</span
                  >
                  <q-icon
                    style="float: right"
                    name="error"
                    color="negative"
                    size="sm"
                  />
                </div>

                {{ studentAnswer.answerObject[question.id] }}
              </q-card>
            </div>
          </template>
          <template v-slot:after>
            <div class="col q-gutter-md q-ma-md" style="min-width: 360px">
              <img
                style="width: 100%"
                :src="imgBase + studentAnswer.scanNumber"
              />
              <q-select
                label="Group"
                v-model="selectedGroup"
                :options="examInstanceData?.groups"
              />
              <iframe
                :src="examInstancePreview"
                frameborder="0"
                style="
                  width: 100%;
                  height: auto;
                  min-height: 29.7cm;
                  max-height: 29.7cm;
                  border: 1px solid gray;
                "
              ></iframe>
            </div>
          </template>
        </q-splitter>
      </q-tab-panel>

      <q-tab-panel name="all">
        <q-splitter v-model="splitterModel" style="width: 100%">
          <template v-slot:before>
            <div class="col q-gutter-md q-ma-md" style="min-width: 360px">
              <div v-if="studentAnswersAggregate.answerObject.group">
                Group: {{ studentAnswersAggregate.answerObject.group }}
              </div>
              <q-card
                v-for="(question, index) of questionsData"
                :key="question.id"
                class="q-pa-sm q-pr-md row no-wrap relative-position"
              >
                <span>{{ index + 1 }}.&nbsp;</span>
                <div
                  style="display: inline-block; flex-grow: 1"
                  v-if="
                    studentAnswersAggregate.answerObject[question.id] ===
                    undefined
                  "
                >
                  <span class="text-negative"
                    >Scanner could not read the answer</span
                  >
                  <q-icon
                    style="float: right"
                    name="error"
                    color="negative"
                    size="sm"
                  />
                </div>

                {{ studentAnswersAggregate.answerObject[question.id] }}
              </q-card>
            </div>
          </template>
          <template v-slot:after>
            <div class="col q-gutter-md q-ma-md" style="min-width: 360px">
              <q-select
                label="Group"
                v-model="selectedGroup"
                :options="examInstanceData?.groups"
              />
              <iframe
                :src="examInstancePreview"
                frameborder="0"
                style="
                  width: 100%;
                  height: auto;
                  min-height: 29.7cm;
                  max-height: 29.7cm;
                  border: 1px solid gray;
                "
              ></iframe>
            </div>
          </template>
        </q-splitter>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { getExam, getExamQuestions } from 'src/api/exams';
import { Question } from 'src/components/models';
import {
  deleteExamInstanceStudentAnswer,
  getExamInstance,
  getExamInstanceStudentAnswers,
  updateExamInstanceStudentAnswer,
} from 'src/api/examInstances';
import { getStudent } from 'src/api/students';
import { useQuasar } from 'quasar';
import DeleteDialog from 'src/components/Common/DeleteDialog.vue';
import _ from 'lodash';
import EditUnknownDialog from 'src/components/Common/EditUnknownDialog.vue';

defineOptions({
  name: 'ExamInstanceAnswerPage',
});

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const examId = ref(route.params.examId);
const examInstanceId = ref(route.params.instanceId);
const studentId = ref(route.params.studentId);

const queryClient = useQueryClient();

const { mutate: examInstanceAnswerDelete } = useMutation({
  mutationFn: (data: { scanNumber: number }) =>
    deleteExamInstanceStudentAnswer(
      examId.value as string,
      examInstanceId.value as string,
      studentId.value as string,
      data.scanNumber
    ),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: [
        'examInstance',
        examInstanceId.value,
        'answers',
        studentId.value,
      ],
    });
    if (!studentAnswersData.value || studentAnswersData.value?.length <= 0)
      router.back();
  },
});

const { mutate: examInstanceAnswerUpdate } = useMutation({
  mutationFn: (data: {
    scanNumber: number;
    answerObject: { [key: string]: unknown };
  }) =>
    updateExamInstanceStudentAnswer(
      examId.value as string,
      examInstanceId.value as string,
      studentId.value as string,
      data.scanNumber,
      data.answerObject
    ),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: [
        'examInstance',
        examInstanceId.value,
        'answers',
        studentId.value,
      ],
    });
  },
});

const { data: examResponse } = useQuery({
  queryFn: () => getExam(examId.value as string),
  queryKey: ['exam', examId.value],
});

const examData = computed(() => {
  const newData = examResponse.value;
  return newData ? toRaw(newData).data : undefined;
});

const { data: examQuestionsResponse } = useQuery({
  queryFn: () => getExamQuestions(examId.value as string),
  queryKey: ['questions', examId.value],
});

const questionsData = ref<Question[]>([]);

watch(
  [examQuestionsResponse, examData],
  ([newQuestionsData]) => {
    questionsData.value = newQuestionsData
      ? newQuestionsData.data.map((question) => {
          return {
            ...question,
            questionObject:
              examData.value?.configs?.questions?.[question.id]
                ?.questionObject || question.questionObject,
            answerObject:
              examData.value?.configs?.questions?.[question.id]?.answerObject ||
              question.answerObject,
            overwritten: !!examData.value?.configs?.questions?.[question.id],
          };
        })
      : [];
  },
  { immediate: true }
);

const { data: examInstanceResponse } = useQuery({
  queryFn: () =>
    getExamInstance(examId.value as string, examInstanceId.value as string),
  queryKey: ['examInstance', examInstanceId.value],
});

const examInstanceData = computed(() => {
  const newData = examInstanceResponse.value;
  return newData ? toRaw(newData.data) : undefined;
});

const { data: studentResponse } = useQuery({
  queryFn: () => getStudent(studentId.value as string),
  queryKey: ['student', studentId.value],
});

const studentData = computed(() => {
  const newData = studentResponse.value;
  return newData ? toRaw(newData).data : undefined;
});

const { data: studentAnswersResponse } = useQuery({
  queryFn: () =>
    getExamInstanceStudentAnswers(
      examId.value as string,
      examInstanceId.value as string,
      studentId.value as string
    ),
  queryKey: ['examInstance', examInstanceId.value, 'answers', studentId.value],
});

const studentAnswersData = computed(() => {
  const newData = studentAnswersResponse.value;
  return newData ? toRaw(newData).data : undefined;
});

const splitterModel = ref(50);
const imgBase = ref(
  process.env.API +
    '/images/' +
    examId.value +
    '/' +
    examInstanceId.value +
    '/' +
    studentId.value +
    '-'
);
const examInstancePreview = computed(
  () =>
    process.env.API +
    '/template/index.html#/exams/' +
    examId.value +
    '/instances/' +
    examInstanceId.value +
    '/groups/' +
    selectedGroup.value
);
const selectedScan = ref(0);
const selectedGroup = ref<string | undefined>(undefined);
const studentAnswersAggregate = computed(() => {
  if (studentAnswersData.value) return _.merge({}, ...studentAnswersData.value);
  return undefined;
});

watch(
  () => selectedScan.value,
  (newValue) => {
    selectedGroup.value =
      studentAnswersData.value?.find((answer) => answer.scanNumber === newValue)
        ?.answerObject.group || '';
  },
  { immediate: true }
);
watch(
  () => route.params.examId,
  (newId) => {
    examId.value = newId;
  }
);
watch(
  () => route.params.instanceId,
  (newId) => {
    examInstanceId.value = newId;
  }
);
watch(
  () => route.params.studentId,
  (newId) => {
    studentId.value = newId;
  }
);

function openEditDialog(
  answerObject: { [key: string]: unknown },
  questionId: string
) {
  $q.dialog({
    component: EditUnknownDialog,
    componentProps: {
      data: answerObject[questionId] || {},
    },
  }).onOk((data) => {
    examInstanceAnswerUpdate({
      scanNumber: selectedScan.value,
      answerObject: { ...answerObject, [questionId]: data },
    });
  });
}
function openDeleteDialog() {
  $q.dialog({
    component: DeleteDialog,
    componentProps: {
      message: 'You are about to delete following data:',
      data: studentAnswersData.value?.at(selectedScan.value),
    },
  }).onOk(() => {
    examInstanceAnswerDelete({ scanNumber: selectedScan.value });
  });
}
</script>
