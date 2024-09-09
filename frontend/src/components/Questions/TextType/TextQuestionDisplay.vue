<template>
  <span class="text-weight-medium">{{ question.text }}</span>
</template>

<script setup lang="ts">
import { Question } from '../../models';
interface Props {
  question: Question;
}

defineOptions({
  name: 'TextQuestionType',
});

defineProps<Props>();
</script>
