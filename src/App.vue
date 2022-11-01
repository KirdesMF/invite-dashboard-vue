<script setup lang="ts"></script>

<template>
  <header class="h-[var(--header-height)] border-b-light border-b-1"></header>
  <RouterView />
</template>

<style>
:root {
  --header-height: 68px;
}
</style>
