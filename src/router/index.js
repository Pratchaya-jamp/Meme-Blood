import PlayerInventory from '@/components/PlayerComponents/PlayerInventory.vue'
import PlayerManager from '@/components/PlayerManager.vue'
import GameLobby from '@/components/UI/GameLobby.vue'
import MainMenu from '@/components/UI/mainMenu.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import { createWebHistory, createRouter } from 'vue-router'

const history = createWebHistory()
const routes = [
    {
      path: '/',
      redirect: '/main-menu'
    },
    {
      path: '/main-menu',
      name: 'MainMenu',
      component: MainMenu
    },
    {
      path: '/login',
      name: 'Login',
      component: PlayerManager
    },
    {
      path: '/inventory',
      name: 'Inventory',
      component: PlayerInventory
    },
    {
      path: '/gamelobby',
      name: 'GameLobby',
      component: GameLobby
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