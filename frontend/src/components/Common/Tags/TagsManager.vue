<template>
  <q-select
    class="q-ma-none"
    use-chips
    hide-dropdown-icon
    :label="placeholder"
    use-input
    v-model="localModel"
    :options="filterOptions"
    input-debounce="0"
    multiple
    option-value="value"
    option-label="value"
    map-options
    emit-value
    :autofocus="false"
    :borderless="borderless"
    :outlined="!borderless"
    @update:model-value="$emit('update', localModel)"
    @new-value="
      (val, done) => {
        done(val, 'add-unique');
        queryClient.setQueryData([type + 'Tags'],
          (old: {'data': string[]}) => {
            if(!old.data.includes(val))
              return {...old, data: [...old.data, val]}
            else return old
          });
      }
    "
    @filter="filterFn"
  >
    <template v-slot:option="scope">
      <q-item
        v-bind="scope.itemProps"
        :disable="scope.opt.type === 'group'"
        dense
      >
        <q-item-section>
          <q-item-label>{{ scope.opt.value }}</q-item-label>
        </q-item-section>
      </q-item>
    </template>
    <template v-slot:no-option>
      <q-item>
        <q-item-section class="text-grey"> No results </q-item-section>
      </q-item>
    </template>
  </q-select>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  getExamTags,
  getQuestionTags,
  getStudentTags,
  getSubjectTags,
} from 'src/api/tags';

interface Props {
  type: 'subjects' | 'questions' | 'exams' | 'students';
  model: string[];
  borderless: boolean;
  placeholder: string;
}

const props = withDefaults(defineProps<Props>(), {
  borderless: true,
  placeholder: '',
});
defineEmits<{
  update: [tags: string[]];
}>();

const queryClient = useQueryClient();

const { data: subjectTagsResponse } = useQuery({
  queryFn: () => getSubjectTags(),
  queryKey: ['subjectsTags'],
});

const { data: questionTagsResponse } = useQuery({
  queryFn: () => getQuestionTags(),
  queryKey: ['questionsTags'],
});

const { data: examTagsResponse } = useQuery({
  queryFn: () => getExamTags(),
  queryKey: ['examsTags'],
});

const { data: studentTagsResponse } = useQuery({
  queryFn: () => getStudentTags(),
  queryKey: ['studentsTags'],
});

// const options = ref<{ type: 'group' | 'item'; value: string }[] | []>([]);
const filterOptions = ref<{ type: 'group' | 'item'; value: string }[] | []>([]);
const localModel = ref<string[]>(props.model);

watch(props.model, (newData) => {
  localModel.value = newData;
});

const options = computed<
  {
    type: 'group' | 'item';
    value: string;
  }[]
>(() => {
  const newSubjects = subjectTagsResponse.value || { data: [] };
  const newQuestions = questionTagsResponse.value || { data: [] };
  const newExams = examTagsResponse.value || { data: [] };
  const newStudents = studentTagsResponse.value || { data: [] };
  return [
    { type: 'group', value: 'Subjects' },
    ...newSubjects.data.map<{
      type: 'item';
      value: string;
    }>((v) => {
      return { type: 'item', value: v };
    }),
    { type: 'group', value: 'Questions' },
    ...newQuestions.data.map<{
      type: 'item';
      value: string;
    }>((v) => {
      return { type: 'item', value: v };
    }),
    { type: 'group', value: 'Exams' },
    ...newExams.data.map<{
      type: 'item';
      value: string;
    }>((v) => {
      return { type: 'item', value: v };
    }),
    { type: 'group', value: 'Students' },
    ...newStudents.data.map<{
      type: 'item';
      value: string;
    }>((v) => {
      return { type: 'item', value: v };
    }),
  ];
});

function filterFn(val: string, update: (callbackFn: () => void) => void) {
  update(() => {
    if (val === '') {
      filterOptions.value = options.value;
    } else {
      const needle = val.toLowerCase();
      filterOptions.value = options.value.filter(
        (v) => v.value.toLowerCase().indexOf(needle) > -1 || v.type === 'group'
      );
    }
  });
}
</script>
