<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">Attach Questions</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-item class="q-pt-none">
          <q-item-section>
            <q-select
              label="Subject filter"
              v-model="selectedSubjectId"
              :options="subjectsOptions"
              option-value="id"
              option-label="name"
              emit-value
              map-options
            />
            <QuestionsSelectList
              :questions="questionsData"
              :selectedQuestionIds="questionIds"
              :overwriteQuestions="false"
              @update="
                (id, add) => {
                  if (add) questionIds.push(id);
                  else questionIds = questionIds.filter((qid) => qid !== id);
                }
              "
              @updateAll="
                (selectedQuestions) => {
                  questionIds = [];
                  Object.entries(selectedQuestions).forEach(([key, val]) => {
                    if (val) questionIds.push(key);
                  });
                }
              "
            />
          </q-item-section>
        </q-item>
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
import { computed, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { putSubjectQuestions } from 'src/api/subjects';
import { useQueryClient, useMutation, useQuery } from '@tanstack/vue-query';
import { getSubjectQuestions, getSubjects } from 'src/api/subjects';
import { getQuestions } from 'src/api/questions';
import { watch } from 'vue';
import QuestionsSelectList from '../Questions/QuestionsSelectList.vue';

interface Props {
  subjectId: string;
}

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: subjectUpdate } = useMutation({
  mutationFn: () => putSubjectQuestions(props.subjectId, questionIds.value),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: ['questions', props.subjectId],
    });
  },
});

const selectedSubjectId = ref<string | null | undefined>(null);

const { data: subjectQuestionsResponse, refetch: subjectQuestionsRefetch } =
  useQuery({
    queryFn: () =>
      selectedSubjectId.value
        ? getSubjectQuestions(selectedSubjectId.value)
        : null,
    queryKey: ['questions', selectedSubjectId.value],
  });

const { data: questionsResponse, refetch: questionsRefetch } = useQuery({
  queryFn: () => (selectedSubjectId.value ? null : getQuestions()),
  queryKey: ['questions'],
});

const questionsData = computed(() => {
  const newData = subjectQuestionsResponse.value || questionsResponse.value;
  return newData ? newData.data : [];
});

const { data: subjectsResponse } = useQuery({
  queryFn: () => getSubjects(),
  queryKey: ['subjects'],
});

const subjectsData = computed(() => {
  const newData = subjectsResponse.value;
  return newData ? newData.data : [];
});

const subjectsOptions = computed(() => {
  const options: {
    name: string;
    id: string | null;
  }[] = [{ name: 'All questions', id: null }];

  options.push(
    ...(subjectsData.value.map((subject) => {
      return {
        name: subject.name,
        id: subject.id,
      };
    }) || [])
  );
  return options;
});

watch(selectedSubjectId, () => {
  subjectQuestionsRefetch();
  questionsRefetch();
});

const questionIds = ref([
  ...(subjectsData.value.find((subject) => subject.id === props.subjectId)
    ?.questionIds || []),
]);

watch(
  () => subjectsData.value,
  () => {
    const subject = subjectsData.value.find(
      (subject) => subject.id === props.subjectId
    );
    questionIds.value = subject ? [...subject.questionIds] : [];
  },
  { immediate: true }
);

function onApplyClick() {
  subjectUpdate();
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
