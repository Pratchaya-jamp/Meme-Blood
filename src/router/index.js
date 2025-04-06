import { createRouter, createWebHistory } from "vue-router";
import MainMenu from "@/components/UI/mainMenu.vue";
import Login from "@/components/PlayerManager.vue";
import AddPlayerUser from "@/components/PlayerComponents/AddPlayerUser.vue";

const history = createWebHistory()
const routes = [
    {
        path: '/',
        name: 'MainMenu',
        component: MainMenu
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/CreateAccount',
        name: 'AddUser',
        component: AddPlayerUser
    }
]

const router = createRouter({history, routes})
export default router
