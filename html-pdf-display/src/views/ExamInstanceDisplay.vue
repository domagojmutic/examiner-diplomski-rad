<template>
  <div class="examInstance" v-if="exam && examInstance && questions">
    <div style="width: 60%; margin: 0 auto 16px auto; text-align: center">
      <span style="font-size: 30px"> {{ exam.name || '' }} </span>
    </div>
    <div style="display: flex; justify-content: space-between">
      <div style="text-align: start">
        <span style="font-size: 16px"> Group:&nbsp; </span>
        <span style="font-size: 16px; font-weight: 600"> {{ $route.params.groupName }} </span>
      </div>
      <div style="text-align: end; display: flex; flex-direction: column; align-items: flex-end">
        <span style="font-size: 16px"> ______________________________ </span>
        <span style="font-size: 12px; line-height: 0.5"> Name </span>
      </div>
    </div>
    <div
      v-for="(question, index) of questions"
      :key="question.id"
      style="
        position: relative;
        display: flex;
        align-items: baseline;
        width: 100%;
        margin-top: 4px;
        margin-bottom: 4px;
        break-inside: avoid;
      "
    >
      <span style="margin-right: 8px; width: 4ch">{{ index + 1 + '.&nbsp;' }}</span>
      <component
        style="width: 100%; position: relative"
        :is="'question-' + question.type + '-display'"
        :question="
          JSON.stringify({
            ...question,
            questionObject:
              exam?.configs?.questions?.[question.id]?.questionObject || question.questionObject,
            answerObject:
              exam?.configs?.questions?.[question.id]?.answerObject || question.answerObject
          })
        "
        :seed="(examInstance?.seed + seedOffset).toString()"
        :key="question.id + '-' + (examInstance?.seed + seedOffset).toString()"
      >
        Unable to load question!
      </component>
    </div>
  </div>
  <div v-else>
    <span>Data is loading or there was a problem with data</span>
  </div>
</template>

<script setup lang="ts">
import { stringToNumber } from '@/util/string';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const $route = useRoute();

const seedOffset = ref(stringToNumber($route.params.groupName as string));
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

watch(
  () => $route.params.groupName,
  (newGroupName) => {
    seedOffset.value = stringToNumber(newGroupName as string);
  }
);

fetch('/api/exams/' + $route.params.examId)
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

fetch('/api/exams/' + $route.params.examId + '/questions')
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

fetch('/api/exams/' + $route.params.examId + '/instances/' + $route.params.instanceId)
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
</script>

<style>
.examInstance {
  width: 100%;
}
</style>
