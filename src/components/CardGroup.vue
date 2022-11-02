<script setup lang="ts">
import type { SelectedGroup } from "../stores/selected-groups.store";
import GroupColor from "./GroupColor.vue";
import ChevronRight from "./icons/ChevronRight.vue";
import Trash from "./icons/Trash.vue";
import UserCircleIcon from "./icons/UserCircleIcon.vue";
import UserIcon from "./icons/UserIcon.vue";

//types
type Props = {
  group: SelectedGroup;
  contactsId: string;
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
    class="flex justify-between items-center shadow-sm border-1 border-gray-2 px-sm py-sm rounded-sm hover:bg-gray-100"
    @click="$emit('click')"
    @keypress.enter="$emit('click')"
  >
    <div class="flex items-center gap-x-2">
      <span v-if="group.uuid === contactsId" class="w-6 h-6">
        <UserCircleIcon class="w-8 h-8" />
      </span>
      <GroupColor v-else :color="group.color" />

      <div class="flex items-baseline gap-x-2">
        <p class="font-extralight text-sm truncate max-w-[20ch]">{{ group.name }}</p>
      </div>
    </div>

    <div class="flex item-center gap-x-2">
      <div class="flex items-center">
        <span class="text-gray-400">
          <UserIcon />
        </span>
        <p class="font-thin text-2.5">{{ group.users.length }}</p>
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
