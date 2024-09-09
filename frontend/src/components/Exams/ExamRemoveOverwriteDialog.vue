<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-card-section>
        <div class="text-h6">Warning</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        You are about to delete overwritten configs for question '{{
          questionId
        }}' in exam '{{ examId }}'
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="OK"
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

<script setup lang="ts" generic="T extends { [key: string]: unknown }">
import { useDialogPluginComponent } from 'quasar';
import { getExam, putExam } from 'src/api/exams';
import { Exam } from '../models';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, toRaw } from 'vue';

interface Props {
  examId: string;
  questionId: string;
}

const props = defineProps<Props>();
defineEmits([...useDialogPluginComponent.emits]);

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent<T>();

const { mutate: examUpdate } = useMutation({
  mutationFn: (data: { exam: Exam }) => putExam(props.examId, data.exam),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: ['exam', props.examId],
    });
  },
});

const { data: examResponse } = useQuery({
  queryFn: () => getExam(props.examId),
  queryKey: ['exam', props.examId],
});

const examData = computed(() => {
  const newData = structuredClone(toRaw(examResponse.value));
  delete newData?.data?.configs?.questions?.[props.questionId];
  return newData ? toRaw(newData).data : undefined;
});

function onOkClick() {
  if (!examData.value) throw Error('Missing exam object');
  examUpdate({
    exam: {
      ...examData.value,
    },
  });
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
