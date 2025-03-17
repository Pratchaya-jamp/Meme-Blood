<script setup>
import { editItem } from '@/lib/fetchUtils';
import { computed, ref } from 'vue'

const inventoryProp = defineProps({
    inventory:{
        type:Array,
        required:true
    },
    cards: {
        type: Array,
        required: true
    },
    decks: {
        type: Array,
        required: true
    },
    characters: {
        type: Array,
        required: true
    }
});
const selectedDeck = ref()
const isEditingDeck = ref(false)
const selectedInventoryCards = ref([]);

const inventoryDetails = computed(() => {
    return inventoryProp.inventory.map(item => ({
        deckid: item.deckid,
        card: item.cardid.map(id => inventoryProp.cards.find(card => card.idcard === id)?.idcard || 'N/A'),
        deck: item.deckid.map(id => inventoryProp.decks.find(deck => deck.deckid === id)?.deckid || 'N/A'),
        character: item.characterid.map(id => inventoryProp.characters.find(char => char.idcharacter === id)?.idcharacter || 'N/A')
    }))
})

const uniqueDecks = computed(() => {
    const allDeckIds = inventoryDetails.value.flatMap(item => item.deckid);
    return [...new Set(allDeckIds)];
})
const getCardsInDeck = computed(() => {
    if (!selectedDeck.value) {
        return
    }
    const foundDeck = inventoryProp.decks.find(deck => deck.deckid === selectedDeck.value);
    if (foundDeck && foundDeck.cardid) {
        return foundDeck.cardid.map(cardId => inventoryProp.cards.find(card => card.idcard === cardId))
    }
    return
})

const getCardsInInventory = computed(() =>{
    const cardsInInventory = inventoryProp.cards.filter(card => inventoryDetails.value.some(inv => inv.card.includes(card.idcard)))

    if(cardsInInventory){
        return cardsInInventory
    }
})
const editingDeck = async () =>{
    if(!selectedDeck.value || selectedInventoryCards.value.length === 0){
        alert('Please select a deck and at least one card from the inventory.')
        return
    }
    else{
        let deckToEdit = inventoryProp.decks.find(deck => deck.deckid === selectedDeck.value)
        selectedInventoryCards.value.forEach(card => {
            if(!deckToEdit.cardid.includes(card.idcard)){
                deckToEdit.cardid.push(card.idcard)
            }
        })
        try{
            const editedDeck = await editItem(`${import.meta.env.VITE_APP_URL}/deck`, deckToEdit.id, deckToEdit);
            if (editedDeck) {
                alert('Deck updated successfully')
            }
        }catch (error) {
            console.error('Failed to update deck:', error)
        }
    }
}
const selectInventoryCardFunc = (card) => {
    const index = selectedInventoryCards.value.findIndex(selectedCard => selectedCard.idcard === card.idcard);
    if (index === -1) {
        selectedInventoryCards.value.push(card);
    } else {
        selectedInventoryCards.value.splice(index, 1);
    }
}
</script>

<template>
    <div class="inventory-container bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md flex-1">
        <h2 class="text-2xl font-semibold mb-4 text-center text-white">Player Inventory</h2>

        <div v-if="inventoryDetails.length > 0">
            <h3 class="text-lg font-semibold text-white mb-2">Inventory Details:</h3>

            <label for="selectedDeck" class="block text-gray-200 text-sm font-bold mb-2">Select Deck:</label>
            <select v-model="selectedDeck" id="selectedDeck" class="shadow border rounded w-full py-2 px-3 bg-gray-700 text-white border-gray-600">
                <option v-for="deck in uniqueDecks" :key="deck" :value="deck">{{ deck }}</option>
            </select>

            <div v-if="selectedDeck && getCardsInDeck && getCardsInDeck.length > 0" class="mt-4 flex flex-wrap gap-4">
                <h4 class="text-lg font-semibold text-white mb-2 w-full">Cards in Selected Deck:</h4>
                <div v-for="card in getCardsInDeck" :key="card.idcard" @click="selectInventoryCardFunc(card)"
                     :class="{ 'border-blue-500 border-4': selectedInventoryCards.some(selectedCard => selectedCard.idcard === card.idcard) }"
                     class="cursor-pointer relative w-36 h-48 bg-gray-800 border-4 border-gray-600 rounded-lg shadow-lg hover:scale-105 transition-transform">
                    <div class="absolute top-2 left-2 bg-yellow-500 text-white text-sm px-2 py-1 rounded">
                        ID: {{ card.idcard }}</div>
                    <div class="absolute bottom-2 w-full text-center text-sm text-yellow-300 font-semibold">{{ card.cardname }}</div>
                </div>
            </div>

            <button @click="editingDeck" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">Add Card to Deck</button>
        </div>
        <ul class="text-white">
            <li v-for="item in inventoryDetails" :key="item.deckid">
                <div class="border-b border-gray-600 pb-2 mb-2">
                    <p>Inventory ID: {{ item.deckid }}</p>
                    <h4 class="text-lg font-semibold text-white mb-2 w-full">Cards in Inventory</h4>
                    <div v-for="card in getCardsInInventory" :key="card.idcard" @click="selectInventoryCardFunc(card)"
                         :class="{ 'border-blue-500 border-4': selectedInventoryCards.some(selectedCard => selectedCard.idcard === card.idcard),
                                   'bg-blue-900': selectedInventoryCards.some(selectedCard => selectedCard.idcard === card.idcard) }"
                         class="cursor-pointer relative w-36 h-48 bg-gray-800 border-4 border-gray-600 rounded-lg shadow-lg hover:scale-105 transition-transform">
                        <div class="absolute top-2 left-2 bg-yellow-500 text-white text-sm px-2 py-1 rounded">
                            ID: {{ card.idcard}}
                        </div>
                        <div class="absolute bottom-2 w-full text-center text-sm text-yellow-300 font-semibold">
                            {{ card.cardname }}
                        </div>
                    </div>
                    <p>Character: <span v-for="char in item.character" :key="char">(ID: {{ char }})</span></p>
                </div>
            </li>
        </ul>
    </div>
</template>

<style scoped></style>