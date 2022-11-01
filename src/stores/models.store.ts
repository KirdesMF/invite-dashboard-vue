import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import { createModels, Model } from "../data/model";

export const useModelsStore = defineStore("models", () => {
  const models = ref<Array<Model>>([]);
  const isLoading = ref(false);
  const hasError = ref(false);

  const getModels = computed(() =>
    models.value.map((model) => ({
      label: model.name,
      value: model,
    }))
  );

  async function setModels() {
    try {
      isLoading.value = true;
      models.value = await createModels(20);
    } catch (error) {
      hasError.value = true;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    getModels,
    setModels,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useModelsStore, import.meta.hot));
}
