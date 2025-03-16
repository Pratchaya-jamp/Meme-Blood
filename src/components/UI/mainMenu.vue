<script setup>
import { ref } from 'vue';
import PlayerManager from '../PlayerManager.vue';
import mainMenuBg from '../../assets/Picture/Bg/mainmenu_bg.jpg'

const currentPage = ref('MainMenu')
const mainMenuEmits = defineEmits(['backtomenu'])
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

  <div v-if="currentPage === 'Settings'" class="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-8">
    <h2 class="text-3xl font-semibold mb-6">Settings</h2>
    <div class="mb-4">
      <label for="volume" class="block text-lg font-medium mb-2">Volume:</label>
      <input type="range" id="volume" name="volume" min="0" max="100" class="w-64">
    </div>
    <div>
        //addsetting
    </div>
    <button @click="goToMainMenu" class="mt-6 px-6 py-3 text-lg rounded-lg cursor-pointer bg-blue-500 text-white hover:bg-blue-700 transition duration-300">Back to Main Menu</button>
  </div>

</template>

<style scoped></style>