<script setup lang="ts">
import type { SelectedUser } from "../stores/selected-users.store";
import Trash from "./icons/Trash.vue";
import FolderOpen from "./icons/FolderOpen.vue";
import ChevronRight from "./icons/ChevronRight.vue";

// types
type Props = {
  user: SelectedUser;
  resourcesCount: number;
};

type Emits = {
  (event: "click"): void;
  (event: "delete"): void;
};

// props
defineProps<Props>();

// emits
defineEmits<Emits>();
</script>

<template>
  <article
    tabindex="0"
    class="flex justify-between items-center shadow-sm border-1 border-gray-2 px-sm py-sm rounded-sm"
    @click="$emit('click')"
    @keypress.enter="$emit('click')"
  >
    <div class="flex items-center gap-x-xs">
      <span class="w-12 h-12 grid place-items-center">
        <img :src="user.avatar" alt="avatar" class="rounded-full" />
      </span>

      <div class="text-xs font-extralight">
        <p class="text-blue-500 font-400">{{ user.first_name }}</p>
        <p class="text-2">{{ user.job_title }}</p>
        <p class="text-2 italic lowercase">{{ user.email }}</p>
      </div>
    </div>

    <div class="flex items-center gap-x-2">
      <div class="flex items-center gap-x-0.5 text-3 font-extralight">
        <span class="text-gray-400">
          <FolderOpen />
        </span>
        <span>{{ resourcesCount }}</span>
      </div>

      <button type="button" class="hover:scale-110 hover:text-red transition duration-250" @click="$emit('delete')">
        <Trash />
      </button>

      <span>
        <ChevronRight />
      </span>
    </div>
  </article>
</template>
