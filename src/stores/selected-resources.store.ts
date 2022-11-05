import { acceptHMRUpdate, defineStore } from "pinia";
import { Campaign } from "../data/campaign";
import { Model } from "../data/model";
import { useSelectedGroupsStore } from "./selected-groups.store";
import { useSelectedUsersStore } from "./selected-users.store";

export type Resource = {
  uuid: string;
  type: "campaign" | "model";
  name: string;
  groupId?: string;
};

export const useSelectedResourcesStore = defineStore("selected-resources", () => {
  // stores
  const selectedGroupStore = useSelectedGroupsStore();
  const selectedUserStore = useSelectedUsersStore();

  /**
   *
   * @param resource
   * @param groupId
   */
  function isSelectedResourceGroup(resource: Resource, groupId: string) {
    const group = selectedGroupStore.getGroup(groupId);
    return group?.resources.some((r) => r.uuid === resource.uuid);
  }

  /**
   *
   * @param resource
   * @param userId
   */
  function isSelectedResourceUser(resource: Resource, userId: string) {
    const user = selectedUserStore.getUser(userId);
    return user?.resources.some((r) => r.uuid === resource.uuid);
  }

  /**
   * @param resources
   * @param type
   */
  function getAllResourcesByType(resources: Array<Resource>, type: "campaign" | "model") {
    return resources.filter((resource) => resource.type === type);
  }

  /**
   * @param resources
   * @param groupId
   */
  function getAllResourcesByGroupId(resources: Array<Resource>, groupId: string) {
    return resources.filter((resource) => resource.groupId === groupId);
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
    const newResource = { ...resource, groupId };

    group?.resources.push(newResource);
    group?.users.forEach((user) => {
      const current = selectedUserStore.getUser(user.uuid)!;
      addResourceUser(newResource, current?.uuid);
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
      const current = selectedUserStore.getUser(user.uuid)!;
      removeResourceUser(resource, current.uuid);
    });
  }

  /**
   *
   * @param groupId
   */
  function removeAllResourcesGroup(groupId: string) {
    const group = selectedGroupStore.getGroup(groupId)!;

    // remove resources group from users
    group.users.forEach((user) => {
      const current = selectedUserStore.getUser(user.uuid)!;
      group.resources.forEach((resource) => removeResourceUser(resource, current.uuid));
    });

    // remove resources from group
    group.resources = [];
  }

  return {
    getAllResourcesByType,
    getAllResourcesByGroupId,
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
