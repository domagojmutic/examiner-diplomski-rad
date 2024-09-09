<template>
  <q-page class="column items-center justify-start" v-if="subjectData">
    <div
      class="relative-position column items-center justify-start"
      style="width: 100%"
    >
      <h4 class="q-mb-sm q-mt-lg">{{ subjectData.name }}</h4>
      <TagsDisplay :tags="subjectData.tags" class="q-mb-md" />

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
        <ExamsDisplayList
          :exams="examsData"
          :subjectId="(subjectId as string)"
        />
      </template>
      <template v-slot:after>
        <QuestionsDisplayList
          :questions="questionsData"
          :subjectId="(subjectId as string)"
        />
      </template>
    </q-splitter>
    <!-- </div> -->
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref, toRaw, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  deleteSubject,
  getSubject,
  getSubjectExams,
  getSubjectQuestions,
} from 'src/api/subjects';
import TagsDisplay from '../components/Common/Tags/TagsDisplay.vue';
import QuestionsDisplayList from '../components/Questions/QuestionsDisplayList.vue';
import ExamsDisplayList from 'src/components/Exams/ExamsDisplayList.vue';
import TagsManagerDialog from 'src/components/Common/Tags/TagsManagerDialog.vue';
import DeleteDialog from 'src/components/Common/DeleteDialog.vue';
import { Subject } from 'src/components/models';
import SubjectsEditDialog from 'src/components/Subjects/SubjectsEditDialog.vue';
import { useQuasar } from 'quasar';
import { putSubjectTags } from 'src/api/tags';

defineOptions({
  name: 'SubjectPage',
});

const route = useRoute();
const subjectId = ref(route.params.subjectId);
const $q = useQuasar();
const queryClient = useQueryClient();

const { mutate: subjectTagsUpdate } = useMutation({
  mutationFn: (data: { id: string; tags: string[] }) =>
    putSubjectTags(data.id, data.tags),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({ queryKey: ['subject', subjectId.value] });
  },
});
const { mutate: subjectsDelete } = useMutation({
  mutationFn: (id: string) => deleteSubject(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['subject', subjectId.value] });
  },
});

const { data: subjectResponse } = useQuery({
  queryFn: () => getSubject(subjectId.value as string),
  queryKey: ['subject', subjectId.value],
});

const subjectData = computed(() => {
  const newData = subjectResponse.value;
  return newData ? toRaw(newData).data : undefined;
});

const { data: subjectQuestionsResponse } = useQuery({
  queryFn: () => getSubjectQuestions(subjectId.value as string),
  queryKey: ['questions', subjectId.value],
});

const questionsData = computed(() => {
  const newData = subjectQuestionsResponse.value;
  return newData ? newData.data : [];
});

const { data: subjectExamsResponse } = useQuery({
  queryFn: () => getSubjectExams(subjectId.value as string),
  queryKey: ['exams', subjectId.value],
});

const examsData = computed(() => {
  const newData = subjectExamsResponse.value;
  return newData ? newData.data : [];
});

const splitterModel = ref(50);

watch(
  () => route.params.subjectId,
  (newId) => {
    subjectId.value = newId;
  }
);

function openDeleteDialog() {
  $q.dialog({
    component: DeleteDialog,
    componentProps: {
      message: 'You are about to delete following data:',
      data: toRaw(subjectData.value),
    },
  }).onOk((subject: Subject) => {
    subjectsDelete(subject.id);
  });
}

function openTagsDialog() {
  $q.dialog({
    component: TagsManagerDialog,
    componentProps: {
      model: toRaw(subjectData.value?.tags),
      type: 'subjects',
      placeholder: 'Subject tags',
      borderless: false,
    },
  }).onOk((tags: string[]) => {
    subjectTagsUpdate({ id: subjectId.value as string, tags });
  });
}

function openEditDialog() {
  $q.dialog({
    component: SubjectsEditDialog,
    componentProps: {
      subject: toRaw(subjectData.value),
      queryKey: ['subject', subjectId.value],
    },
  });
}
</script>
