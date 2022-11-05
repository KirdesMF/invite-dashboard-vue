import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useSelectedGroupsStore } from "./selected-groups.store";
import { useSelectedUsersStore } from "./selected-users.store";

type Current = {
  groupId: string;
  userId: string;
};

export const useCurrentStore = defineStore("current", () => {
  // states
  const current = ref<Current>({
    groupId: "",
    userId: "",
  });

  // stores
  const groupsStore = useSelectedGroupsStore();
  const usersStore = useSelectedUsersStore();

  // getters
  const getCurrentGroup = computed(() => groupsStore.getGroup(current.value.groupId));
  const getCurrentUser = computed(() => usersStore.getUser(current.value.userId));
  const getCurrentGroupResources = computed(() => getCurrentGroup.value?.resources || []);
  const getCurrentUserResources = computed(() => getCurrentUser.value?.resources || []);

  const getCurrentGroupModels = computed(() => {
    return getCurrentGroup.value?.resources.filter((resource) => resource.type === "model") || [];
  });

  const getCurrentGroupCampaigns = computed(() => {
    return getCurrentGroup.value?.resources.filter((resource) => resource.type === "campaign") || [];
  });

  const getCurrentUserModels = computed(() => {
    return (
      getCurrentUser.value?.resources.filter(
        (resource) => resource.type === "model" && resource.groupId !== current.value.groupId
      ) || []
    );
  });

  const getCurrentUserCampaigns = computed(() => {
    return (
      getCurrentUser.value?.resources.filter(
        (resource) => resource.type === "campaign" && resource.groupId !== current.value.groupId
      ) || []
    );
  });

  // actions
  /**
   *
   * @param groupId
   */
  function setCurrentGroupId(groupId: string) {
    current.value.groupId = groupId;
  }

  /**
   *
   * @param userId
   */
  function setCurrentUserId(userId: string) {
    current.value.userId = userId;
  }

  return {
    current,
    getCurrentGroup,
    getCurrentUser,
    getCurrentGroupResources,
    getCurrentGroupModels,
    getCurrentGroupCampaigns,
    getCurrentUserResources,
    getCurrentUserModels,
    getCurrentUserCampaigns,
    setCurrentGroupId,
    setCurrentUserId,
  };
});
