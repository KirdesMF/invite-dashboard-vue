import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { createModels, Model } from "../data/model";
import { useSelectedResourcesStore } from "./selected-resources.store";

export const useModelsStore = defineStore("models", () => {
  const models = ref<Array<Model>>([]);
  const isLoading = ref(false);
  const hasError = ref(false);

  const resourcesStore = useSelectedResourcesStore();

  const getModels = computed(() =>
    models.value.map((model) => ({
      label: model.name,
      value: model,
    }))
  );

  /**
   *
   * @param groupId
   */
  function getModelsGroup(groupId: string) {
    return models.value.map((model) => ({
      label: model.name,
      value: model,
      disabled: resourcesStore.isSelectedResourceGroup(model, groupId),
    }));
  }

  /**
   *
   * @param userId
   */
  function getModelsUser(userId: string) {
    return models.value.map((model) => ({
      label: model.name,
      value: model,
      disabled: resourcesStore.isSelectedResourceUser(model, userId),
    }));
  }

  async function setModels() {
    try {
      isLoading.value = true;
      models.value = await createModels(50);
    } catch (error) {
      hasError.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    getModels,
    getModelsGroup,
    getModelsUser,
    setModels,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModelsStore, import.meta.hot));
}
