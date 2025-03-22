<script setup>
import { ref, watch } from 'vue';
import PlayerManager from '../PlayerManager.vue';
import mainMenuBg from '../../assets/Picture/Bg/mainmenu_bg.jpg'

const currentPage = ref('MainMenu')

//Sound volume setting
const masterVolume = ref(100)
const bgmVolume = ref(100)
const seVolume = ref(100)
const bgmRatio = ref(1)
const seRatio = ref(1)

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

watch(masterVolume, (newVal, oldVal) => {
    if (oldVal > 0) {
        bgmRatio.value = bgmVolume.value / oldVal
        seRatio.value = seVolume.value / oldVal
    }

    if (newVal === 0) {
        bgmVolume.value = 0
        seVolume.value = 0
    } else if (oldVal === 0 && newVal > 0) {
        bgmVolume.value = Math.round(newVal * bgmRatio.value)
        seVolume.value = Math.round(newVal * seRatio.value)
    }
})

// ป้องกันค่าVolumeเกิน 100
watch([bgmVolume, seVolume], ([newBgm, newSe]) => {
    bgmVolume.value = Math.min(100, Math.max(0, newBgm))
    seVolume.value = Math.min(100, Math.max(0, newSe))
})
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

        <!-- Master Volume -->
        <div class="mb-4 w-72">
            <label class="block text-lg font-medium mb-2">Master Volume:</label>
            <input type="range" min="0" max="100" v-model="masterVolume"
                class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500">
            <p class="text-center mt-1">{{ masterVolume }}%</p>
        </div>

        <!-- BGM Volume -->
        <div class="mb-4 w-72">
            <label class="block text-lg font-medium mb-2">BGM Volume:</label>
            <input type="range" min="0" max="100" v-model="bgmVolume"
                class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-green-500">
            <p class="text-center mt-1">{{ bgmVolume }}%</p>
        </div>

        <!-- SE Volume -->
        <div class="mb-4 w-72">
            <label class="block text-lg font-medium mb-2">SE Volume:</label>
            <input type="range" min="0" max="100" v-model="seVolume"
                class="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-red-500">
            <p class="text-center mt-1">{{ seVolume }}%</p>
        </div>

        <button @click="goToMainMenu" 
            class="mt-6 px-6 py-3 text-lg rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition">
            Back to Main Menu
        </button>
    </div>
</template>
