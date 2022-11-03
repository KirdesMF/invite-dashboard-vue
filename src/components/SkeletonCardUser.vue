<script setup lang="ts"></script>

<template>
  <div
    class="skeleton flex justify-between items-center shadow-sm border-1 border-gray-2 px-sm py-sm rounded-sm bg-gray-200"
  >
    <div class="flex items-center gap-x-xs">
      <span class="w-12 h-12 grid place-items-center bg-gray-100 rounded-full"></span>
    </div>
  </div>
</template>

<style>
:root {
  --delay: 0;
}
</style>
<style scoped>
@keyframes skeleton {
  from {
    background-color: #e2e8f0;
  }
  to {
    background-color: #dfe3e6;
  }
}

.skeleton {
  animation: skeleton 300ms infinite alternate;
  animation-delay: var(--delay);
}
</style>
