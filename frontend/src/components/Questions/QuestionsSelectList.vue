<template>
  <div class="row">
    <q-checkbox
      v-model="selectAll"
      size="sm"
      label=""
      @update:model-value="
        (val) => {
          filteredQuestions.forEach((question) => {
            selected[question.id] = val;
          });
          $emit('updateAll', selected);
        }
      "
    />
    <q-space />

    <q-input
      borderless
      v-model="search"
      input-class="text-right"
      class="q-ml-md"
      placeholder="Search"
    >
      <template v-slot:append>
        <q-icon v-if="search === ''" name="search" />
        <q-icon
          v-else
          name="clear"
          class="cursor-pointer"
          @click="search = ''"
        />
      </template>
    </q-input>
  </div>
  <div
    v-for="question of filteredQuestions"
    :key="question.id"
    style="position: relative"
  >
    <q-checkbox
      v-model="selected[question.id]"
      size="sm"
      :label="question.text"
      @update:model-value="(val) => $emit('update', question.id, val)"
      style="margin-right: 64px"
    />
    <div
      class="absolute"
      style="right: 0; top: 50%; transform: translateY(-50%)"
    >
      <q-btn dense flat aside icon="visibility">
        <q-tooltip :offset="[6, 6]">
          <ABCQuestionDisplay
            :question="(question as any)"
            v-if="question.type === 'ABC'"
          />
          <TextQuestionDisplay
            v-else-if="question.type === 'Text'"
            :question="question"
          />
        </q-tooltip>
      </q-btn>
      <q-btn
        v-if="overwriteQuestions"
        dense
        flat
        aside
        icon="sym_o_manufacturing"
        @click="openEditQuestionConfigsDialog(question)"
      >
        <q-tooltip :offset="[6, 6]"> Overwrite question configs </q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Question } from '../models';
import ABCQuestionDisplay from './ABCType/ABCQuestionDisplay.vue';
import TextQuestionDisplay from './TextType/TextQuestionDisplay.vue';
import QuestionsEditConfigsDialog from './QuestionsEditConfigsDialog.vue';
import { ref, toRaw, watch } from 'vue';

interface Props {
  questions: Question[];
  selectedQuestionIds: string[];
  overwriteQuestions: boolean;
}

const props = defineProps<Props>();
const $emit = defineEmits<{
  update: [questionId: string, selected: boolean];
  updateAll: [selected: { [key: string]: boolean }];
  updateConfigs: [
    configItem: {
      questionId: string;
      questionObject: { [key: string]: unknown };
      answerObject: { [key: string]: unknown };
    }
  ];
}>();

const $q = useQuasar();
const filteredQuestions = ref(props.questions);
const selected = ref<{ [key: string]: boolean }>({});
const selectAll = ref(
  filteredQuestions.value.findIndex(
    (question) => !!selected.value[question.id] === false
  ) === -1
    ? true
    : false
);
const search = ref('');

watch(search, () => {
  filteredQuestions.value = props.questions.filter((question) => {
    return (
      question.text.toLowerCase().includes(search.value.toLowerCase()) ||
      question.tags.join(',').toLowerCase().includes(search.value.toLowerCase())
    );
  });
});

watch(selected.value, () => {
  if (
    filteredQuestions.value.findIndex(
      (question) => !!selected.value[question.id] === false
    ) === -1
  )
    selectAll.value = true;
  else selectAll.value = false;
});

watch(filteredQuestions.value, () => {
  if (
    filteredQuestions.value.findIndex(
      (question) => !!selected.value[question.id] === false
    ) === -1
  )
    selectAll.value = true;
  else selectAll.value = false;
});

watch(
  props,
  () => {
    filteredQuestions.value = props.questions;
    filteredQuestions.value.forEach((question) => {
      selected.value[question.id] = props.selectedQuestionIds.includes(
        question.id
      );
    });

    if (
      filteredQuestions.value.findIndex(
        (question) => !!selected.value[question.id] === false
      ) === -1
    )
      selectAll.value = true;
    else selectAll.value = false;
  },
  { immediate: true }
);

function openEditQuestionConfigsDialog(question: Question) {
  $q.dialog({
    component: QuestionsEditConfigsDialog,
    componentProps: {
      question: toRaw(question),
    },
  }).onOk((configItem) => {
    $emit('updateConfigs', { questionId: question.id, ...configItem });
  });
}
</script>
