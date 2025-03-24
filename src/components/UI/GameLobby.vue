1GameLobby.vue <script setup>
import { ref,computed } from 'vue';
import GameManager from '../GameManager.vue';
import setting from './setting.vue';
const props = defineProps({
    decks: {
        type: Array,
        required: true
    },
    characters: {
        type: Array,
        required: true
    }
})
const selectedDeckPlayer1 = ref(null)
const selectedDeckPlayer2 = ref(null)
const selectedCharPlayer1 = ref(null)
const selectedCharPlayer2 = ref(null)
const mainGamePagestatus = ref(false)
const currentPage = ref('GameLobby')

const availableDecksPlayer2 = computed(() => {
    if (selectedDeckPlayer1.value) {
        return props.decks.filter(deck => deck !== selectedDeckPlayer1.value);
    }
    return props.decks
})
const setMainGamePage = () =>{
    mainGamePagestatus.value = true
}
const showSettings = () => {
    currentPage.value='Settings'
}

const goToLobby = () =>{
    currentPage.value='GameLobby'
}

const characterImages = {

}

const getCharacterImage = (characterId) => {

}
</script>
<template>
    <div v-if="!mainGamePagestatus && currentPage === 'GameLobby'" class="flex h-screen bg-gray-800 text-white">
        <div class="w-1/2 flex flex-col items-center justify-center p-6 border-r border-gray-700">
            <h2 class="text-xl font-semibold mb-4">Player 1</h2>
            <select v-model="selectedDeckPlayer1" id="selectedDeckPlayer1" :key="decks.length"
                class="shadow border rounded w-full py-2 px-3 bg-gray-700 text-white border-gray-600 mb-4">
                <option>Select Your deck</option>
                <option v-for="deck in decks" :key="deck" :value="deck">{{ deck }}</option>
            </select>
            <select v-model="selectedCharPlayer1" id="selectedCharPlayer1" :key="characters.length"
                class="shadow border rounded w-full py-2 px-3 bg-gray-700 text-white border-gray-600 mb-4">
                <option>Select Your character</option>
                <option v-for="character in characters" :key="character" :value="character">{{ character }}</option>
            </select>
            <div v-if="selectedCharPlayer1">
                <img :src="getCharacterImage(selectedCharPlayer1)" alt="Player 1 Character" class="max-w-48 max-h-48 rounded-lg shadow-md">
            </div>
        </div>

        <div class="flex items-center justify-center">
            <button @click="setMainGamePage" class="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-8 rounded">Play</button>
        </div>

        <div class="w-1/2 flex flex-col items-center justify-center p-6 border-l border-gray-700">
            <h2 class="text-xl font-semibold mb-4">Player 2</h2>
            <select v-model="selectedDeckPlayer2" id="selectedDeckPlayer2" :key="decks.length"
                class="shadow border rounded w-full py-2 px-3 bg-gray-700 text-white border-gray-600 mb-4">
                <option>Select Your deck</option>
                <option v-for="deck in availableDecksPlayer2" :key="deck" :value="deck">{{ deck }}</option>
            </select>
            <select v-model="selectedCharPlayer2" id="selectedCharPlayer2" :key="characters.length"
                class="shadow border rounded w-full py-2 px-3 bg-gray-700 text-white border-gray-600 mb-4">
                <option>Select Your character</option>
                <option v-for="character in characters" :key="character" :value="character">{{ character }}</option>
            </select>
            <div v-if="selectedCharPlayer2">
                <img :src="getCharacterImage(selectedCharPlayer2)" alt="Player 2 Character" class="max-w-48 max-h-48 rounded-lg shadow-md">
            </div>
        </div>
        <button @click="showSettings" 
        class="px-8 py-4 text-xl rounded-lg cursor-pointer bg-gray-700 text-white hover:bg-gray-500 transition duration-300">
        Settings</button>
    </div>
    <setting v-if="currentPage === 'Settings'"/>
  
    <button @click="goToLobby" v-if="currentPage !== 'GameLobby'"
            class="mt-6 px-6 py-3 text-lg rounded-lg bg-blue-500 text-white hover:bg-blue-700 transition">
            Back to Lobby
    </button>
    <GameManager 
        v-if="mainGamePagestatus"
        :player1Deck="selectedDeckPlayer1"
        :player2Deck="selectedDeckPlayer2"
        :playerCharacter1="selectedCharPlayer1"
        :playerCharacter2="selectedCharPlayer2"
    />
</template>