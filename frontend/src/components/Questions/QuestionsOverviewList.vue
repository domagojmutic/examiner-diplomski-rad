<template>
  <q-expansion-item icon="perm_identity">
    <template v-slot:header>
      <div style="width: 100%">
        <span class="text-h5">Questions</span>
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
      :rows="questionsData || []"
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
                'configs_ui_questionsDisplayMode',
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
          @click="openNewQuestionDialog"
        >
          <q-tooltip anchor="bottom middle" self="top middle" :offset="[0, 5]">
            New Question
          </q-tooltip>
        </q-btn>
      </template>
      <template v-slot:item="props">
        <div
          :href="`#/questions/${props.row.id}`"
          class="q-pa-xs col-xs-12 col-sm-6 col-md-4"
        >
          <q-card
            bordered
            class="shadow-1"
            style="cursor: pointer"
            @click="
              () => {
                $router.push(`/questions/${props.row.id}`);
              }
            "
          >
            <q-card-section class="text-center q-py-lg">
              <strong style="font-size: 1.1em">
                {{ props.row.text }}
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
                Type
              </div>
              <div>{{ props.row.type }}</div>
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
              $router.push(`/questions/${props.row.id}`);
            }
          "
        >
          <q-td key="text" :props="props">
            {{ props.row.text }}
          </q-td>
          <q-td key="type" :props="props">
            <div>{{ props.row.type }}</div>
          </q-td>
          <q-td key="tags" :props="props">
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
import { deleteQuestion, getQuestions } from 'src/api/questions';
import { putQuestionTags } from 'src/api/tags';
import { Question } from '../models';
import DeleteDialog from '../Common/DeleteDialog.vue';
import TagsManagerDialog from '../Common/Tags/TagsManagerDialog.vue';
import TagsDisplay from '../Common/Tags/TagsDisplay.vue';
import QuestionsNewDialog from './QuestionsNewDialog.vue';
import QuestionsEditDialog from './QuestionsEditDialog.vue';

const $q = useQuasar();
const queryClient = useQueryClient();

const columns: QTableProps['columns'] = [
  {
    name: 'text',
    label: 'Text',
    field: 'text',
    required: true,
    align: 'left',
    sortable: true,
  },
  {
    name: 'type',
    label: 'Type',
    field: 'type',
    required: true,
    align: 'left',
    sortable: true,
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

const { mutate: questionTagsUpdate } = useMutation({
  mutationFn: (data: { id: string; tags: string[] }) =>
    putQuestionTags(data.id, data.tags),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({ queryKey: ['questions'] });
  },
});
const { mutate: questionsDelete } = useMutation({
  mutationFn: (id: string) => deleteQuestion(id),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['questions'] });
  },
});
const { data: questionsResponse } = useQuery({
  queryFn: () => getQuestions(),
  queryKey: ['questions'],
});

const questionsData = computed(() => {
  const newData = questionsResponse.value;
  return newData ? toRaw(newData).data : [];
});

let loading = ref(false);
let filter = ref('');
let displayStyle = ref(
  $q.localStorage.getItem('configs_ui_questionsDisplayMode') || 'table'
);

function openNewQuestionDialog() {
  $q.dialog({
    component: QuestionsNewDialog,
    componentProps: {},
  });
}

function openDeleteDialog(data: Question) {
  $q.dialog({
    component: DeleteDialog,
    componentProps: {
      message: 'You are about to delete following data:',
      data: data,
    },
  }).onOk((question: Question) => {
    questionsDelete(question.id);
  });
}

function openTagsDialog(questionId: string, data: string[]) {
  $q.dialog({
    component: TagsManagerDialog,
    componentProps: {
      model: data,
      type: 'questions',
      placeholder: 'Question tags',
      borderless: false,
    },
  }).onOk((tags: string[]) => {
    questionTagsUpdate({ id: questionId, tags });
  });
}

function openEditDialog(question: Question) {
  $q.dialog({
    component: QuestionsEditDialog,
    componentProps: {
      question: question,
    },
  });
}
</script>
