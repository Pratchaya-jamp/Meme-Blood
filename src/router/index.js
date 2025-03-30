import { createWebHistory, createRouter } from 'vue-router'
import GameLobbyView from "@/views/GameLobbyView.vue";
import InventoryView from "@/views/InventoryView.vue";
import Login from "@/views/Login.vue";
import MainMenuView from "@/views/MainMenuView.vue";
import PageNotFound from "@/views/PageNotFound.vue";
const history = createWebHistory()
const routes = [
    {
      path: '/',
      redirect: '/main-menu'
    },
    {
      path: '/main-menu',
      name: 'MainMenu',
      component: MainMenuView
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: InventoryView
    },
    {
      path: '/gamelobby',
      name: 'GameLobby',
      component: GameLobbyView
    },
    {
    path: '/:notMatch(.*)',
    name: 'PageNotFound',
    component: PageNotFound
  }
  ]
  const router = createRouter({
    routes,
    history
  })
  
  export default router