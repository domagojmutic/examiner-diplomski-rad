<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">Detach Question</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        You are about to remove question from {{ props.type }}.
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
import { Question } from '../models';
import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { deleteSubjectQuestion } from 'src/api/subjects';
import { deleteExamQuestion } from 'src/api/exams';

type Props =
  | {
      subjectId: string;
      examId: undefined;
      question: Question;
      type: 'subject';
    }
  | {
      subjectId: undefined;
      examId: string;
      question: Question;
      type: 'exam';
    };

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: questionDetach } = useMutation({
  mutationFn: (data: { id: string; questionId: string }) =>
    props.type === 'subject'
      ? deleteSubjectQuestion(data.id, data.questionId)
      : deleteExamQuestion(data.id, data.questionId),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: [
        'questions',
        props.type === 'subject' ? props.subjectId : props.examId,
      ],
    });
  },
});

function onOkClick() {
  questionDetach({
    id: props.type === 'subject' ? props.subjectId : props.examId,
    questionId: props.question.id,
  });
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
