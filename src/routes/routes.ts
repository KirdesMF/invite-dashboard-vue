import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/PageHome.vue";
import Invite from "../pages/PageInvite.vue";

export const routes = [
  { path: "/", component: Home },
  { path: "/invite", component: Invite },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
