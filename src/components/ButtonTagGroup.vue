<script setup lang="ts">
import type { Resource } from "../stores/selected-resources.store";
import ButtonTag from "./ButtonTag.vue";

type Props = {
  resources: Array<Resource>;
  title: string;
  id: string;
};

type Emits = {
  (event: "click:chip", resource: Resource, id: string): void;
};
defineProps<Props>();

defineEmits<Emits>();
</script>

<template>
  <div class="flex flex-col gap-y-xs">
    <h2 class="text-xs font-light">
      <span>{{ title }}</span>
      <span class="text-gray-400 text-2.5 font-500"> ({{ resources.length }}) </span>
    </h2>

    <ul class="flex flex-wrap gap-xs">
      <li v-for="resource in resources" :key="resource.uuid">
        <ButtonTag :resource="resource" @click="$emit('click:chip', resource, id)" />
      </li>
    </ul>
  </div>
</template>
