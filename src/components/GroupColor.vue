<script setup lang="ts">
const sizes = {
  small: "w-4 h-4",
  medium: "w-6 h-6",
  large: "w-8 h-8",
};

type Props = {
  color?: string;
  size?: keyof typeof sizes;
};

withDefaults(defineProps<Props>(), {
  size: "medium",
});
</script>

<template>
  <span class="rounded-full block" :class="sizes[size]" :style="{ backgroundColor: color || 'black' }"></span>
</template>
