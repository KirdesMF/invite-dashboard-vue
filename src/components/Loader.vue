<template>
  <svg class="w-full h-full" viewBox="0 0 100 100">
    <circle class="path" cx="50" cy="50" r="40" pathLength="100" />
  </svg>
</template>

<style scoped>
.path {
  stroke: black;
  fill: none;
  stroke-width: 5px;
  stroke-dasharray: 50;
  animation: rotate 1s linear infinite;
  transform-origin: 50% 50%;
}

@keyframes rotate {
  to {
    transform: rotate(360deg);
  }
}
</style>
