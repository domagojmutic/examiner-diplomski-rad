<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">Detach Exam</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        You are about to remove exam from subject.
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Ok"
          color="primary"
          @click="onOkClick"
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
import { useDialogPluginComponent } from 'quasar';
import { Exam } from '../models';
import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { deleteSubjectExam } from 'src/api/subjects';

type Props = {
  subjectId: string;
  exam: Exam;
};

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: examDetach } = useMutation({
  mutationFn: (data: { id: string; examId: string }) =>
    deleteSubjectExam(data.id, data.examId),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: ['exams', props.subjectId],
    });
  },
});

function onOkClick() {
  examDetach({
    id: props.subjectId,
    examId: props.exam.id,
  });
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
