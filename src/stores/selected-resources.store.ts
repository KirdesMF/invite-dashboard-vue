import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { Campaign } from "../data/campaign";
import { Model } from "../data/model";
import { useSelectedGroupsStore } from "./selected-groups.store";
import { useSelectedUsersStore } from "./selected-users.store";

export type Resource = {
  uuid: string;
  type: "campaign" | "model";
  name: string;
};

export const useSelectedResourcesStore = defineStore("selected-resources", () => {
  // stores
  const selectedGroupStore = useSelectedGroupsStore();
  const selectedUserStore = useSelectedUsersStore();

  /**
   * @param resources
   * @param type
   */
  function getAllResourcesByType(resources: Array<Resource>, type: "campaign" | "model") {
    return resources.filter((resource) => resource.type === type);
  }

  /**
   *
   * @param resource
   * @param userId
   */
  function addResourceUser(resource: Campaign | Model, userId: string) {
    const user = selectedUserStore.getUser(userId);
    const hasResource = user?.resources.some((r) => r.uuid === resource.uuid);

    if (!hasResource) user?.resources.push(resource);
  }

  /**
   *
   * @param resource
   * @param groupId
   */
  function addResourceGroup(resource: Campaign | Model, groupId: string) {
    const group = selectedGroupStore.getGroup(groupId);

    group?.resources.push(resource);
    group?.users.forEach((user) => {
      const current = selectedUserStore.getUser(user)!;
      addResourceUser(resource, current?.uuid);
    });
  }

  /**
   *
   * @param resource
   * @param userId
   */
  function removeResourceUser(resource: Campaign | Model, userId: string) {
    const user = selectedUserStore.getUser(userId)!;
    user.resources = user?.resources.filter((r) => r.uuid !== resource.uuid);
  }

  /**
   *
   * @param userId
   */
  function removeAllResourcesUser(userId: string) {
    const user = selectedUserStore.getUser(userId)!;
    user.resources = [];
  }

  /**
   *
   * @param resource
   * @param groupId
   */
  function removeResourceGroup(resource: Campaign | Model, groupId: string) {
    const group = selectedGroupStore.getGroup(groupId)!;

    // remove resource from group
    group.resources = group.resources.filter((r) => r.uuid !== resource.uuid);

    // remove resource group from users
    group.users.forEach((user) => {
      const current = selectedUserStore.getUser(user)!;
      removeResourceUser(resource, current.uuid);
    });
  }

  /**
   *
   * @param groupId
   */
  function removeAllResourcesGroup(groupId: string) {
    const group = selectedGroupStore.getGroup(groupId)!;
    console.log(group.resources);

    // remove resources group from users
    group.users.forEach((user) => {
      const current = selectedUserStore.getUser(user)!;
      group.resources.forEach((resource) => removeResourceUser(resource, current.uuid));
    });

    // remove resources from group
    group.resources = [];
  }

  return {
    getAllResourcesByType,
    addResourceUser,
    addResourceGroup,
    removeResourceUser,
    removeAllResourcesUser,
    removeResourceGroup,
    removeAllResourcesGroup,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSelectedResourcesStore, import.meta.hot));
}
