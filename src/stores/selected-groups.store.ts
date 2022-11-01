import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Group } from "../data/group";
import { createUsers, User } from "../data/user";
import { getRandomNumber } from "../utils/utils";
import type { Resource } from "./selected-resources.store";
import { useSelectedUsersStore } from "./selected-users.store";

export type SelectedGroup = Group & {
  resources: Array<Resource>;
  users: Array<string>;
};

export const useSelectedGroupsStore = defineStore("selected-groups", () => {
  // stores
  const usersStore = useSelectedUsersStore();

  // states
  const groups = ref<Array<SelectedGroup>>([]);
  const groupContactsId = window.crypto.randomUUID();
  const groupContacts: SelectedGroup = { uuid: groupContactsId, name: "Contacts", color: "", resources: [], users: [] };

  // getters
  const getSelectedGroups = computed(() => groups.value);

  /**
   *
   * @param groupId
   */
  function getGroup(groupId: string) {
    return groups.value.find((group) => group.uuid === groupId);
  }

  /**
   *
   * @param groupId
   */
  function isSelectedGroup(groupId: string) {
    return groups.value.some((group) => group.uuid === groupId);
  }

  /**
   *
   * @param userId
   */
  function isUserFromGroupContact(userId: string) {
    const group = getGroup(groupContactsId);
    return group?.users.includes(userId);
  }

  /**
   *
   * @param groupId
   */
  function getCountGroupResources(groupId: string) {
    const group = getGroup(groupId);
    return group?.resources.length || 0;
  }

  /**
   *
   * @param groupId
   *
   */
  function getCountGroupUsers(groupId: string) {
    const group = getGroup(groupId);
    return group?.users.length || 0;
  }

  /**
   *
   * @param user
   */
  function addUserToGroupContact(user: User) {
    const group = getGroup(groupContactsId);

    // add user to group
    if (!group) groups.value.push({ ...groupContacts, users: [user.uuid] });
    else group?.users.push(user.uuid);

    // add user to selected users and resources from group
    usersStore.addUser(user, group?.resources);
  }

  /**
   *
   * @param group
   */
  async function addGroup(group: Group) {
    const numberOfUsers = getRandomNumber(5, 200);

    const users = await createUsers(numberOfUsers);

    // add users to selected users
    users.forEach((user) => usersStore.addUser(user));

    // add group to selected groups
    groups.value.push({ ...group, users: users.map((user) => user.uuid), resources: [] });
  }

  return {
    groupContactsId,
    getSelectedGroups,
    getGroup,
    getCountGroupUsers,
    getCountGroupResources,
    addUserToGroupContact,
    addGroup,
    isSelectedGroup,
    isUserFromGroupContact,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSelectedGroupsStore, import.meta.hot));
}
