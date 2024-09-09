<template>
  <span class="text-weight-medium">{{ question.text }}</span>
  <ol
    v-if="question.questionObject.randomOrder === false"
    style="list-style-type: upper-alpha"
  >
    <li
      v-for="option of question.questionObject.options"
      :key="option.text"
      :class="{
        'text-positive': option.correctAnswer,
      }"
    >
      {{ option.text }}
      <span v-if="option.required" style="color: var(--q-primary)">
        &nbsp;*
      </span>
    </li>
  </ol>
  <ul
    v-if="question.questionObject.randomOrder === true"
    style="list-style-type: disc"
  >
    <li
      v-for="option of question.questionObject.options"
      :key="option.text"
      :class="{
        'text-positive': option.correctAnswer,
      }"
    >
      {{ option.text }}
      <span v-if="option.required" style="color: var(--q-primary)">
        &nbsp;*
      </span>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { Question } from '../../models';
interface Props {
  question: {
    questionObject: {
      options: { text: string; required: boolean; correctAnswer: boolean }[];
    };
  } & Question;
}

defineOptions({
  name: 'ABCQuestionType',
});

const { question } = defineProps<Props>();
</script>
