<template>
  <SheetDisplayWrapper
    :examId="$route.params.examId as string"
    :examInstanceId="$route.params.instanceId as string"
    :studentId="$route.params.studentId as string"
  />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import SheetDisplayWrapper from '@/components/SheetDisplayWrapper.vue';

const $route = useRoute();
</script>
