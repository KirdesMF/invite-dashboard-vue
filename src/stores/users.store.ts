import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { createUsers, User } from "../data/user";
import { useSelectedGroupsStore } from "./selected-groups.store";

export const useUsersStore = defineStore("users", () => {
  const selectedGroupsStore = useSelectedGroupsStore();

  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const hasError = ref(false);

  const getUsers = computed(() =>
    users.value.map((user) => ({
      label: user.first_name + " " + user.last_name,
      value: user,
      disabled: selectedGroupsStore.isUserFromGroupContact(user.uuid),
    }))
  );

  async function setUsers() {
    try {
      isLoading.value = true;
      users.value = await createUsers(40);
    } catch (error) {
      hasError.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    getUsers,
    setUsers,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUsersStore, import.meta.hot));
}
