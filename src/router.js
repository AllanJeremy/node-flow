import { createRouter, createWebHistory } from "vue-router";

//? Page imports
import Graph from "./pages/graph.vue";

//? Routes
const routes = [
  {
    path: "/",
    component: Graph,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes: routes,
});

//* EXPORTS
export default router;
