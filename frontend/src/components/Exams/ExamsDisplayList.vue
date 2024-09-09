<template>
  <div class="col q-gutter-md q-ma-md" style="min-width: 360px">
    <div class="row q-ml-none justify-between">
      <span class="text-blue-grey-5">Exams</span>
      <q-btn
        color="positive"
        icon="add"
        class="q-ml-sm"
        round
        size="sm"
        dense
        @click="openNewExamDialog()"
      >
        <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
          New Exam
        </q-tooltip>
      </q-btn>
    </div>
    <q-card v-for="exam of exams" :key="exam.id" class="q-pa-md">
      <div class="absolute fixed-top-right">
        <q-btn-group>
          <q-btn
            icon="note_add"
            size="sm"
            dense
            @click="openNewExamInstanceDialog(exam)"
          >
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Create instance
            </q-tooltip>
          </q-btn>
          <q-btn icon="edit" size="sm" dense @click="openEditExamDialog(exam)">
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Edit Exam
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="sym_o_attach_file_off"
            size="sm"
            dense
            @click="openDetachDialog(exam)"
          >
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Remove exam from subject
            </q-tooltip>
          </q-btn>
        </q-btn-group>
      </div>

      <div>
        <div class="text-weight-medium">
          {{ exam.name || `Exam ${exam.id}` }}
        </div>
        <div style="font-size: 0.9em">
          <div>
            <span style="font-weight: 450">Tags:</span>
            <TagsDisplay :tags="exam.tags" />
          </div>
          <div>
            <span style="font-weight: 450">Number of questions:&nbsp;</span>
            <span>{{ exam.questionIds.length }}</span>
          </div>
          <div>
            <span style="font-weight: 450">Overwritten questions:&nbsp;</span>
            <span>{{
              Object.keys(
                exam.configs.questions ? exam.configs.questions : {}
              ).join(', ')
            }}</span>
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Exam } from '../models';
import ExamsNewDialog from './ExamsNewDialog.vue';
import ExamsEditDialog from './ExamsEditDialog.vue';
import ExamsDetachDialog from './ExamsDetachDialog.vue';
import TagsDisplay from '../Common/Tags/TagsDisplay.vue';
import { toRaw } from 'vue';
import ExamInstancesNewDialog from './Instances/ExamInstancesNewDialog.vue';

interface Props {
  subjectId?: string;
  exams: Exam[];
}

defineOptions({
  name: 'ExamDisplayList',
});

const props = defineProps<Props>();

const $q = useQuasar();

function openNewExamDialog() {
  $q.dialog({
    component: ExamsNewDialog,
    componentProps: {
      subjectId: props.subjectId,
    },
  });
}
function openEditExamDialog(exam: Exam) {
  $q.dialog({
    component: ExamsEditDialog,
    componentProps: {
      exam: toRaw(exam),
    },
  });
}
function openDetachDialog(exam: Exam) {
  $q.dialog({
    component: ExamsDetachDialog,
    componentProps: {
      subjectId: props.subjectId,
      exam: toRaw(exam),
    },
  });
}
function openNewExamInstanceDialog(exam: Exam) {
  $q.dialog({
    component: ExamInstancesNewDialog,
    componentProps: {
      exam: toRaw(exam),
    },
  });
}
</script>
