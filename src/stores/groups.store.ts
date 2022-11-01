import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { createGroups } from "../data/group";
import type { Group } from "../data/group";
import { useSelectedGroupsStore } from "./selected-groups.store";

export const useGroupsStore = defineStore("groups", () => {
  const selectedGroupsStore = useSelectedGroupsStore();

  const groups = ref<Group[]>([]);
  const isLoading = ref(false);
  const hasError = ref(false);

  const getGroups = computed(() =>
    groups.value.map((group) => ({
      value: group,
      label: group.name,
      color: group.color,
      disabled: selectedGroupsStore.isSelectedGroup(group.uuid),
    }))
  );

  async function setGroups() {
    try {
      isLoading.value = true;
      groups.value = await createGroups(25);
    } catch (error) {
      hasError.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    getGroups,
    setGroups,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useGroupsStore, import.meta.hot));
}
