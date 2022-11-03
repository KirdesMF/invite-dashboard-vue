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
import { useAuthStore } from "../stores/auth.store";

import type { Group } from "../data/group";
import type { User } from "../data/user";
import type { Campaign } from "../data/campaign";
import type { Model } from "../data/model";

import StepCounter from "../components/StepCounter.vue";
import CardGroup from "../components/CardGroup.vue";
import CardUser from "../components/CardUser.vue";
import ButtonBase from "../components/ButtonBase.vue";
import MultiSelectFiltered from "../components/MultiSelectFiltered.vue";
import UserGroup from "../components/icons/UserGroup.vue";
import UserIcon from "../components/icons/UserIcon.vue";
import FoldersIcon from "../components/icons/FoldersIcon.vue";
import XMark from "../components/icons/XMark.vue";
import SelectAllIcon from "../components/icons/SelectAllIcon.vue";
import GroupColor from "../components/GroupColor.vue";
import ChevronDoubleLeftIcon from "../components/icons/ChevronDoubleLeftIcon.vue";
import InputSearch from "../components/InputSearch.vue";
import ButtonTagGroup from "../components/ButtonTagGroup.vue";
import SkeletonCardUser from "../components/SkeletonCardUser.vue";

type Step = "groups" | "users" | "resources";

// constants
const steps = 2;

// refs
const currentStep = ref(2);
const step = ref<Step>("groups");
const currentGroupId = ref("");
const currentUserId = ref("");
const isSelectedAll = ref(false);
const queryUsers = ref("");
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

const filteredGroupUsers = computed(() =>
  currentGroup.value?.users.filter((user) => user.first_name.toLowerCase().includes(queryUsers.value.toLowerCase()))
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

// class names sections
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
  queryUsers.value = "";
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

function onSearchUsers(event: Event) {
  const target = event.target as HTMLInputElement;
  queryUsers.value = target.value;

  isSelectedAll.value = false;
  currentUserId.value = "";
}

/**
 * remove all resources group or user
 */
function onClearAllResources() {
  isSelectedAll.value
    ? selectedResourcesStore.removeAllResourcesGroup(currentGroupId.value)
    : selectedResourcesStore.removeAllResourcesUser(currentUserId.value);
}

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
          Access up to <span class="font-500 text-blue">{{ accessUpToDate }}</span>
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
              Access up to <span class="text-blue font-500">{{ accessUpToDate }}</span>
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
                :class="{ 'bg-gray-200': isGroupSelected(group.uuid) }"
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
          <button
            v-if="step === 'resources' || step === 'users'"
            type="button"
            class="w-5 h-5 text-blue lg:hidden"
            @click="setStep('groups')"
          >
            <ChevronDoubleLeftIcon />
          </button>
          <p class="font-thin text-sm text-gray-500 max-w-[35ch] mx-auto text-center">
            Select a contact or all contacts
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

            <div v-if="currentGroup" class="flex items-center gap-x-1">
              <GroupColor :color="currentGroup.color" size="small" />
              <p class="text-2.5 font-500 text-blue">{{ currentGroup?.name }}</p>
            </div>
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

        <InputSearch @input="onSearchUsers" />

        <div class="w-full h-[1px] bg-gray-200"></div>

        <!-- cards group -->
        <div class="overflow-auto scroller">
          <ul class="flex flex-col gap-y-1">
            <template v-if="selectedGroupsStore.isLoading">
              <SkeletonCardUser v-for="count in 6" :key="count" :style="{ '--delay': `${count * 75}ms` }" />
            </template>

            <template v-else>
              <li v-for="user in filteredGroupUsers" :key="user.uuid">
                <CardUser
                  :user="selectedUsersStore.getUser(user.uuid)!"
                  :resources-count="selectedUsersStore.getCountUserResources(user.uuid) || 0"
                  :class="{
                    'bg-gray-200': isUserSelected(user.uuid) || isSelectedAll,
                  }"
                  @click="onClickCardUser(user.uuid)"
                  @delete="selectedGroupsStore.removeUserFromGroup(user.uuid, currentGroupId)"
                />
              </li>
            </template>
          </ul>
        </div>
      </section>

      <!-- 3 resume and remove resources -->
      <section
        class="bg-white py-sm px-xl flex-col gap-y-2xl flex z-1 transition-transform duration-300 row-[1/-1]"
        :class="classNameSectionResources[step]"
      >
        <div class="flex items-center">
          <button type="button" class="w-5 h-5 text-blue md:hidden" @click="setStep('users')">
            <ChevronDoubleLeftIcon />
          </button>
          <p class="font-thin text-sm text-gray-500 max-w-[35ch] mx-auto text-center">Manage resources</p>
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

            <template v-if="currentGroup">
              <div v-if="isSelectedAll" class="flex items-center gap-x-1">
                <GroupColor :color="currentGroup.color" size="small" />
                <p class="text-2.5 font-500 text-blue">{{ currentGroup?.name }}</p>
              </div>

              <div v-else class="flex items-center gap-x-1">
                <GroupColor :color="currentGroup.color" size="small" />
                <p class="text-2.5 font-500 text-blue">{{ currentUser?.first_name }}</p>
              </div>
            </template>
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
            <h3 class="font-200 text-xs underline">Group resources</h3>
            <ButtonTagGroup
              :resources="resourcesCampaignCurrentGroup"
              title="Campaigns"
              :id="currentGroup?.uuid"
              @click:chip="selectedResourcesStore.removeResourceGroup"
            />

            <div class="h-[1px] w-full bg-gray-300"></div>

            <ButtonTagGroup
              :resources="resourcesModelCurrentGroup"
              title="Models"
              :id="currentGroup?.uuid"
              @click:chip="selectedResourcesStore.removeResourceGroup"
            />
          </div>

          <!-- user tags -->

          <div v-if="currentUser?.resources.length" class="flex flex-col gap-lg">
            <h3 class="font-200 text-xs underline">{{ currentUser.first_name }} resources</h3>

            <ButtonTagGroup
              :resources="resourcesCampaignCurrentUser"
              title="Campaigns"
              :id="currentUser?.uuid"
              @click:chip="selectedResourcesStore.removeResourceUser"
            />

            <div class="h-[1px] w-full bg-gray-300"></div>

            <ButtonTagGroup
              :resources="resourcesModelCurrentUser"
              title="Models"
              :id="currentUser?.uuid"
              @click:chip="selectedResourcesStore.removeResourceUser"
            />
          </div>
        </div>
      </section>
    </div>

    <footer class="py-4 px-4xl border-t-1 border-t-gray-200">
      <div class="flex items-center justify-between">
        <StepCounter :steps="steps" :current-step="currentStep" class="w-[6rem]" />

        <div class="flex gap-x-sm items-center justify-center md:justify-end">
          <ButtonBase content="Previous" class="text-gray-700 hover:bg-gray-50" />
          <ButtonBase
            :disabled="selectedUsersStore.getSelectedUsers.length === 0"
            class="bg-pink text-white hover:bg-pink-500"
            content="Send"
          />
        </div>
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