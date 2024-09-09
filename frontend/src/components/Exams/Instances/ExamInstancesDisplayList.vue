<template>
  <div class="col q-gutter-md q-ma-md" style="min-width: 360px">
    <div class="row q-ml-none justify-between">
      <span class="text-blue-grey-5">Exam Instances</span>
      <q-btn
        color="positive"
        icon="add"
        class="q-ml-sm"
        round
        size="sm"
        dense
        @click="openNewExamInstanceDialog()"
      >
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
          New Exam Instance
        </q-tooltip>
      </q-btn>
    </div>
    <q-card
      v-for="examInstance of examInstances"
      :key="examInstance.id"
      class="q-pa-md"
    >
      <div class="absolute fixed-top-right">
        <q-btn-group>
          <q-btn
            icon="sym_o_open_in_full"
            size="sm"
            dense
            :href="
              '#/exams/' +
              examInstance.examId +
              '/examInstances/' +
              examInstance.id
            "
          >
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Open exam instance
            </q-tooltip>
          </q-btn>
        </q-btn-group>
      </div>

      <div style="font-size: 0.9em">
        <div>
          <span style="font-weight: 450">Generated:&nbsp;</span>
          {{ new Date(examInstance.generated).toLocaleDateString('hr') }}
        </div>
        <div>
          <span style="font-weight: 450">Groups:&nbsp;</span>
          <span>{{ examInstance.groups.join(', ') }}</span>
        </div>
        <div>
          <span style="font-weight: 450">Students:&nbsp;</span>
          <span>{{ examInstance.studentIds.join(', ') }}</span>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { toRaw } from 'vue';
import { Exam, ExamInstance } from 'src/components/models';
import ExamInstancesNewDialog from './ExamInstancesNewDialog.vue';

interface Props {
  exam: Exam;
  examInstances: ExamInstance[];
}

defineOptions({
  name: 'ExamInstanceDisplayList',
});

const props = defineProps<Props>();

const $q = useQuasar();

// function openNewExamDialog() {
//   $q.dialog({
//     component: ExamsNewDialog,
//     componentProps: {
//       subjectId: props.subjectId,
//     },
//   });
// }
// function openEditExamDialog(exam: Exam) {
//   $q.dialog({
//     component: ExamsEditDialog,
//     componentProps: {
//       exam: toRaw(exam),
//     },
//   });
// }
// function openDetachDialog(exam: Exam) {
//   $q.dialog({
//     component: ExamsDetachDialog,
//     componentProps: {
//       subjectId: props.subjectId,
//       exam: toRaw(exam),
//     },
//   });
// }
function openNewExamInstanceDialog() {
  $q.dialog({
    component: ExamInstancesNewDialog,
    componentProps: {
      exam: toRaw(props.exam),
    },
  });
}
</script>
