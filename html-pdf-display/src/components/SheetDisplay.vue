<template>
  <div class="examSheet" v-if="exam && examInstance && questions && student">
    <div style="margin-right: 5mm; margin-left: 5mm; position: relative">
      <div style="width: 60%; margin: 0 auto 16px auto; text-align: center">
        <span style="font-size: 30px"> Answer sheet for {{ exam.name || '' }} </span>
      </div>
      <div style="display: flex; justify-content: space-between">
        <div class="group">
          <span>Group:</span>
          <div style="position: relative; margin-top: 24px">
            <div
              style="
                width: 24px;
                height: 24px;
                position: absolute;
                bottom: calc(100% + 4px);
                left: 8px;
              "
              v-html="dictionary.generateSVG(1000)"
            ></div>
            <div
              style="
                width: 24px;
                height: 24px;
                position: absolute;
                top: calc(100% - 1lh + 2px);
                left: calc(100% + 2px);
              "
              v-html="dictionary.generateSVG(1001)"
            ></div>
            <ol class="options">
              <li class="option" v-for="group of examInstance.groups" :key="group">{{ group }}</li>
            </ol>
          </div>
        </div>
        <div style="width: 100%; display: flex; flex-direction: column; align-items: end">
          <div v-html="barcode" style="width: 240px"></div>
          <div>{{ student?.firstName + ' ' + student?.lastName }}</div>
          <div>{{ student?.studentId }}</div>
        </div>
      </div>

      <hr style="margin: 8px 0 32px 0" />

      <div
        v-for="(question, questionIndex) of questions"
        :key="question.id"
        style="position: relative; width: 100%; margin-top: 28px; break-inside: avoid"
      >
        <div
          style="width: 24px; height: 24px; position: absolute; bottom: calc(100% + 3px)"
          :style="{
            left: questionIndex % 2 === 0 ? 24 + 'px' : 'none',
            right: questionIndex % 2 === 1 ? 0 + 'px' : 'none'
          }"
          v-html="dictionary.generateSVG(questionIndex)"
        ></div>
        <div
          style="width: 24px; height: 24px; position: absolute; top: calc(100% + 3px)"
          :style="{
            left: (questionIndex + 1) % 2 === 0 ? 24 + 'px' : 'none',
            right: (questionIndex + 1) % 2 === 1 ? 0 + 'px' : 'none'
          }"
          v-html="dictionary.generateSVG(questionIndex + 1)"
        ></div>
        <div style="display: flex; width: 100%; padding-right: 24px">
          <div style="margin-right: 16px; position: relative">
            <span style="display: inline-block; width: 4ch">{{
              questionIndex + 1 + '.&nbsp;'
            }}</span>
          </div>
          <component
            style="width: 100%; flex-grow: 1; position: relative"
            :is="'question-' + question.type + '-sheet-module'"
            :question="
              JSON.stringify({
                ...question,
                questionObject:
                  exam?.configs?.questions?.[question.id]?.questionObject ||
                  question.questionObject,
                answerObject:
                  exam?.configs?.questions?.[question.id]?.answerObject || question.answerObject
              })
            "
          >
            Unable to load question sheet module!
          </component>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BwipJs from 'bwip-js/generic';
import AR from '../assets/src/aruco';
import { computed } from 'vue';

interface Props {
  exam: {
    tags: string[];
    id: string;
    questionIds: string[];
    configs: Record<string, any>;
    name?: string | null | undefined;
    subjectIds?: string[] | null | undefined;
  };
  examInstance: {
    examId: string;
    generated: string;
    groups: string[];
    id: string;
    seed: number;
    studentIds: string[];
  };
  questions: {
    id: string;
    text: string;
    type: string;
    questionObject: Record<string, any>;
    answerObject: Record<string, any>;
    tags: string[];
  }[];
  student: {
    id: string;
    tags: string[];
    firstName: string;
    lastName: string;
    studentId?: string | null | undefined;
  };
}

const props = defineProps<Props>();

const barcode = computed(() => {
  return BwipJs.toSVG({
    bcid: 'pdf417compact', // Barcode type
    text: JSON.stringify({
      studentId: props.student.id,
      examId: props.exam.id,
      examInstanceId: props.examInstance.id
    }), // Text to encode
    //@ts-ignore
    columns: 7,
    eclevel: 3
  });
});

const dictionary = new AR.Dictionary('ARUCO');
</script>

<style>
.examSheet {
  width: 100%;
  padding-bottom: 19px;
}

.group {
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}
.options {
  font-weight: 400;
  font-size: 16px;
  margin: 0;
  margin-left: 30px;

  display: flex;
  gap: 8px;

  position: relative;

  padding-left: 0;

  counter-reset: opt;
  list-style-type: none;
}
.option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-wrap: pretty;
  text-align: center;
}
.option::before {
  counter-increment: opt;
  /* content: counter(opt, upper-alpha); */
  content: '';

  display: inline-block;
  aspect-ratio: 1/1;
  height: 1lh;
  padding: 4px;
  border: 1px solid black;
  border-radius: 50%;
  line-height: 1rem;
  text-align: center;

  box-sizing: content-box;
}
</style>
