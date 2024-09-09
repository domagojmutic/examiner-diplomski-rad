<template>
  <q-item>
    <q-item-section>
      <q-input
        outlined
        v-model="tempAnswer"
        label="Offered answers"
        @keydown.enter.prevent="
          localQuestionObject.options.push({
            text: tempAnswer,
            required: false,
            correctAnswer: false,
          });
          tempAnswer = '';
          localQuestionObject.showOptions ===
          localQuestionObject.options.length - 1
            ? (localQuestionObject.showOptions =
                localQuestionObject.options.length)
            : null;
        "
      >
        <template v-slot:append>
          <q-btn
            icon="add"
            dense
            round
            flat
            @click="
              localQuestionObject.options.push({
                text: tempAnswer,
                required: false,
                correctAnswer: false,
              });
              tempAnswer = '';
              localQuestionObject.showOptions ===
              localQuestionObject.options.length - 1
                ? (localQuestionObject.showOptions =
                    localQuestionObject.options.length)
                : null;
            "
          />
        </template>
      </q-input>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-list separator>
        <draggable
          class="list-group"
          :component-data="{
            type: 'transition-group',
            name: !drag ? 'flip-list' : null,
          }"
          :list="localQuestionObject.options"
          item-key="text"
          v-bind="dragOptions"
          @start="drag = true"
          @end="drag = false"
          handle=".handle"
        >
          >
          <template #item="{ element }">
            <q-item>
              <q-item-section side>
                <q-icon name="drag_indicator" class="handle" />
              </q-item-section>
              <q-item-section
                :class="{
                  'text-positive': element.correctAnswer,
                }"
                style="
                  flex-direction: row;
                  justify-content: flex-start;
                  align-items: center;
                "
              >
                {{ element.text }}
                <span v-if="element.required" style="color: var(--q-primary)">
                  &nbsp;*
                </span>
              </q-item-section>
              <q-item-section side>
                <div>
                  <q-btn
                    icon="check_circle"
                    :color="element.correctAnswer ? 'positive' : ''"
                    dense
                    round
                    flat
                    @click="element.correctAnswer = !element.correctAnswer"
                  >
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[5, 5]"
                    >
                      {{
                        element.correctAnswer
                          ? 'Mark as incorrect'
                          : 'Mark as correct'
                      }}
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    icon="delete"
                    dense
                    round
                    flat
                    @click="
                      localQuestionObject.options =
                        localQuestionObject.options.filter(
                          (opt) => opt !== element
                        );
                      localQuestionObject.showOptions - 1 ===
                      localQuestionObject.options.length
                        ? (localQuestionObject.showOptions =
                            localQuestionObject.options.length)
                        : null;
                    "
                  />
                  <q-btn icon="more_horiz" dense round flat>
                    <q-menu>
                      <q-list>
                        <q-item
                          clickable
                          @click="element.required = !element.required"
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="emergency"
                              :color="element.required ? 'primary' : 'grey-7'"
                            />
                          </q-item-section>
                          <q-item-section>Required</q-item-section>
                        </q-item>
                        <q-separator />
                        <q-item
                          v-if="localQuestionObject.randomOrder"
                          clickable
                          @click="
                            element.pin === 'top'
                              ? (element.pin = undefined)
                              : (element.pin = 'top')
                          "
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="vertical_align_top"
                              :color="
                                element.pin === 'top' ? 'primary' : 'grey-7'
                              "
                            />
                          </q-item-section>
                          <q-item-section>Pin to top</q-item-section>
                        </q-item>
                        <q-item
                          v-if="localQuestionObject.randomOrder"
                          clickable
                          @click="
                            element.pin === 'bottom'
                              ? (element.pin = undefined)
                              : (element.pin = 'bottom')
                          "
                        >
                          <q-item-section avatar>
                            <q-icon
                              name="vertical_align_bottom"
                              :color="
                                element.pin === 'bottom' ? 'primary' : 'grey-7'
                              "
                            />
                          </q-item-section>
                          <q-item-section>Pin to bottom</q-item-section>
                        </q-item>
                      </q-list>
                    </q-menu>
                    <q-tooltip
                      anchor="center right"
                      self="center left"
                      :offset="[5, 5]"
                    >
                      More options
                    </q-tooltip>
                  </q-btn>
                </div>
              </q-item-section>
            </q-item>
          </template>
        </draggable>
      </q-list>
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-checkbox
        v-model="localQuestionObject.randomOrder"
        label="Randomize order"
      />
    </q-item-section>
  </q-item>
  <q-item>
    <q-item-section>
      <q-slider
        v-model="localQuestionObject.showOptions"
        :min="localQuestionObject.options.filter((opt) => opt.required).length"
        :max="localQuestionObject.options.length"
        :step="1"
        label
        snap
      />
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { includesAll } from 'src/util/array';
import { computed, reactive, ref, watch } from 'vue';
import draggable from 'vuedraggable';

interface Props {
  questionObject?: {
    randomOrder: boolean;
    options: {
      text: string;
      required: boolean;
      correctAnswer: boolean;
    }[];
    showOptions: number;
  };
  answerObject?: { [key: string]: unknown };
}

const props = defineProps<Props>();

const emit = defineEmits<{
  update: [
    questionObject: { [key: string]: unknown },
    answerObject: { [key: string]: unknown }
  ];
}>();

let localQuestionObject = reactive<{
  randomOrder: boolean;
  options: {
    text: string;
    required: boolean;
    correctAnswer: boolean;
    pin?: 'top' | 'bottom';
  }[];
  showOptions: number;
}>(
  props.questionObject &&
    includesAll(Object.getOwnPropertyNames(props.questionObject), [
      'randomOrder',
      'options',
      'showOptions',
    ])
    ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      props.questionObject!
    : {
        randomOrder: false,
        options: [],
        showOptions: 0,
      }
);

// let localAnswerObject = reactive<{
//   correctOptions: string[];
// }>(
//   includesAll(Object.getOwnPropertyNames(props.questionObject), [
//     'correctOptions',
//   ])
//     ? // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
//       props.answerObject!
//     : {
//         correctOptions: [],
//       }
// );

let tempAnswer = ref('');

const dragOptions = computed(() => ({
  animation: 200,
  group: 'description',
  disabled: false,
  ghostClass: 'ghost',
}));

const drag = ref(false);

watch(
  [localQuestionObject /*localAnswerObject*/],
  ([newQuestionObject /*newAnswerObject*/]) => {
    emit('update', newQuestionObject, {});
  }
);
</script>

<style scoped>
.handle {
  float: left;
  padding-top: 8px;
  padding-bottom: 8px;
  cursor: grab;
}
</style>
