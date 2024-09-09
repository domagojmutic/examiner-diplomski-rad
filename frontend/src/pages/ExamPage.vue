<template>
  <q-page class="column items-center justify-start" v-if="examData">
    <div
      class="relative-position column items-center justify-start"
      style="width: 100%"
    >
      <h4 class="q-mb-sm q-mt-lg">
        {{ examData.name || `Exam ${examData.id}` }}
      </h4>
      <TagsDisplay :tags="examData.tags" class="q-mb-md" />

      <div class="flex justify-end no-wrap absolute fixed-top-right">
        <q-btn
          flat
          round
          icon="tag"
          size="sm"
          color="positive"
          @click.stop="openTagsDialog()"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[5, 5]">
            Tag Manager
          </q-tooltip>
        </q-btn>
        <q-btn
          flat
          round
          icon="edit"
          size="sm"
          color="warning"
          @click.stop="openEditDialog()"
        >
          <q-tooltip anchor="center right" self="center left" :offset="[5, 5]">
            Edit
          </q-tooltip>
        </q-btn>
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

    <q-splitter v-model="splitterModel" style="width: 100%">
      <template v-slot:before>
        <ExamInstancesDisplayList
          :exam="examData"
          :examInstances="examInstancesData"
        />
      </template>
      <template v-slot:after>
        <QuestionsDisplayList
          :questions="questionsData"
          :examId="(examId as string)"
        />
      </template>
    </q-splitter>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  getExam,
  getExamQuestions,
  getExamInstances,
  deleteExam,
} from 'src/api/exams';
import TagsDisplay from '../components/Common/Tags/TagsDisplay.vue';
import QuestionsDisplayList from '../components/Questions/QuestionsDisplayList.vue';
import ExamInstancesDisplayList from 'src/components/Exams/Instances/ExamInstancesDisplayList.vue';
import { Exam, Question } from 'src/components/models';
import { useQuasar } from 'quasar';
import TagsManagerDialog from 'src/components/Common/Tags/TagsManagerDialog.vue';
import DeleteDialog from 'src/components/Common/DeleteDialog.vue';
import ExamsEditDialog from 'src/components/Exams/ExamsEditDialog.vue';
import { putExamTags } from 'src/api/tags';

defineOptions({
  name: 'ExamPage',
});

const $q = useQuasar();
const route = useRoute();
const examId = ref(route.params.examId);

const queryClient = useQueryClient();

const { mutate: examTagsUpdate } = useMutation({
  mutationFn: (data: { id: string; tags: string[] }) =>
    putExamTags(data.id, data.tags),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: ['exam', examId.value],
    });
  },
});
const { mutate: examsDelete } = useMutation({
  mutationFn: (id: string) => deleteExam(id),
  onSuccess: () => {
    queryClient.invalidateQueries({
      queryKey: ['exam', examId.value],
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

const { data: examInstancesResponse } = useQuery({
  queryFn: () => getExamInstances(examId.value as string),
  queryKey: ['examInstances', examId.value],
});

const examInstancesData = computed(() => {
  const newData = examInstancesResponse.value;
  return newData ? newData.data : [];
});

const splitterModel = ref(50);

watch(
  () => route.params.examId,
  (newId) => {
    examId.value = newId;
  }
);

function openDeleteDialog() {
  $q.dialog({
    component: DeleteDialog,
    componentProps: {
      message: 'You are about to delete following data:',
      data: toRaw(examData.value),
    },
  }).onOk((exam: Exam) => {
    examsDelete(exam.id);
  });
}

function openTagsDialog() {
  $q.dialog({
    component: TagsManagerDialog,
    componentProps: {
      model: toRaw(examData.value?.tags),
      type: 'exams',
      placeholder: 'Exam tags',
      borderless: false,
    },
  }).onOk((tags: string[]) => {
    examTagsUpdate({ id: examId.value as string, tags });
  });
}

function openEditDialog() {
  $q.dialog({
    component: ExamsEditDialog,
    componentProps: {
      exam: toRaw(examData.value),
      queryKey: ['exam', examId.value as string],
    },
  });
}
</script>
