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
    },
    allCharacters: {
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

const findCharacterName = (chId) => {
    const character = props.allCharacters.find(character => character.idcharacter === chId);

    return character ? character.charatername : 'Unknown Character';
}

const setMainGamePage = () =>{
    mainGamePagestatus.value = true
}
const showSettings = () => {
    currentPage.value='Settings'
}

const goToLobby = () =>{
    currentPage.value='GameLobby'
}
</script>
<template>
    <div v-if="!mainGamePagestatus && currentPage === 'GameLobby'" 
    class="flex h-screen bg-gradient-to-b from-black to-gray-900 text-white relative">
        <div class="w-1/2 flex flex-col items-center justify-center p-8 border-r border-gray-700">
            <h2 class="text-2xl font-bold text-blue-400 mb-4 tracking-widest">Player 1</h2>
            <select v-model="selectedDeckPlayer1" id="selectedDeckPlayer1" :key="decks.length"
                class="w-3/4 bg-gray-800 text-white py-3 px-4 border border-blue-500 rounded-lg shadow-lg transition mb-4">
                <option>Select Your deck</option>
                <option v-for="deck in decks" :key="deck" :value="deck">{{ deck }}</option>
            </select>
            <select v-model="selectedCharPlayer1" id="selectedCharPlayer1" :key="characters.length"
                class="w-3/4 bg-gray-800 text-white py-3 px-4 border border-blue-500 rounded-lg shadow-lg transition mb-4">
                <option>Select Your character</option>
                <option v-for="character in characters" :key="character" :value="character">{{ character }}</option>
            </select>
            <div v-if="selectedCharPlayer1">
                <img :src="`/Characters/${selectedCharPlayer1}.png`" alt="Player 1 Character" 
                    class="max-w-48 max-h-48 rounded-lg shadow-md border-2 border-blue-500">
                    <p class="mt-2 text-lg text-gray-300">{{ findCharacterName(selectedCharPlayer1) }}</p>
            </div>
        </div>

        <div class="flex items-center justify-center">
            <button @click="setMainGamePage"  
            class="bg-green-500 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-xl text-xl shadow-2xl tracking-widest transition transform hover:scale-110">
            Play</button>
        </div>

        <div class="w-1/2 flex flex-col items-center justify-center p-8 border-l border-gray-700">
            <h2 class="text-2xl font-bold text-red-400 mb-4 tracking-widest">Player 2</h2>
            <select v-model="selectedDeckPlayer2" id="selectedDeckPlayer2" :key="decks.length"
                class="w-3/4 bg-gray-800 text-white py-3 px-4 border border-red-500 rounded-lg shadow-lg transition mb-4">
                <option>Select Your deck</option>
                <option v-for="deck in availableDecksPlayer2" :key="deck" :value="deck">{{ deck }}</option>
            </select>
            <select v-model="selectedCharPlayer2" id="selectedCharPlayer2" :key="characters.length"
                class="w-3/4 bg-gray-800 text-white py-3 px-4 border border-red-500 rounded-lg shadow-lg transition mb-4">
                <option>Select Your character</option>
                <option v-for="character in characters" :key="character" :value="character">{{ character }}</option>
            </select>
            <div v-if="selectedCharPlayer2">
                <img :src="`/Characters/${selectedCharPlayer2}.png`" alt="Player 2 Character" 
                    class="max-w-48 max-h-48 rounded-lg shadow-md border-2 border-red-500">
                    <p class="mt-2 text-lg text-gray-300">{{ findCharacterName(selectedCharPlayer2) }}</p>
            </div>
        </div>
        <button @click="showSettings" 
        class="absolute bottom-8 right-8 px-6 py-3 bg-gray-700 text-white text-lg rounded-lg shadow-lg hover:bg-gray-500 transition">
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