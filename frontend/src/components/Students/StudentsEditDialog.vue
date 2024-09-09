<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">Edit Student</div>
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
          label="Apply"
          color="primary"
          :disable="!isValid"
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
import { ref, computed, toRaw } from 'vue';
import TagsManager from '../Common/Tags/TagsManager.vue';
import { useDialogPluginComponent } from 'quasar';
import { putStudent } from 'src/api/students';
import { Student } from '../models';
import { useQueryClient, useMutation } from '@tanstack/vue-query';

interface Props {
  student: Student;
}

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: studentUpdate } = useMutation({
  mutationFn: (data: { student: Student }) =>
    putStudent(props.student.id, data.student),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: ['students'],
    });
  },
});

let firstName = ref(props.student.firstName);
let lastName = ref(props.student.lastName);
let studentId = ref<string | null>(props.student.studentId || null);
let tags = ref<string[]>(structuredClone(toRaw(props.student.tags)) || []);

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

function onApplyClick() {
  studentUpdate({
    student: {
      id: props.student.id,
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
