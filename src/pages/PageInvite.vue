<script setup lang="ts">
import Loader from "../components/Loader.vue";
import Invite from "../views/Invite.vue";
</script>

<template>
  <Suspense>
    <Invite />

    <template #fallback>
      <Loader />
    </template>
  </Suspense>
</template>
