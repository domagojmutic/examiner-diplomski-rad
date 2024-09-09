<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="min-width: 480px">
      <q-card-section>
        <div class="text-h6">Upload answer sheets</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-item>
          <q-item-section>
            <q-file outlined multiple v-model="files" label="Upload"> </q-file>
          </q-item-section>
        </q-item>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="Upload"
          color="primary"
          @click="onUploadClick"
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
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';
import { useMutation } from '@tanstack/vue-query';
import { postExamInstanceResponse } from 'src/api/examInstances';

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const { mutate: examInstanceSheetUpload } = useMutation({
  mutationFn: (data: { file: File }) => postExamInstanceResponse(data.file),
});

const files = ref([]);

function onUploadClick() {
  files.value.forEach((file) => {
    examInstanceSheetUpload({
      file,
    });
  });

  onDialogOK();
}

function onCancelClick() {
  onDialogCancel();
}
</script>
