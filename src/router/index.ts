import { createRouter, createWebHistory } from 'vue-router'
import NotFound from "@/views/NotFound.vue";
import Login from "@/views/Login.vue";
import Test from "@/views/test/Test.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/',
      redirect: '/management/patients'
    },
    {
      path: '/test',
      name: 'test',
      component: Test,
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
  ]
})

export default router
