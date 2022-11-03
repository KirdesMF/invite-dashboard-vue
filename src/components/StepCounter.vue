<script setup lang="ts">
const props = defineProps<{
  steps: number;
  currentStep: number;
}>();

function setStepClassName(step: number) {
  return {
    "border-gray-300": step !== props.currentStep,
    "text-gray-300": step !== props.currentStep,

    "border-pink-400": step === props.currentStep,
    "text-pink-400": step === props.currentStep,
  };
}
</script>

<template>
  <div class="flex justify-between items-center">
    <span
      v-for="step in steps"
      :key="step"
      class="grid place-items-center h-8 w-8 rounded-full border-2 text-xs transition-border-color transition-color duration-300"
      :class="setStepClassName(step)"
    >
      {{ step }}
    </span>
  </div>
</template>
