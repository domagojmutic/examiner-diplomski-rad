<template>
  <div v-for="student of students" :key="student.id">
    <SheetDisplayWrapper
      :examId="$route.params.examId as string"
      :examInstanceId="$route.params.instanceId as string"
      :studentId="student.id"
    />
    <div style="break-after: page"></div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import SheetDisplayWrapper from '@/components/SheetDisplayWrapper.vue';
import { ref } from 'vue';

const $route = useRoute();

const students = ref<
  {
    id: string;
    tags: string[];
    firstName: string;
    lastName: string;
    studentId?: string | null | undefined;
  }[]
>();

fetch('/api/exams/' + $route.params.examId + '/instances/' + $route.params.instanceId + '/students')
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
      }[];
    }) => {
      students.value = body.data;
    }
  );
</script>
