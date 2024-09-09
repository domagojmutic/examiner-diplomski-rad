<template>
  <div>
    <q-chip
      outline
      color="primary"
      dense
      clickable
      v-for="tag of tags"
      :key="tag"
      style="font-size: 1em"
      @click.stop="
        () => {
          $router.push(`/search?tags=${tag}`);
        }
      "
    >
      {{ tag }}
    </q-chip>
  </div>
</template>

<script setup lang="ts">
interface Props {
  tags: string[];
}

defineProps<Props>();
</script>
