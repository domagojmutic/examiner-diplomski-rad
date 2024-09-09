<template>
  <q-item class="row">
    <q-checkbox
      v-model="selectAll"
      size="sm"
      label=""
      @update:model-value="
        (val) => {
          filteredStudents.forEach((student) => {
            selected[student.id] = val;
          });
          $emit('updateAll', selected);
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
    v-for="student of filteredStudents"
    :key="student.id"
    class="q-py-none"
  >
    <q-item-section>
      <q-checkbox
        v-model="selected[student.id]"
        size="sm"
        :label="student.firstName + ' ' + student.lastName"
        @update:model-value="(val) => $emit('update', student.id, val)"
      />
    </q-item-section>
    <q-item-section>
      <TagsDisplay :tags="student.tags" class="flex justify-end" />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { Student } from '../models';
import { ref, watch } from 'vue';
import TagsDisplay from '../Common/Tags/TagsDisplay.vue';

interface Props {
  students: Student[];
  selectedStudentIds: string[];
  overwriteStudents: boolean;
}

const props = defineProps<Props>();
const $emit = defineEmits<{
  update: [studentId: string, selected: boolean];
  updateAll: [selected: { [key: string]: boolean }];
}>();

const filteredStudents = ref(props.students);
const selected = ref<{ [key: string]: boolean }>({});
const selectAll = ref(
  filteredStudents.value.findIndex(
    (student) => !!selected.value[student.id] === false
  ) === -1
    ? true
    : false
);
const search = ref('');

watch(search, () => {
  filteredStudents.value = props.students.filter((student) => {
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
  props,
  () => {
    filteredStudents.value = props.students;
    filteredStudents.value.forEach((student) => {
      selected.value[student.id] = props.selectedStudentIds.includes(
        student.id
      );
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
</script>
