import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { Campaign, createCampaigns } from "../data/campaign";

export const useCampaignsStore = defineStore("campaigns", () => {
  const campaigns = ref<Campaign[]>([]);
  const isLoading = ref(false);
  const hasError = ref(false);

  const getCampaigns = computed(() =>
    campaigns.value.map((campaign) => ({
      label: campaign.name,
      value: campaign,
    }))
  );

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
    setCampaigns,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useCampaignsStore, import.meta.hot));
}
