<template>
  <q-expansion-item icon="perm_identity">
    <template v-slot:header>
      <div style="width: 100%">
        <span class="text-h5">Exams</span>
      </div>
    </template>
    <q-table
      :grid="displayStyle === 'grid'"
      row-key="id"
      binary-state-sort
      dense
      flat
      wrap-cells
      :columns="columns"
      :rows="examsData || []"
      :pagination="{ rowsPerPage: 0, sortBy: 'name' }"
      :rows-per-page-options="[0, 10, 20, 30, 40, 50]"
      :loading="loading"
      :filter="filter"
    >
      <template v-slot:top-right>
        <q-input
          outlined
          dense
          debounce="0"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
        <div class="q-ml-sm">
          <q-btn-toggle
            v-model="displayStyle"
            toggle-color="primary"
            outline
            dense
            @update:model-value="
              $q.localStorage.setItem(
                'configs_ui_examsDisplayMode',
                displayStyle
              )
            "
            :options="[
              { icon: 'grid_view', value: 'grid', attrs: { class: 'q-pa-sm' } },
              {
                icon: 'table_chart',
                value: 'table',
                attrs: { class: 'q-pa-sm' },
              },
            ]"
          />
        </div>
        <q-btn
          color="positive"
          icon="add"
          class="q-ml-sm"
          round
          size="md"
          @click="openNewExamDialog"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
            New Exam
          </q-tooltip>
        </q-btn>
      </template>
      <template v-slot:item="props">
        <div
          :href="`#/exams/${props.row.id}`"
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4"
        >
          <q-card
            bordered
            class="shadow-1"
            style="cursor: pointer"
            @click="
              () => {
                $router.push(`/exams/${props.row.id}`);
              }
            "
          >
            <q-card-section class="text-center q-py-lg">
              <strong style="font-size: 1.1em">
                {{ props.row.name || 'Exam ' + props.row.id }}
              </strong>
              <div class="absolute-top-right">
                <q-btn
                  flat
                  dense
                  icon="tag"
                  size="sm"
                  color="positive"
                  @click.stop="openTagsDialog(props.row.id, props.row.tags)"
                >
                  <q-tooltip
                    anchor="center right"
                    self="center left"
                    :offset="[5, 5]"
                  >
                    Tag Manager
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  icon="edit"
                  size="sm"
                  color="warning"
                  @click.stop="openEditDialog(props.row)"
                >
                  <q-tooltip
                    anchor="center right"
                    self="center left"
                    :offset="[5, 5]"
                  >
                    Edit
                  </q-tooltip>
                </q-btn>
                <q-btn
                  flat
                  dense
                  icon="delete"
                  size="sm"
                  color="negative"
                  @click.stop="openDeleteDialog(props.row)"
                >
                  <q-tooltip
                    anchor="center right"
                    self="center left"
                    :offset="[5, 5]"
                  >
                    Delete
                  </q-tooltip>
                </q-btn>
              </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="flex flex-center column">
              <div class="text-weight-light text-blue-grey-7 text-caption">
                Subjects
              </div>
              <div>{{ props.row.subjectIds }}</div>
            </q-card-section>
            <q-card-section class="flex flex-center column">
              <div class="text-weight-light text-blue-grey-7 text-caption">
                Number of questions
              </div>
              <div>{{ props.row.questionIds.length }}</div>
            </q-card-section>
            <q-card-section class="flex flex-center column">
              <div class="text-weight-light text-blue-grey-7 text-caption">
                Number of overwritten questions
              </div>
              <div>
                {{
                  props.row.configs && props.row.configs.questions
                    ? Object.keys(props.row.configs.questions).length
                    : 0
                }}
              </div>
            </q-card-section>
            <q-card-section class="flex flex-center column q-pt-none">
              <div class="text-weight-light text-blue-grey-7 text-caption">
                Tags
              </div>
              <TagsDisplay :tags="props.row.tags" />
            </q-card-section>
          </q-card>
        </div>
      </template>
      <template v-slot:body="props">
        <q-tr
          :props="props"
          style="cursor: pointer"
          @click="
            () => {
              $router.push(`/exams/${props.row.id}`);
            }
          "
        >
          <q-td key="name" :props="props">
            {{ props.row.name || 'Exam ' + props.row.id }}
          </q-td>
          <q-td key="lastName" :props="props">
            {{ props.row.lastName }}
          </q-td>
          <q-td key="subjects" :props="props">
            {{ props.row.subjectIds }}
          </q-td>
          <q-td key="questions" :props="props">
            {{ props.row.questionIds.length }}
          </q-td>
          <q-td key="overwrittenQuestions" :props="props">
            {{
              props.row.configs && props.row.configs.questions
                ? Object.keys(props.row.configs.questions).length
                : 0
            }}
          </q-td>
          <q-td key="tags" :props="props" style="max-width: 30%">
            <TagsDisplay :tags="props.row.tags" />
          </q-td>
          <q-td key="action" :props="props">
            <div class="flex justify-end no-wrap">
              <q-btn
                flat
                round
                icon="tag"
                size="sm"
                color="positive"
                @click.stop="openTagsDialog(props.row.id, props.row.tags)"
              >
                <q-tooltip
                  anchor="center right"
                  self="center left"
                  :offset="[5, 5]"
                >
                  Tag Manager
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                icon="edit"
                size="sm"
                color="warning"
                @click.stop="openEditDialog(props.row)"
              >
                <q-tooltip
                  anchor="center right"
                  self="center left"
                  :offset="[5, 5]"
                >
                  Edit
                </q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                icon="delete"
                size="sm"
                color="negative"
                @click.stop="openDeleteDialog(props.row)"
              >
                <q-tooltip
                  anchor="center right"
                  self="center left"
                  :offset="[5, 5]"
                >
                  Delete
                </q-tooltip>
              </q-btn>
            </div>
          </q-td>
        </q-tr>
      </template>
    </q-table>
  </q-expansion-item>
</template>

<script setup lang="ts">
import { computed, ref, toRaw } from 'vue';
import { QTableProps, useQuasar } from 'quasar';
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { deleteExam, getExams } from 'src/api/exams';
import { putExamTags } from 'src/api/tags';
import { Exam } from '../models';
import DeleteDialog from '../Common/DeleteDialog.vue';
import TagsManagerDialog from '../Common/Tags/TagsManagerDialog.vue';
import TagsDisplay from '../Common/Tags/TagsDisplay.vue';
import ExamsNewDialog from './ExamsNewDialog.vue';
import ExamsEditDialog from './ExamsEditDialog.vue';

const $q = useQuasar();
const queryClient = useQueryClient();

const columns: QTableProps['columns'] = [
  {
    name: 'name',
    label: 'Exam name',
    field: 'name',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'subjects',
    label: 'Subjects',
    field: 'subjectIds',
    required: false,
    align: 'left',
    sortable: false,
  },
  {
    name: 'questions',
    label: 'Questions',
    field: 'questionIds',
    required: false,
    align: 'center',
    sortable: false,
  },
  {
    name: 'overwrittenQuestions',
    label: 'Overwritten questions',
    field: 'configs.questions',
    required: false,
    align: 'center',
    sortable: false,
  },
  {
    name: 'tags',
    label: 'Tags',
    field: 'tags',
    required: true,
    align: 'left',
  },
  {
    name: 'action',
    label: 'Action',
    field: '',
    required: true,
    align: 'right',
  },
];

const { mutate: examTagsUpdate } = useMutation({
  mutationFn: (data: { id: string; tags: string[] }) =>
    putExamTags(data.id, data.tags),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({ queryKey: ['exams'] });
  },
});
const { mutate: examsDelete } = useMutation({
  mutationFn: (id: string) => deleteExam(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['exams'] });
  },
});
const { data: examsResponse } = useQuery({
  queryFn: () => getExams(),
  queryKey: ['exams'],
});

const examsData = computed(() => {
  const newData = examsResponse.value;
  return newData ? toRaw(newData).data : [];
});

let loading = ref(false);
let filter = ref('');
let displayStyle = ref(
  $q.localStorage.getItem('configs_ui_examsDisplayMode') || 'table'
);

function openNewExamDialog() {
  $q.dialog({
    component: ExamsNewDialog,
    componentProps: {},
  });
}

function openDeleteDialog(data: Exam) {
  $q.dialog({
    component: DeleteDialog,
    componentProps: {
      message: 'You are about to delete following data:',
      data: data,
    },
  }).onOk((exam: Exam) => {
    examsDelete(exam.id);
  });
}

function openTagsDialog(examId: string, data: string[]) {
  $q.dialog({
    component: TagsManagerDialog,
    componentProps: {
      model: data,
      type: 'exams',
      placeholder: 'Exam tags',
      borderless: false,
    },
  }).onOk((tags: string[]) => {
    examTagsUpdate({ id: examId, tags });
  });
}

function openEditDialog(exam: Exam) {
  $q.dialog({
    component: ExamsEditDialog,
    componentProps: {
      exam: exam,
    },
  });
}
</script>
