import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import type { User } from "../data/user";
import type { Resource } from "./selected-resources.store";

export type SelectedUser = User & {
  resources: Array<Resource>;
};

export const useSelectedUsersStore = defineStore("selected-user", () => {
  const users = ref<Array<SelectedUser>>([]);

  const getSelectedUsers = computed(() => users.value);

  /**
   *
   * @param userId
   */
  function getUser(userId: string) {
    return users.value.find((user) => user.uuid === userId);
  }

  /**
   * check if user is selected
   * @param userId
   */
  function isSelectedUser(userId: string) {
    return users.value.some((user) => user.uuid === userId);
  }

  /**
   *
   * @param userId
   * @returns
   */
  function getCountUserResources(userId: string) {
    const user = getUser(userId);
    return user?.resources.length;
  }

  /**
   * add user to selected users
   * @param user
   */
  function addUser(user: User, resources?: Array<Resource>) {
    const isSelected = isSelectedUser(user.uuid);
    if (!isSelected) users.value.push({ ...user, resources: resources || [] });
  }

  return { getSelectedUsers, getCountUserResources, addUser, getUser };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSelectedUsersStore, import.meta.hot));
}
