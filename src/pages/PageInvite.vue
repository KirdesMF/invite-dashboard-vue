<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { setAccessUpToDate } from "../utils/utils";

import { useGroupsStore } from "../stores/groups.store";
import { useUsersStore } from "../stores/users.store";
import { useSelectedGroupsStore } from "../stores/selected-groups.store";
import { useCampaignsStore } from "../stores/campaigns.store";
import { useModelsStore } from "../stores/models.store";
import { useSelectedUsersStore } from "../stores/selected-users.store";
import { useSelectedResourcesStore } from "../stores/selected-resources.store";

import type { Group } from "../data/group";
import type { User } from "../data/user";
import type { Campaign } from "../data/campaign";
import type { Model } from "../data/model";

import CardGroup from "../components/CardGroup.vue";
import CardUser from "../components/CardUser.vue";
import ButtonBase from "../components/ButtonBase.vue";
import MultiSelectFiltered from "../components/MultiSelectFiltered.vue";
import StepCounter from "../components/StepCounter.vue";
import UserGroup from "../components/icons/UserGroup.vue";
import UserIcon from "../components/icons/UserIcon.vue";
import FoldersIcon from "../components/icons/FoldersIcon.vue";
import XMark from "../components/icons/XMark.vue";
import ButtonTag from "../components/ButtonTag.vue";
import SelectAllIcon from "../components/icons/SelectAllIcon.vue";
import GroupColor from "../components/GroupColor.vue";
import ChevronDoubleLeftIcon from "../components/icons/ChevronDoubleLeftIcon.vue";
import { useAuthStore } from "../stores/auth.store";

type Step = "groups" | "users" | "resources";

// constants
const steps = 2;

// refs
const currentStep = ref(2);
const step = ref<Step>("groups");
const currentGroupId = ref("");
const currentUserId = ref("");
const isSelectedAll = ref(false);

// components refs
const selectUserRef = ref<InstanceType<typeof MultiSelectFiltered> | null>(null);
const selectResourceGroupRef = ref<InstanceType<typeof MultiSelectFiltered> | null>(null);

// stores
const authStore = useAuthStore();
const groupsStore = useGroupsStore();
const usersStore = useUsersStore();
const campaignStore = useCampaignsStore();
const modelStore = useModelsStore();
const selectedGroupsStore = useSelectedGroupsStore();
const selectedUsersStore = useSelectedUsersStore();
const selectedResourcesStore = useSelectedResourcesStore();

// computed
const accessUpToDate = computed(() => setAccessUpToDate(30));
const countLicenses = computed(() => authStore.countLicenses);
const isPro = computed(() => authStore.isPro);

const groups = computed(() => groupsStore.getGroups);
const users = computed(() => usersStore.getUsers);
const campaigns = computed(() => campaignStore.getCampaigns);
const models = computed(() => modelStore.getModels);

const selectedGroups = computed(() => selectedGroupsStore.getSelectedGroups);
const selectedUsers = computed(() => selectedUsersStore.getSelectedUsers);

const currentGroup = computed(() => selectedGroups.value.find((group) => group.uuid === currentGroupId.value));
const currentUser = computed(() => selectedUsers.value.find((user) => user.uuid === currentUserId.value));

const resourcesCampaignCurrentGroup = computed(() => {
  return selectedResourcesStore.getAllResourcesByType(currentGroup.value?.resources!, "campaign");
});

const resourcesModelCurrentGroup = computed(() => {
  return selectedResourcesStore.getAllResourcesByType(currentGroup.value?.resources!, "model");
});

const resourcesCampaignCurrentUser = computed(() => {
  return selectedResourcesStore.getAllResourcesByType(currentUser.value?.resources!, "campaign");
});

const resourcesModelCurrentUser = computed(() => {
  return selectedResourcesStore.getAllResourcesByType(currentUser.value?.resources!, "model");
});

const countResourcesGroupOrUser = computed(() =>
  isSelectedAll.value
    ? selectedGroupsStore.getCountGroupResources(currentGroupId.value) || 0
    : selectedUsersStore.getCountUserResources(currentUserId.value) || 0
);

const options = computed(() => [
  {
    id: "contacts",
    label: "contacts",
    placeholder: "Select contacts",
    options: users.value,
  },
  {
    id: "groups",
    label: "groups",
    placeholder: "Select groups",
    options: groups.value,
  },
]);

const resourcesOptions = computed(() => [
  {
    id: "campaigns",
    label: "campaigns",
    placeholder: "Select campaigns",
    options: campaigns.value,
  },
  {
    id: "models",
    label: "models",
    placeholder: "Select models",
    options: models.value,
  },
]);

// methods
function setStep(option: Step) {
  step.value = option;
}

/**
 * @param groupId
 */
function isGroupSelected(groupId: string) {
  return currentGroupId.value === groupId;
}

/**
 * @param userId
 */
function isUserSelected(userId: string) {
  return currentUserId.value === userId;
}

/**
 * @param groupId
 */
function onClickCardGroup(groupId: string) {
  isSelectedAll.value = true;
  currentGroupId.value = groupId;
  currentUserId.value = "";
  setStep("users");
}

/**
 * @param userId
 */
function onClickCardUser(userId: string) {
  isSelectedAll.value = false;
  currentUserId.value = userId;
  setStep("resources");
}

/**
 * select all users in group
 */
function onClickSelectAll() {
  isSelectedAll.value = !isSelectedAll.value;
  currentUserId.value = "";
  setStep("resources");
}

/**
 * add user or group to selected groups and users
 * @param option
 */
function onSelectUsers(option: Group | User) {
  const hasContactSelected = selectUserRef.value?.current === "contacts";

  if (hasContactSelected) selectedGroupsStore.addUserToGroupContact(option as User);
  else selectedGroupsStore.addGroup(option as Group);

  currentGroupId.value = hasContactSelected ? selectedGroupsStore.groupContactsId : option.uuid;
  currentUserId.value = "";

  isSelectedAll.value = true;
}

/**
 *
 * @param option
 */
function onSelectResource(option: Campaign | Model) {
  isSelectedAll.value
    ? selectedResourcesStore.addResourceGroup(option, currentGroupId.value)
    : selectedResourcesStore.addResourceUser(option, currentUserId.value);
}

/**
 * remove all resources group or user
 */
function onClearAllResources() {
  isSelectedAll.value
    ? selectedResourcesStore.removeAllResourcesGroup(currentGroupId.value)
    : selectedResourcesStore.removeAllResourcesUser(currentUserId.value);
}

const classNameSectionGroups = {
  groups: "col-[1/-1] md:col-[1/2]",
  users: "col-[1/2] -translate-x-full md:translate-x-0",
  resources: "col-[1/2] -translate-x-full lg:translate-x-0",
};

const classNameSectionUsers = {
  groups: "col-[1/-1] translate-x-full md:col-[2/3] md:translate-x-0",
  users: "col-[1/-1] translate-x-0 md:col-[2/3] md:translate-x-0",
  resources: "col-[1/2] -translate-x-full md:col-[2/3] md:-translate-x-full lg:translate-x-0",
};

const classNameSectionResources = {
  groups: "col-[1/-1] translate-x-full md:col-[2/3] lg:col-[3/4] lg:translate-x-0",
  users: "col-[1/-1] translate-x-full md:col-[2/3] lg:col-[3/4] lg:translate-x-0",
  resources: "col-[1/-1] translate-x-0 md:col-[2/3] md:translate-x-0 lg:col-[3/4] lg:translate-x-0",
};

// lifecycle
onMounted(async () => {
  await Promise.all([
    groupsStore.setGroups(),
    usersStore.setUsers(),
    campaignStore.setCampaigns(),
    modelStore.setModels(),
  ]);
});
</script>

<template>
  <main class="main">
    <header class="header flex justify-between py-xs px-xl border-b-light border-b-1">
      <div class="flex items-center gap-x-4">
        <h1 class="font-600 text-lg">Invite managers</h1>

        <!-- <div class="h-full w-[1px] bg-gray-300"></div>

        <StepCounter :steps="steps" :current-step="currentStep" class="w-[6rem]" /> -->

        <div class="h-full w-[1px] bg-gray-300"></div>

        <p class="text-sm font-extralight underline underline-offset-2">
          Select the profiles you want to share with <span class="text-green font-600 uppercase">pro</span> managers
        </p>
      </div>

      <div class="hidden md:flex gap-x-sm items-center">
        <p class="font-200 text-sm">
          <span class="text-green font-400">
            {{ countLicenses }}
          </span>
          {{ countLicenses < 1 ? "license" : "licenses" }} left
        </p>

        <div class="h-full w-[1px] bg-gray-300"></div>

        <p class="font-300 text-sm text-gray-500">
          Access up to <span class="font-500 text-blue-600">{{ accessUpToDate }}</span>
        </p>
      </div>
    </header>

    <div class="grid grid-rows-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 overflow-x-hidden">
      <!-- 1  contacts - groups -->
      <section
        class="border-r-gray-200 border-r-1 bg-white py-sm px-xl flex flex-col gap-y-2xl z-3 transition-transform duration-300 row-[1/-1]"
        :class="classNameSectionGroups[step]"
      >
        <div class="flex items-center">
          <p class="font-thin text-sm text-gray-500 max-w-[35ch] mx-auto text-center">
            Select contacts or a group of contacts
          </p>
        </div>

        <!-- resume -->
        <div
          class="flex justify-between items-center py-1 font-extralight text-xs border-t-1 border-t-gray-200 border-b-1 border-b-gray-200"
        >
          <div class="flex gap-x-2 items-center h-full">
            <div class="flex items-center gap-x-0.5">
              <span class="text-gray-400">
                <UserGroup />
              </span>
              <p>{{ selectedGroupsStore.getSelectedGroups.length }}</p>
            </div>

            <div class="flex items-center">
              <span class="text-gray-400">
                <UserIcon />
              </span>
              <p class="text-blue-400">{{ selectedUsersStore.getSelectedUsers.length }}</p>
            </div>

            <p class="text-2.5">
              Access up to <span class="text-blue-600 font-500">{{ accessUpToDate }}</span>
            </p>
          </div>

          <button
            type="button"
            class="flex text-2.5 text-blue hover:text-blue-600"
            @click="selectedGroupsStore.removeAllGroups"
          >
            <span>Clear</span>
            <span>
              <XMark class="w-3 h-3" />
            </span>
          </button>
        </div>

        <MultiSelectFiltered ref="selectUserRef" name="resource" :options="options" @select="onSelectUsers">
          <template #option="{ option }">
            <div class="flex items-center gap-x-2 py-1">
              <span v-if="option.color">
                <GroupColor :color="option.color" size="small" />
              </span>
              <span class="text-sm font-extralight">{{ option.label }}</span>
            </div>
          </template>
        </MultiSelectFiltered>

        <div class="w-full h-[1px] bg-gray-200"></div>

        <!-- cards group -->
        <div class="overflow-auto scroller">
          <ul class="flex flex-col gap-y-1">
            <li v-for="group in selectedGroups" :key="group.uuid">
              <CardGroup
                :group="group"
                :contacts-id="selectedGroupsStore.groupContactsId"
                :class="{ 'bg-pink-50': isGroupSelected(group.uuid) }"
                @click="onClickCardGroup(group.uuid)"
                @delete="selectedGroupsStore.removeGroup(group.uuid)"
              />
            </li>
          </ul>
        </div>
      </section>

      <!-- 2 users -->
      <section
        class="border-r-gray-200 border-r-1 bg-white py-sm px-xl flex-col gap-y-2xl flex z-2 transition-transform duration-300 row-[1/-1]"
        :class="classNameSectionUsers[step]"
      >
        <div class="flex items-center">
          <button type="button" class="w-5 h-5 text-blue lg:hidden" @click="setStep('groups')">
            <ChevronDoubleLeftIcon />
          </button>
          <p class="font-thin text-sm text-gray-500 max-w-[35ch] mx-auto text-center">
            Select resources for the selected group
          </p>
        </div>

        <!-- review -->
        <div
          class="flex justify-between items-center py-1 font-extralight text-xs border-t-1 border-t-gray-200 border-b-1 border-b-gray-200"
        >
          <div class="flex gap-x-2 items-center">
            <div class="flex items-center">
              <span class="text-gray-400">
                <UserIcon />
              </span>
              <p>{{ selectedGroupsStore.getCountGroupResources(currentGroupId) }}</p>
            </div>

            <div class="flex items-center gap-x-0.5">
              <span class="text-gray-400">
                <FoldersIcon />
              </span>
              <p>{{ selectedGroupsStore.getCountGroupResources(currentGroupId) }}</p>
            </div>

            <p class="text-2.5 font-500">{{ currentGroup?.name }}</p>
          </div>

          <div class="flex gap-x-2 items-center h-full">
            <button
              class="flex items-center gap-x-0.5 hover:text-green"
              :class="[isSelectedAll ? 'text-green' : 'text-blue']"
              @click="onClickSelectAll"
            >
              <span class="text-2.5">Select all</span>
              <span class="h-4 w-4"> <SelectAllIcon /> </span>
            </button>
          </div>
        </div>
        <!-- 
        <MultiSelectFiltered
          ref="selectResourceGroupRef"
          name="resource-group"
          :options="resourcesOptions"
          @select="onSelectResource"
        />

        <div class="w-full h-[1px] bg-gray-200"></div> -->

        <!-- cards group -->
        <div class="overflow-auto scroller">
          <ul class="flex flex-col gap-y-1">
            <li v-for="userId in currentGroup?.users" :key="userId">
              <CardUser
                :user="selectedUsersStore.getUser(userId)!"
                :resources-count="selectedUsersStore.getCountUserResources(userId) || 0"
                :class="{
                  'bg-pink-50': isUserSelected(userId),
                  'hover:bg-pink-50': isUserSelected(userId),
                }"
                @click="onClickCardUser(userId)"
                @delete="selectedGroupsStore.removeUserFromGroup(userId, currentGroupId)"
              />
            </li>
          </ul>
        </div>
      </section>

      <!-- 3 resume and remove resources -->
      <section
        class="bg-white py-sm px-xl flex-col gap-y-2xl flex z-1 transition-transform duration-300 row-[1/-1]"
        :class="classNameSectionResources[step]"
      >
        <div class="flex items-center">
          <button type="button" class="w-5 h-5 text-blue lg:hidden" @click="setStep('users')">
            <ChevronDoubleLeftIcon />
          </button>
          <p class="font-thin text-sm text-gray-500 max-w-[35ch] mx-auto text-center">Remove or clear resources</p>
        </div>

        <!-- resume -->
        <div
          class="flex justify-between items-center py-1 font-extralight text-xs border-t-1 border-t-gray-200 border-b-1 border-b-gray-200"
        >
          <div class="flex gap-x-2 items-center">
            <div class="flex items-center gap-x-0.5">
              <span class="text-gray-400">
                <FoldersIcon />
              </span>
              <p>{{ countResourcesGroupOrUser }}</p>
            </div>
            <p class="text-2.5 font-500">{{ isSelectedAll ? currentGroup?.name : currentUser?.first_name }}</p>
          </div>

          <div class="flex gap-x-2 items-center">
            <button type="button" class="flex text-2.5 text-blue hover:text-blue-600" @click="onClearAllResources">
              <span>Clear</span>
              <span>
                <XMark />
              </span>
            </button>
          </div>
        </div>

        <MultiSelectFiltered name="resource-user" :options="resourcesOptions" @select="onSelectResource" />

        <div class="w-full h-[1px] bg-gray-200"></div>

        <!-- cards group -->
        <div class="overflow-auto scroller">
          <!-- if selected all is true group tags -->
          <div v-if="isSelectedAll && currentGroup?.resources.length" class="flex flex-col gap-lg">
            <div class="flex flex-col gap-y-xs">
              <h2 class="text-xs font-light">
                <span>Campaigns</span>
                <span class="text-gray-400 text-2.5 font-500"> ({{ resourcesCampaignCurrentGroup.length }}) </span>
              </h2>
              <ul class="flex flex-wrap gap-xs">
                <li v-for="resource in resourcesCampaignCurrentGroup" :key="resource.uuid">
                  <ButtonTag
                    :resource="resource"
                    @click="selectedResourcesStore.removeResourceGroup(resource, currentGroupId)"
                  />
                </li>
              </ul>
            </div>

            <div class="h-[1px] w-full bg-gray-300"></div>

            <div class="flex flex-col gap-y-xs">
              <h2 class="text-xs font-light">
                <span>Models</span>
                <span class="text-gray-400 text-2.5 font-500"> ({{ resourcesModelCurrentGroup.length }}) </span>
              </h2>
              <ul class="flex flex-wrap gap-xs">
                <li v-for="resource in resourcesModelCurrentGroup" :key="resource.uuid">
                  <ButtonTag
                    :resource="resource"
                    @click="selectedResourcesStore.removeResourceGroup(resource, currentGroupId)"
                  />
                </li>
              </ul>
            </div>
          </div>

          <!-- user tags -->
          <div v-if="currentUser?.resources.length" class="flex flex-col gap-lg">
            <div class="flex flex-col gap-y-xs">
              <h2 class="text-xs font-light">
                <span>Campaigns</span>
                <span class="text-gray-400 text-2.5 font-500"> ({{ resourcesCampaignCurrentUser.length }}) </span>
              </h2>

              <ul class="flex flex-wrap gap-xs">
                <li v-for="resource in resourcesCampaignCurrentUser" :key="resource.uuid">
                  <ButtonTag
                    :resource="resource"
                    @click="selectedResourcesStore.removeResourceUser(resource, currentUserId)"
                  />
                </li>
              </ul>
            </div>

            <div class="h-[1px] w-full bg-gray-300"></div>

            <div class="flex flex-col gap-y-xs">
              <h2 class="text-xs font-light">
                <span>Models</span>
                <span class="text-gray-400 text-2.5 font-500"> ({{ resourcesModelCurrentUser.length }}) </span>
              </h2>

              <ul class="flex flex-wrap gap-xs">
                <li v-for="resource in resourcesModelCurrentUser" :key="resource.uuid">
                  <ButtonTag
                    :resource="resource"
                    @click="selectedResourcesStore.removeResourceUser(resource, currentUserId)"
                  />
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </div>

    <footer class="py-4 px-4 border-t-1 border-t-gray-200">
      <div class="flex gap-x-sm items-center justify-center md:justify-end">
        <ButtonBase content="Previous" class="text-gray-700 hover:bg-gray-50" />
        <ButtonBase content="Send" class="bg-pink text-white hover:bg-pink-500" />
      </div>
    </footer>
  </main>
</template>

<style scoped>
.main {
  height: calc(100vh - var(--header-height));
  display: grid;
  grid-template-rows: min-content minmax(0, 1fr) min-content;
}

.scroller {
  scrollbar-width: thin;
  scrollbar-color: rgba(0, 0, 0, 0.3) white;
}

.scroller::-webkit-scrollbar {
  width: 8px;
}

.scroller::-webkit-scrollbar-track {
  background-color: white;
}

.scroller::-webkit-scrollbar-thumb {
  border: 2px solid transparent;
  border-radius: 100px;
  background-color: rgba(0, 0, 0, 0.3);
  background-clip: content-box;
}
</style>
