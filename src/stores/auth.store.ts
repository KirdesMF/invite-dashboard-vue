import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const auth = ref({
    licenses: 0,
  });

  const isPro = computed(() => auth.value.licenses > 0);
  const countLicenses = computed(() => auth.value.licenses);

  /**
   *
   * @param licenses
   */
  function setLicenses(licenses: number) {
    auth.value.licenses = licenses;
  }

  return { countLicenses, isPro, setLicenses };
});
