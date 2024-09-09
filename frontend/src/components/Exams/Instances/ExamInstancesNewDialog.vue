<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">New Exam Instances</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-item>
          <q-item-section>
            <q-input
              outlined
              v-model="tempGroup"
              label="Group name"
              @keydown.enter.prevent="
                groups.push(tempGroup);
                tempGroup = '';
              "
            >
              <template v-slot:append>
                <q-btn
                  icon="add"
                  dense
                  round
                  flat
                  @click="
                    groups.push(tempGroup);
                    tempGroup = '';
                  "
                />
              </template>
            </q-input>
          </q-item-section>
        </q-item>
        <div class="text-subtitle1">Groups</div>
        <q-item>
          <q-item-section>
            <li v-for="group of groups" :key="group">
              {{ group }}
            </li>
          </q-item-section>
        </q-item>
        <div class="text-subtitle1">Students</div>

        <q-item class="row">
          <q-checkbox
            v-model="selectAll"
            size="sm"
            label=""
            @update:model-value="
              (val) => {
                filteredStudents.forEach((question) => {
                  selected[question.id] = val;
                });
              }
            "
          />
          <q-space />

          <q-input
            borderless
            v-model="search"
            input-class="text-right"
            class="q-ml-md"
            placeholder="Search"
          >
            <template v-slot:append>
              <q-icon v-if="search === ''" name="search" />
              <q-icon
                v-else
                name="clear"
                class="cursor-pointer"
                @click="search = ''"
              />
            </template>
          </q-input>
        </q-item>
        <q-item
          v-for="student of studentsData"
          :key="student.id"
          class="q-py-none"
        >
          <q-item-section>
            <q-checkbox
              v-model="selected[student.id]"
              size="sm"
              :label="student.firstName + ' ' + student.lastName"
            />
          </q-item-section>
          <q-item-section>
            <TagsDisplay :tags="student.tags" class="flex justify-end" />
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Create"
          color="primary"
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
import { computed, ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { getStudents } from 'src/api/students';
import TagsDisplay from 'src/components/Common/Tags/TagsDisplay.vue';
import { watch } from 'vue';
import { Exam, ExamInstance } from 'src/components/models';
import { postExamInstance } from 'src/api/examInstances';

interface Props {
  exam: Exam;
}

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: examInstanceCreate } = useMutation({
  mutationFn: (data: { examInstance: Omit<ExamInstance, 'id' | 'seed'> }) =>
    postExamInstance(props.exam.id, data.examInstance),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: ['examInstances', props.exam.id],
    });
  },
});

const { data: studentsResponse } = useQuery({
  queryFn: () => getStudents(),
  queryKey: ['questions'],
});

const studentsData = computed(() => {
  const newData = studentsResponse.value;
  return newData ? newData.data : [];
});

const filteredStudents = ref(studentsData.value);
const selected = ref<{ [key: string]: boolean }>({});
const selectAll = ref(
  studentsData.value.findIndex(
    (student) => !!selected.value[student.id] === false
  ) === -1
    ? true
    : false
);
const search = ref('');
const tempGroup = ref('');
const groups = ref<string[]>([]);

watch(search, () => {
  filteredStudents.value = studentsData.value.filter((student) => {
    return (
      (student.firstName + ' ' + student.lastName)
        .toLowerCase()
        .includes(search.value.toLowerCase()) ||
      student.tags.join(',').toLowerCase().includes(search.value.toLowerCase())
    );
  });
});

watch(selected.value, () => {
  if (
    filteredStudents.value.findIndex(
      (student) => !!selected.value[student.id] === false
    ) === -1
  )
    selectAll.value = true;
  else selectAll.value = false;
});

watch(filteredStudents.value, () => {
  if (
    filteredStudents.value.findIndex(
      (student) => !!selected.value[student.id] === false
    ) === -1
  )
    selectAll.value = true;
  else selectAll.value = false;
});

watch(
  () => studentsData.value,
  () => {
    filteredStudents.value = [...studentsData.value];
    filteredStudents.value.forEach((student) => {
      selected.value[student.id] = selected.value[student.id] || false;
    });

    if (
      filteredStudents.value.findIndex(
        (student) => !!selected.value[student.id] === false
      ) === -1
    )
      selectAll.value = true;
    else selectAll.value = false;
  },
  { immediate: true }
);

function onCreateClick() {
  examInstanceCreate({
    examInstance: {
      examId: props.exam.id,
      generated: new Date(),
      groups: groups.value,
      studentIds: Object.entries(selected.value)
        .map(([key, val]) => (val ? key : null))
        .filter((studentId) => studentId !== null) as string[],
    },
  });
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
