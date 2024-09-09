<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h6">New Student</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-item>
          <q-item-section>
            <q-input
              outlined
              v-model="firstName"
              label="First name"
              :rules="[(val) => !!val || '* required']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              outlined
              v-model="lastName"
              label="Last name"
              :rules="[(val) => !!val || '* required']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-input
              outlined
              v-model="studentId"
              label="Student school id"
              :rules="[(val) => !!val || '* required']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <TagsManager
              :type="'students'"
              :model="tags"
              :borderless="false"
              placeholder="Student Tags"
              @update="(val) => (tags = val)"
            />
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Create"
          color="primary"
          :disable="!isValid"
          @click="onCreateClick"
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
import { ref, computed } from 'vue';
import TagsManager from '../Common/Tags/TagsManager.vue';
import { useDialogPluginComponent } from 'quasar';
import { postStudent } from 'src/api/students';
import { Student } from '../models';
import { useQueryClient, useMutation } from '@tanstack/vue-query';
import { postExamInstanceStudents } from 'src/api/examInstances';

interface Props {
  examId?: string;
  examInstanceId?: string;
}

const props = defineProps<Props>();

defineEmits([...useDialogPluginComponent.emits]);

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: studentCreate } = useMutation({
  mutationFn: (data: { student: Omit<Student, 'id'> }) =>
    postStudent(data.student),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({ queryKey: ['students'] });
  },
});

const { mutate: examInstanceStudentCreate } = useMutation({
  mutationFn: (data: { student: Omit<Student, 'id'> }) => {
    if (props.examInstanceId && props.examId)
      return postExamInstanceStudents(
        props.examId,
        props.examInstanceId,
        data.student
      );
    throw Error('Expected examInstanceId');
  },
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({ queryKey: ['questions', props.examId] });
  },
});

let firstName = ref('');
let lastName = ref('');
let studentId = ref<string | null>(null);
let tags = ref<string[]>([]);

const isValid = computed(() => {
  if (
    firstName.value != undefined &&
    firstName.value !== '' &&
    lastName.value != undefined &&
    lastName.value !== ''
  )
    return true;
  else return false;
});

function onCreateClick() {
  props.examId && props.examInstanceId
    ? examInstanceStudentCreate({
        student: {
          firstName: firstName.value,
          lastName: lastName.value,
          studentId: studentId.value,
          tags: tags.value,
        },
      })
    : studentCreate({
        student: {
          firstName: firstName.value,
          lastName: lastName.value,
          studentId: studentId.value,
          tags: tags.value,
        },
      });
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
