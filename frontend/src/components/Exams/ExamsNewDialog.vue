<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">New Exam</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-item>
          <q-item-section>
            <q-input outlined v-model="name" label="Name" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <TagsManager
              :type="'exams'"
              :model="tags"
              :borderless="false"
              placeholder="Exam Tags"
              @update="(val) => (tags = val)"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-select
              label="Subjects"
              outlined
              v-model="subjectIds"
              :options="subjectsData"
              option-value="id"
              option-label="name"
              emit-value
              map-options
              multiple
            />
          </q-item-section>
        </q-item>
        <div class="text-subtitle1">Questions</div>
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
              :overwriteQuestions="true"
              @update="
                (id, add) => {
                  if (add) questionIds.push(id);
                  else {
                    questionIds = questionIds.filter((qid) => qid !== id);
                    delete configs.questions[id];
                  }
                }
              "
              @updateConfigs="
                (configItem) =>
                  (configs.questions[configItem.questionId] = {
                    questionObject: configItem.questionObject,
                    answerObject: configItem.answerObject,
                  })
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
          label="Create"
          color="primary"
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
import { computed, ref, watch } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { postExam } from 'src/api/exams';
import { Exam } from '../models';
import { useQueryClient, useMutation, useQuery } from '@tanstack/vue-query';
import { getSubjectQuestions, getSubjects } from 'src/api/subjects';
import { getQuestions } from 'src/api/questions';
import TagsManager from '../Common/Tags/TagsManager.vue';
import QuestionsSelectList from '../Questions/QuestionsSelectList.vue';

interface Props {
  subjectId?: string;
}

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: examCreate } = useMutation({
  mutationFn: (data: { exam: Omit<Exam, 'id'> }) => postExam(data.exam),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({ queryKey: ['exams', props.subjectId] });
  },
});

const selectedSubjectId = ref<string | null | undefined>(props.subjectId);

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
    ...(subjectIds.value?.map((subjectId) => {
      const subject = subjectsData.value.find((sub) => sub.id === subjectId);
      return {
        name: subject?.name || subjectId,
        id: subjectId,
      };
    }) || [])
  );
  return options;
});

watch(selectedSubjectId, () => {
  subjectQuestionsRefetch();
  questionsRefetch();
});

const name = ref('');
const tags = ref<string[]>([]);
const questionIds = ref<string[]>([]);
const configs = ref<{
  [key: string]: unknown;
  questions: {
    [key: string]: {
      questionObject: { [key: string]: unknown };
      answerObject: { [key: string]: unknown };
    };
  };
}>({ questions: {} });
const subjectIds = ref<string[] | null | undefined>(
  props.subjectId ? [props.subjectId] : null
);

function onCreateClick() {
  examCreate({
    exam: {
      subjectIds: props.subjectId ? [props.subjectId] : [],
      name: name.value,
      tags: tags.value,
      questionIds: questionIds.value,
      configs: configs.value,
    },
  });
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
