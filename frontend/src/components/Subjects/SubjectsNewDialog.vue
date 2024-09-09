<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">New Subject</div>
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
import { postSubject } from 'src/api/subjects';
import { Subject } from '../models';
import { useQueryClient, useMutation } from '@tanstack/vue-query';

defineEmits([...useDialogPluginComponent.emits]);

const queryClient = useQueryClient();
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: subjectCreate } = useMutation({
  mutationFn: (data: { subject: Omit<Subject, 'id'> }) =>
    postSubject(data.subject),
  onSuccess: () => {
    //Replace with update queries
    queryClient.invalidateQueries({ queryKey: ['subjects'] });
  },
});

const name = ref('');
const tags = ref<string[]>([]);

const isValid = computed(() => {
  if (name.value != undefined && name.value !== '') return true;
  else return false;
});

function onCreateClick() {
  subjectCreate({
    subject: { name: name.value, tags: tags.value, questionIds: [] },
  });
  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
