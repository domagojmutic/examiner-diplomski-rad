<template>
  <div class="col q-gutter-md q-ma-md" style="min-width: 360px">
    <div class="row q-ml-none justify-between">
      <span class="text-blue-grey-5">Students</span>
      <div style="display: flex">
        <q-btn
          v-if="examId && examInstanceId"
          icon="sym_o_upload_file"
          class="q-ml-sm"
          round
          size="sm"
          dense
          @click="openUploadSheetsDialog()"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
            Upload exam sheets
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="examId && examInstanceId"
          icon="sym_o_file_save"
          class="q-ml-sm"
          round
          size="sm"
          dense
          @click="downloadSheetsPdf()"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
            Download all exam sheets
          </q-tooltip>
        </q-btn>
        <q-btn
          v-if="examId && examInstanceId"
          color="primary"
          icon="sym_o_attach_file_add"
          class="q-ml-sm"
          round
          size="sm"
          dense
          @click="openExistingStudentsDialog()"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
            Manage student connections
          </q-tooltip>
        </q-btn>
        <q-btn
          color="positive"
          icon="add"
          class="q-ml-sm"
          round
          size="sm"
          dense
          @click="openNewStudentDialog()"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
            New Student
          </q-tooltip>
        </q-btn>
      </div>
    </div>
    <q-card
      v-for="(student, index) of students"
      :key="student.id"
      class="q-pa-sm"
    >
      <div class="absolute fixed-top-right">
        <q-btn-group>
          <q-btn
            v-if="examId && examInstanceId"
            icon="sym_o_description"
            size="sm"
            dense
            :href="`#/exams/${examId}/examInstances/${examInstanceId}/students/${student.id}`"
          >
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Open results
            </q-tooltip>
          </q-btn>
          <q-btn
            v-if="examId && examInstanceId"
            icon="sym_o_file_save"
            size="sm"
            dense
            @click="downloadSheetPdf(student)"
          >
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Download exam sheet
            </q-tooltip>
          </q-btn>
          <q-btn
            icon="edit"
            size="sm"
            dense
            @click="openEditStudentDialog(student)"
          >
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Edit Student
            </q-tooltip>
          </q-btn>
          <q-btn
            size="sm"
            flat
            dense
            @click="expanded[index] = !expanded[index]"
          >
            <q-icon
              name="keyboard_arrow_down"
              style="transition: all 250ms"
              :style="{
                transform: expanded[index] ? 'rotate(180deg)' : 'rotate(0deg)',
              }"
            />
            <q-tooltip
              anchor="bottom middle"
              self="top middle"
              :offset="[0, 5]"
            >
              Show Details
            </q-tooltip>
          </q-btn>
        </q-btn-group>
      </div>

      <div class="absolute fixed-bottom-right"></div>

      <div>
        <div class="text-weight-medium">
          {{ student.firstName + ' ' + student.lastName }}
        </div>
        <div v-if="expanded[index]" style="font-size: 0.9em">
          <div>
            <span style="font-weight: 450">Student school id:&nbsp;</span>
            <span>{{ student.studentId }}</span>
          </div>
          <div>
            <span style="font-weight: 450">Tags:</span>
            <TagsDisplay :tags="student.tags" />
          </div>
        </div>
      </div>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { Student } from '../models';
import StudentsNewDialog from './StudentsNewDialog.vue';
import StudentsEditDialog from './StudentsEditDialog.vue';
import TagsDisplay from '../Common/Tags/TagsDisplay.vue';
import { toRaw } from 'vue';
import { ref } from 'vue';
import {
  getExamInstanceStudentPDF,
  getExamInstanceStudentsPDF,
} from 'src/api/examInstances';
import ExamInstancesAttachStudents from '../Exams/Instances/ExamInstancesAttachStudents.vue';
import ExamInstancesSheetUploadDialog from '../Exams/Instances/ExamInstancesSheetUploadDialog.vue';

interface Props {
  students: Student[];
  examInstanceId?: string;
  examId?: string;
}

defineOptions({
  name: 'StudentDisplayList',
});

const props = defineProps<Props>();

const $q = useQuasar();

const expanded = ref<boolean[]>([]);

function downloadSheetPdf(student: Student) {
  if (props.examId && props.examInstanceId)
    getExamInstanceStudentPDF(props.examId, props.examInstanceId, student.id);
}
function downloadSheetsPdf() {
  if (props.examId && props.examInstanceId)
    getExamInstanceStudentsPDF(props.examId, props.examInstanceId);
}

function openNewStudentDialog() {
  $q.dialog({
    component: StudentsNewDialog,
    componentProps: {},
  });
}
function openEditStudentDialog(student: Student) {
  $q.dialog({
    component: StudentsEditDialog,
    componentProps: {
      student: toRaw(student),
    },
  });
}
function openExistingStudentsDialog() {
  $q.dialog({
    component: ExamInstancesAttachStudents,
    componentProps: {
      examId: props.examId,
      examInstanceId: props.examInstanceId,
    },
  });
}
function openUploadSheetsDialog() {
  $q.dialog({
    component: ExamInstancesSheetUploadDialog,
    componentProps: {},
  });
}
</script>
