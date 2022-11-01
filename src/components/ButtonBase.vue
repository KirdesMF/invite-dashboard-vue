<script setup lang="ts">
defineProps<{ content: string }>();
</script>

<template>
  <button
    type="button"
    class="py-2 px-6 flex justify-center items-center border-1 border-gray-300 rounded-md shadow-sm text-sm font-medium"
  >
    {{ content }}
  </button>
</template>
