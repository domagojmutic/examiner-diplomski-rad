<template>
  <q-page class="column items-center justify-evenly">
    <q-list style="width: 90%">
      <SubjectsOverviewList />
      <q-separator />
      <StudentsOverviewList />
      <q-separator />
      <ExamsOverviewList />
      <q-separator />
      <QuestionsOverviewList />
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import ExamsOverviewList from 'src/components/Exams/ExamsOverviewList.vue';
import QuestionsOverviewList from 'src/components/Questions/QuestionsOverviewList.vue';
import StudentsOverviewList from 'src/components/Students/StudentsOverviewList.vue';
import SubjectsOverviewList from 'src/components/Subjects/SubjectsOverviewList.vue';

defineOptions({
  name: 'IndexPage',
});
</script>
