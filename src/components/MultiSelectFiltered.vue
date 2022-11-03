<script setup lang="ts">
import MultiSelect from "@vueform/multiselect";
import SearchGlass from "./icons/SearchGlass.vue";
import { computed, ref } from "vue";

// types
type Option = {
  id: string;
  label: string;
  placeholder: string;
  options: Array<any>;
};

type Props = {
  name: string;
  options: Array<Option>;
};

type Emits = {
  (event: "select", option: any): void;
};

// props
const props = defineProps<Props>();

// emits
const emits = defineEmits<Emits>();

// refs
const current = ref(props.options[0].id);

// computed
const currentOptions = computed(() => props.options.find((option) => option.id === current.value));
const randomId = computed(() => window.crypto.randomUUID());

// methods
/**
 *
 * @param id
 */
function setCurrent(id: string) {
  current.value = id;
}

/**
 * @param id
 */
function setRandomId(id: string) {
  return `${id}-${randomId.value}`;
}

/**
 *
 * @param option
 */
function onSelect(option: unknown) {
  emits("select", option);
}

// expose
defineExpose({ current });
</script>

<template>
  <div class="grid gap-y-1.5">
    <div class="flex gap-x-2 m-l-0.5">
      <template v-for="option in options" :key="option.id">
        <div class="flex items-center gap-x-1">
          <input
            type="radio"
            class="input sr-only"
            :name="name"
            :checked="option.id === current"
            :id="setRandomId(option.id)"
            @change="setCurrent(option.id)"
          />
          <label :for="setRandomId(option.id)" class="font-thin text-2.5 capitalize">
            {{ option.label }}
          </label>
        </div>

        <div class="h-full w-[1px] bg-gray-300 last:hidden"></div>
      </template>
    </div>

    <MultiSelect
      :id="setRandomId(current)"
      :options="currentOptions?.options"
      :placeholder="currentOptions?.placeholder"
      :can-clear="false"
      :close-on-select="false"
      @select="onSelect"
      :classes="{
        singleLabelText: 'font-thin text-3 capitalize truncate',
        containerActive: '',
      }"
    >
      <template #placeholder>
        <div class="multiselect-placeholder gap-x-1">
          <SearchGlass />
          <span class="font-thin text-xs">
            {{ currentOptions?.placeholder }}
          </span>
        </div>
      </template>

      <template #option="{ option }">
        <slot name="option" :option="option">
          <span class="font-thin text-xs">{{ option.label }}</span>
        </slot>
      </template>
    </MultiSelect>
  </div>
</template>

<style scoped>
.input:checked ~ label {
  border-bottom: 1px solid rgb(3, 227, 3);
}
</style>
