import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { Campaign, createCampaigns } from "../data/campaign";
import { useSelectedResourcesStore } from "./selected-resources.store";

export const useCampaignsStore = defineStore("campaigns", () => {
  const campaigns = ref<Campaign[]>([]);
  const isLoading = ref(false);
  const hasError = ref(false);

  const resourcesStore = useSelectedResourcesStore();

  const getCampaigns = computed(() =>
    campaigns.value.map((campaign) => ({
      label: campaign.name,
      value: campaign,
    }))
  );

  /**
   *
   * @param groupId
   * @returns
   */
  function getCampaignsGroup(groupId: string) {
    return campaigns.value.map((campaign) => ({
      label: campaign.name,
      value: campaign,
      disabled: resourcesStore.isSelectedResourceGroup(campaign, groupId),
    }));
  }

  /**
   *
   * @param userId
   * @returns
   */
  function getCampaignsUser(userId: string) {
    return campaigns.value.map((campaign) => ({
      label: campaign.name,
      value: campaign,
      disabled: resourcesStore.isSelectedResourceUser(campaign, userId),
    }));
  }

  async function setCampaigns() {
    try {
      isLoading.value = true;
      campaigns.value = await createCampaigns(50);
    } catch (error) {
      hasError.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    getCampaigns,
    getCampaignsGroup,
    getCampaignsUser,
    setCampaigns,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCampaignsStore, import.meta.hot));
}
