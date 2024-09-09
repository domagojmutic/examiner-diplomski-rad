<template>
  <q-page class="column items-center justify-start" v-if="examInstanceData">
    <div
      class="relative-position column items-center justify-start"
      style="width: 100%"
    >
      <h4 class="q-mb-sm q-mt-lg">
        {{
          (examData?.name || `Exam ${examData?.id}`) +
          ' - ' +
          new Date(examInstanceData.generated).toLocaleDateString('hr')
        }}
      </h4>
      <h6 class="q-mb-sm q-mt-none">
        {{ `(${examInstanceData.id})` }}
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
    <!-- <div style="display: flex; flex-direction: row"> -->
    <q-splitter v-model="splitterModel" style="width: 100%">
      <template v-slot:before>
        <StudentsDisplayList
          :students="studentsData || []"
          :examId="(examId as string)"
          :examInstanceId="(examInstanceId as string)"
        />
      </template>
      <template v-slot:after>
        <div class="col q-gutter-md q-ma-md" style="min-width: 360px">
          <div class="row q-ml-none justify-between">
            <span class="text-blue-grey-5">Exam print preview</span>
          </div>
          <div style="display: flex; gap: 16px; justify-content: flex-end">
            <q-btn
              icon="sym_o_download"
              size="md"
              rounded
              color="positive"
              label="Download"
              @click="downloadExamGroupsPdf()"
            >
              <q-tooltip
                anchor="bottom middle"
                self="top middle"
                :offset="[0, 5]"
              >
                Download all groups
              </q-tooltip>
            </q-btn>
            <q-btn
              icon="sym_o_file_save"
              size="md"
              round
              color="positive"
              @click="downloadExamGroupPdf(selectedGroup)"
            >
              <q-tooltip
                anchor="bottom middle"
                self="top middle"
                :offset="[0, 5]"
              >
                Download exam group
              </q-tooltip>
            </q-btn>
          </div>
          <q-select
            label="Group"
            v-model="selectedGroup"
            :options="examInstanceData.groups"
          />
          <iframe
            :src="examInstancePreview"
            frameborder="0"
            style="
              width: 21cm;
              min-width: 21cm;
              max-width: 21cm;
              height: 29.7cm;
              min-height: 29.7cm;
              max-height: 29.7cm;
              border: 1px solid gray;
            "
          ></iframe>
        </div>
      </template>
    </q-splitter>
    <!-- </div> -->
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  deleteExamInstance,
  getExamInstance,
  getExamInstancePDF,
  getExamInstanceStudents,
} from 'src/api/examInstances';
import { getExam, getExamQuestions } from 'src/api/exams';
import { Question } from 'src/components/models';
import StudentsDisplayList from 'src/components/Students/StudentsDisplayList.vue';
import { useQuasar } from 'quasar';
import DeleteDialog from 'src/components/Common/DeleteDialog.vue';

defineOptions({
  name: 'ExamInstancePage',
});

const $q = useQuasar();

const route = useRoute();
const router = useRouter();
const examId = ref(route.params.examId);
const examInstanceId = ref(route.params.instanceId);

const queryClient = useQueryClient();

const { mutate: examInstanceDelete } = useMutation({
  mutationFn: () =>
    deleteExamInstance(examId.value as string, examInstanceId.value as string),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['examInstances', examId.value],
    });
    router.back();
  },
});

const { data: examInstanceResponse } = useQuery({
  queryFn: () =>
    getExamInstance(examId.value as string, examInstanceId.value as string),
  queryKey: ['examInstance', examInstanceId.value],
});

const examInstanceData = computed(() => {
  const newData = examInstanceResponse.value;
  return newData ? toRaw(newData).data : undefined;
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

const { data: studentsResponse } = useQuery({
  queryFn: () =>
    getExamInstanceStudents(
      examId.value as string,
      examInstanceId.value as string
    ),
  queryKey: ['students', examInstanceId.value],
});

const studentsData = computed(() => {
  const newData = studentsResponse.value;
  return newData ? toRaw(newData).data : undefined;
});

const splitterModel = ref(50);
const selectedGroup = ref(examInstanceData.value?.groups[0]);
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

watch(
  examInstanceData,
  (newData) => {
    selectedGroup.value = newData?.groups[0];
  },
  { immediate: true }
);

watch(
  () => route.params.examId,
  (newId) => {
    examInstanceId.value = newId;
  }
);
watch(
  () => route.params.instanceId,
  (newId) => {
    examInstanceId.value = newId;
  }
);

function downloadExamGroupPdf(group: string | undefined) {
  if (!group) return;
  getExamInstancePDF(
    examId.value as string,
    examInstanceId.value as string,
    group
  );
}

function downloadExamGroupsPdf() {
  examInstanceData.value?.groups.forEach((group) => {
    downloadExamGroupPdf(group);
  });
}

function openDeleteDialog() {
  $q.dialog({
    component: DeleteDialog,
    componentProps: {
      message: 'You are about to delete following data:',
      data: examInstanceData.value,
    },
  }).onOk(() => {
    examInstanceDelete();
  });
}
</script>
