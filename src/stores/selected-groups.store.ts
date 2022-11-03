import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Group } from "../data/group";
import { createUsers, User } from "../data/user";
import { getRandomNumber } from "../utils/utils";
import type { Resource } from "./selected-resources.store";
import { useSelectedUsersStore } from "./selected-users.store";

export type SelectedGroup = Group & {
  resources: Array<Resource>;
  users: Array<User>;
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
    return group?.users.some((user) => user.uuid === userId);
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
    const group = getGroup(groupContactsId)!;

    if (!group) {
      groups.value.push({ ...groupContacts, users: [user] });
      usersStore.addUser(user, groupContactsId, []);
    } else {
      group.users.push(user);
      usersStore.addUser(user, groupContactsId, group.resources);
    }
  }

  /**
   *
   * @param group
   */
  async function addGroup(group: Group) {
    const numberOfUsers = getRandomNumber(5, 200);

    const users = await createUsers(numberOfUsers);

    // add users to selected users
    users.forEach((user) => usersStore.addUser(user, group.uuid));

    // add group to selected groups
    groups.value.push({ ...group, users: users.map((user) => user), resources: [] });
  }

  /**
   *
   * @param groupId
   */
  function removeGroup(groupId: string) {
    const group = getGroup(groupId)!;

    group.users.forEach((user) => usersStore.removeUser(user.uuid, groupId));
    groups.value = groups.value.filter((group) => group.uuid !== groupId);
  }

  /**
   *
   * @param groupId
   * @param userId
   */
  function removeUserFromGroup(userId: string, groupId: string) {
    const group = getGroup(groupId)!;

    usersStore.removeUser(userId, groupId);
    group.users = group.users.filter((user) => user.uuid !== userId);

    if (group.users.length === 0) removeGroup(groupId);
  }

  /**
   * remove all groups and users
   */
  function removeAllGroups() {
    groups.value = [];
    usersStore.removeAllUsers();
  }

  return {
    groupContactsId,
    getSelectedGroups,
    getGroup,
    getCountGroupUsers,
    getCountGroupResources,
    addUserToGroupContact,
    addGroup,
    removeGroup,
    removeUserFromGroup,
    removeAllGroups,
    isSelectedGroup,
    isUserFromGroupContact,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSelectedGroupsStore, import.meta.hot));
}
