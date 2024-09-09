<template>
  <template v-if="exam && examInstance && questions && student">
    <SheetDisplay
      :exam="exam"
      :examInstance="examInstance"
      :student="student"
      :questions="questions"
    ></SheetDisplay>
  </template>
  <div v-else>
    <span>Data is loading or there was a problem with data</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import SheetDisplay from '@/components/SheetDisplay.vue';

interface Props {
  examId: string;
  examInstanceId: string;
  studentId: string;
}

const props = defineProps<Props>();

const exam = ref<{
  tags: string[];
  id: string;
  questionIds: string[];
  configs: Record<string, any>;
  name?: string | null | undefined;
  subjectIds?: string[] | null | undefined;
}>();
const examInstance = ref<{
  examId: string;
  generated: string;
  groups: string[];
  id: string;
  seed: number;
  studentIds: string[];
}>();
const questions = ref<
  {
    id: string;
    text: string;
    type: string;
    questionObject: Record<string, any>;
    answerObject: Record<string, any>;
    tags: string[];
  }[]
>();
const student = ref<{
  id: string;
  tags: string[];
  firstName: string;
  lastName: string;
  studentId?: string | null | undefined;
}>();

fetch('/api/exams/' + props.examId)
  .then((res) => {
    if (res.ok) return res.json();
  })
  .then(
    (body: {
      statusCode: number;
      statusMessage: string;
      data: {
        tags: string[];
        id: string;
        questionIds: string[];
        configs: Record<string, any>;
        name?: string | null | undefined;
        subjectIds?: string[] | null | undefined;
      };
    }) => {
      exam.value = body.data;
    }
  );

fetch('/api/exams/' + props.examId + '/questions')
  .then((res) => {
    if (res.ok) return res.json();
  })
  .then(
    (body: {
      statusCode: number;
      statusMessage: string;
      data: {
        id: string;
        text: string;
        type: string;
        questionObject: Record<string, any>;
        answerObject: Record<string, any>;
        tags: string[];
      }[];
    }) => {
      questions.value = body.data;

      const questionTypes: string[] = [];
      questions.value.forEach((question) => {
        if (!questionTypes.includes(question.type)) {
          import(
            '/plugins/questions/' +
              question.type.toLowerCase() +
              '/' +
              question.type.toLowerCase() +
              '-component.js'
          );
          questionTypes.push(question.type);
        }
      });
    }
  );

fetch('/api/exams/' + props.examId + '/instances/' + props.examInstanceId)
  .then((res) => {
    if (res.ok) return res.json();
  })
  .then(
    (body: {
      statusCode: number;
      statusMessage: string;
      data: {
        examId: string;
        generated: string;
        groups: string[];
        id: string;
        seed: number;
        studentIds: string[];
      };
    }) => {
      examInstance.value = body.data;
    }
  );

fetch('/api/students/' + props.studentId)
  .then((res) => {
    if (res.ok) return res.json();
  })
  .then(
    (body: {
      statusCode: number;
      statusMessage: string;
      data: {
        id: string;
        tags: string[];
        firstName: string;
        lastName: string;
        studentId?: string | null | undefined;
      };
    }) => {
      student.value = body.data;
    }
  );
</script>
