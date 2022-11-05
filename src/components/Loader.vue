<template>
  <svg class="w-full h-full overflow-visible" viewBox="0 0 100 100">
    <circle class="path" cx="50" cy="50" r="50" pathLength="100" />
  </svg>
</template>

<style scoped>
.main {
  height: calc(100vh - var(--header-height));
}

.path {
  stroke: black;
  fill: none;
  stroke-width: 10px;
  stroke-dasharray: 50;
  animation: rotate 1s linear infinite;
  transform-origin: 50% 50%;
}

@keyframes dash {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
