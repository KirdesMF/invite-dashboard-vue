<script setup lang="ts">
import { useAuthStore } from "../stores/auth.store";

const authStore = useAuthStore();
</script>

<template>
  <main class="main">
    <nav class="flex gap-x-2xl">
      <RouterLink
        to="/invite"
        class="flex items-center py-xs px-xs bg-pink-400 hover:bg-pink-500 transition-colors duration-200 rounded-sm"
        @click="authStore.setLicenses(0)"
      >
        <span class="font-200 text-sm text-white">Free user</span>
      </RouterLink>

      <RouterLink
        to="/invite"
        class="flex items-center py-xs px-xs bg-pink-400 hover:bg-pink-500 transition-colors duration-200 rounded-sm"
        @click="authStore.setLicenses(1200)"
      >
        <span class="font-200 text-sm text-white">Pro user</span>
      </RouterLink>
    </nav>
  </main>
</template>

<style scoped>
.main {
  height: calc(100vh - var(--header-height));
  min-height: calc(100vh - var(--header-height));
  display: grid;
  place-items: center;
}
</style>
