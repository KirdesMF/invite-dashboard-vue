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

  // states
  const resources = ref<Array<Resource>>([]);

  const getSelectedResources = computed(() => resources.value);

  /**
   *
   * @param resourceId
   * @returns resource
   */
  function getResource(resourceId: string) {
    return resources.value.find((resource) => resource.uuid === resourceId);
  }

  /**
   *
   * @param resourceId
   * @param type
   * @returns
   */
  function getResourceByType(resourceId: string, type: "campaign" | "model") {
    return resources.value.find((resource) => resource.uuid === resourceId && resource.type === type);
  }

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
    const hasResource = user?.resources.some((r) => r.uuid === resource.uuid && r.type === resource.type);
    const isSelectedResource = resources.value.some((r) => r.uuid === resource.uuid && r.type === resource.type);

    if (!hasResource) user?.resources.push(resource);
    if (!isSelectedResource) resources.value.push(resource);
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

  return {
    getSelectedResources,
    addResourceUser,
    addResourceGroup,
    getResource,
    getResourceByType,
    getAllResourcesByType,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSelectedResourcesStore, import.meta.hot));
}
