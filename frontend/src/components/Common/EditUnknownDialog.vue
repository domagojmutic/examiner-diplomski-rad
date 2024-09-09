<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="width: 560px">
      <q-card-section>
        <div class="text-h6">Editor</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <div
          v-for="[key] of Object.entries(dataPairs)"
          :key="key"
          style="display: flex; gap: 8px"
        >
          <q-input
            style="flex-grow: 1"
            :model-value="key"
            @update:model-value="
              (val) => {
                dataPairs[`${val}`] = dataPairs[key];
                delete dataPairs[key];
              }
            "
          ></q-input>
          <q-input
            style="flex-grow: 1"
            :model-value="dataPairs[key]"
            @update:model-value="
              (val) => {
                dataPairs[key] = `${val}`;
              }
            "
          ></q-input>
        </div>
        <q-btn
          icon="add"
          round
          color="positive"
          @click="dataPairs['new-value'] = ''"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="OK"
          color="primary"
          @click="onOkClick"
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

<script setup lang="ts" generic="T extends { [key: string]: unknown }">
import { useDialogPluginComponent } from 'quasar';
import { ref, watch } from 'vue';

interface Props {
  data: { [key: string]: unknown };
}

const props = defineProps<Props>();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const dataPairs = ref<{ [key: string]: string }>({});

watch(
  () => props.data,
  () => {
    Object.entries(props.data).forEach(([key, value]) => {
      dataPairs.value[key] = JSON.stringify(value);
    });
  },
  { immediate: true }
);

function onOkClick() {
  const temp: { [key: string]: unknown } = {};
  Object.entries(dataPairs.value).forEach(([key, value]) => {
    temp[key] = JSON.parse(value);
  });
  onDialogOK(temp);
}

function onCancelClick() {
  onDialogCancel();
}
</script>
