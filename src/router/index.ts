import { createRouter, createWebHistory } from 'vue-router'
import NotFound from "@/views/NotFound.vue";
import Login from "@/views/login/Login.vue";
import Home from '@/views/Home.vue'
import AssignmentHome from '@/views/assignment/AssignmentHome.vue'
import AssignmentDetail from '@/views/assignment/AssignmentDetail.vue'

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
      name: 'home',
      component: Home
    },
    {
      path: '/assignment',
      name: 'assignment',
      component: AssignmentHome,
    },
    {
      path: '/assignment/:seq',
      name: 'assignmentDetail',
      component: AssignmentDetail,
    },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound }
  ]
})

export default router
