import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import RecipeView from '@/views/RecipeView.vue'
import SearchView from '@/views/SearchView.vue'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/recipe',
      name: 'recipe',
      component: RecipeView
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView
    }
  ],
})

export default router
