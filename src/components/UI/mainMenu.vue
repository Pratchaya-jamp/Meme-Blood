<script setup>
import { ref, watch } from 'vue';
import PlayerManager from '../PlayerManager.vue';
import mainMenuBg from '../../assets/Picture/Bg/mainmenu_bg.jpg'
import setting from './setting.vue';

const currentPage = ref('MainMenu')

const showLogin = () => {
    currentPage.value='showlogin'
}

const showSettings = () => {
    currentPage.value='Settings'
}

const goToMainMenu = () => {
    currentPage.value='MainMenu'
}

const exitGame = () =>{
    window.close()
}


</script>

<template>
    <div v-if="currentPage === 'MainMenu'" 
        class="flex flex-col items-center justify-center min-h-screen bg-cover bg-center"
        :style="{ backgroundImage: `url(${mainMenuBg})` }">
        <h1 class="text-4xl font-bold mb-8 text-center text-white">
         война(Voyna) Of Meme
        </h1>
        <div class="flex flex-col gap-5">
      <button @click="showLogin" 
        class="px-8 py-4 text-xl rounded-lg cursor-pointer bg-gray-700 text-white hover:bg-gray-500 transition duration-300">
        Play</button>
      <button @click="showSettings" 
        class="px-8 py-4 text-xl rounded-lg cursor-pointer bg-gray-700 text-white hover:bg-gray-500 transition duration-300">
        Settings</button>
      <button @click="exitGame" 
        class="px-8 py-4 text-xl rounded-lg cursor-pointer bg-gray-700 text-white hover:bg-gray-500 transition duration-300">
        Exit Game</button>
     </div>
  </div>

  <PlayerManager v-if="currentPage === 'showlogin'"/>
  <setting v-if="currentPage === 'Settings'"/>
  
  <button @click="goToMainMenu" v-if="currentPage !== 'MainMenu' && currentPage !== 'showlogin'"
            class="mt-6 px-6 py-3 text-lg rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition">
            Back to Main Menu
  </button>
</template>
