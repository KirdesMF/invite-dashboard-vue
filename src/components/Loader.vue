<template>
  <main class="main grid place-items-center">
    <div class="w-20 h-20">
      <svg class="w-full h-full" viewBox="0 0 100 100">
        <path class="path" d="M 50 0 L 50 100 L 0 50 Z" />
      </svg>
    </div>
  </main>
</template>

<style scoped>
.main {
  height: calc(100vh - var(--header-height));
}

.path {
  stroke: red;
  stroke-width: 2px;
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: dash 1s linear forwards;
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
