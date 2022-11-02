<script setup lang="ts">
import { Resource } from "../stores/selected-resources.store";
import XMark from "./icons/XMark.vue";

// types
type Props = {
  resource: Resource;
};

type Emits = {
  (e: "click"): void;
};

// props
defineProps<Props>();

// emits
defineEmits<Emits>();

// computed
</script>

<template>
  <div class="flex gap-x-xs border-1 border-gray rounded-md font-extralight text-xs px-2 py-1 max-w-[20ch]">
    <span class="truncate">{{ resource?.name }}</span>
    <button type="button" @click="$emit('click')"><XMark /></button>
  </div>
</template>
