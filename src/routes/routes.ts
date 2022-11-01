import { createRouter, createWebHistory } from "vue-router";

export const routes = [
  { path: "/", component: import("../pages/PageHome.vue") },
  { path: "/invite", component: import("../pages/PageInvite.vue") },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
