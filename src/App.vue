<script setup lang="ts">
import Unicorn from "./components/icons/Unicorn.vue";
</script>

<template>
  <header class="h-[var(--header-height)] border-b-light border-b-1 flex items-center px-xs">
    <RouterLink to="/" class="h-10 w-10">
      <Unicorn />
    </RouterLink>
  </header>

  <RouterView />
</template>

<style>
:root {
  --header-height: 68px;
}
</style>
