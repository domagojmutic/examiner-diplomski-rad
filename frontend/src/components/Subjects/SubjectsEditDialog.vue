<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">Edit Subject</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-item>
          <q-item-section>
            <q-input
              outlined
              v-model="name"
              label="Name"
              :rules="[(val) => !!val || '* required']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <TagsManager
              :type="'subjects'"
              :model="tags"
              :borderless="false"
              placeholder="Subject Tags"
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
import { ref, computed } from 'vue';
import TagsManager from '../Common/Tags/TagsManager.vue';
import { useDialogPluginComponent } from 'quasar';
import { putSubject } from 'src/api/subjects';
import { Subject } from '../models';
import { useQueryClient, useMutation } from '@tanstack/vue-query';

interface Props {
  subject: Subject;
  queryKey?: string[];
}

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps<Props>();

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: subjectUpdate } = useMutation({
  mutationFn: (data: { subject: Subject }) =>
    putSubject(props.subject.id, data.subject),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({
      queryKey: props.queryKey ? props.queryKey : ['subjects'],
    });
  },
});

const name = ref(props.subject.name);
const tags = ref<string[]>(props.subject.tags || []);

const isValid = computed(() => {
  if (name.value != undefined && name.value !== '') return true;
  else return false;
});

function onApplyClick() {
  subjectUpdate({
    subject: {
      ...props.subject,
      name: name.value,
      tags: tags.value,
    },
  });
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
