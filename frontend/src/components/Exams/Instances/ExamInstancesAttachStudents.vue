<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">Attach Students</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-item class="q-pt-none">
          <q-item-section>
            <StudentsSelectList
              :students="studentsData"
              :selectedStudentIds="studentIds"
              :overwriteStudents="false"
              @update="
                (id, add) => {
                  if (add) studentIds.push(id);
                  else studentIds = studentIds.filter((qid) => qid !== id);
                }
              "
              @updateAll="
                (selectedStudents) => {
                  studentIds = [];
                  Object.entries(selectedStudents).forEach(([key, val]) => {
                    if (val) studentIds.push(key);
                  });
                }
              "
            />
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Apply"
          color="primary"
          @click="onApplyClick"
          v-close-popup
        />
        <q-btn
          flat
          label="Cancel"
          color="negative"
          @click="onCancelClick"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useQueryClient, useMutation, useQuery } from '@tanstack/vue-query';
import { getStudents } from 'src/api/students';
import StudentsSelectList from '../../Students/StudentsSelectList.vue';
import {
  getExamInstanceStudents,
  putExamInstanceStudents,
} from 'src/api/examInstances';

interface Props {
  examId: string;
  examInstanceId: string;
}

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: examInstanceUpdate } = useMutation({
  mutationFn: (data: { students: string[] }) =>
    putExamInstanceStudents(props.examId, props.examInstanceId, data.students),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: ['students', props.examInstanceId],
    });
  },
});

const { data: examInstanceStudentsResponse } = useQuery({
  queryFn: () => getExamInstanceStudents(props.examId, props.examInstanceId),
  queryKey: ['students', props.examInstanceId],
});

const examInstanceStudentsData = computed(() => {
  const newData = examInstanceStudentsResponse.value;
  return newData ? newData.data : undefined;
});

const { data: studentsResponse } = useQuery({
  queryFn: () => getStudents(),
  queryKey: ['students'],
});

const studentsData = computed(() => {
  const newData = studentsResponse.value;
  return newData ? newData.data : [];
});

const studentIds = ref([
  ...(examInstanceStudentsData.value?.map((student) => student.id) || []),
]);

function onApplyClick() {
  examInstanceUpdate({
    students: studentIds.value,
  });
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
