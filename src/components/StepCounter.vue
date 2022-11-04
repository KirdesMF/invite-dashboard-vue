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
  <div class="grid auto-cols-[min-content_4rem] grid-flow-col grid-rows-[2rem] items-center">
    <template v-for="step in steps" :key="step">
      <span
        class="grid place-items-center h-8 w-8 rounded-full border-2 text-xs transition-border-color transition-color duration-300"
        :class="setStepClassName(step)"
      >
        {{ step }}
      </span>

      <svg v-if="step !== steps" viewBox="0 0 100 100" class="w-full h-full" preserveAspectRatio="none">
        <line x1="0" y1="50" x2="100" y2="50" stroke="grey" stroke-width="6" stroke-dasharray="6" />
      </svg>
    </template>
  </div>
</template>
