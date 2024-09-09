<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card>
      <q-card-section>
        <div class="text-h6">Warning</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ message }}
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-item dense v-for="[key, value] of objectEntries" :key="key">
          <q-item-section side>{{ key }}:</q-item-section>
          <q-item-section>
            {{
              JSON.stringify(value).length > 80
                ? JSON.stringify(value).slice(0, 80) + '...'
                : value
            }}
            <q-tooltip
              v-if="JSON.stringify(value).length > 80"
              anchor="center right"
              self="center left"
              :offset="[5, 5]"
            >
              {{ value }}
            </q-tooltip>
          </q-item-section>
        </q-item>
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
import { ref } from 'vue';

interface Props {
  data: T;
  message: string;
}

const props = defineProps<Props>();
defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent<T>();

let objectEntries = ref(Object.entries(props.data));

function onOkClick() {
  onDialogOK(props.data);
}

function onCancelClick() {
  onDialogCancel();
}
</script>
