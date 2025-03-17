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
const newcardId = ref(null)

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

const selectCard = (cardId) => {
  newcardId.value = cardId
}

const editingDeck = async () =>{
  if(!selectedDeck.value || !newcardId.value){
    return
  }
  else{
    let deckToEdit = inventoryProp.decks.find(deck => deck.deckid === selectedDeck.value)
    if(!deckToEdit.cardid.includes(newcardId.value)){
      deckToEdit.cardid.push(newcardId.value)
    }
    try{
      await editItem(`${import.meta.env.VITE_APP_URL}/deck`,deckToEdit.deckid, deckToEdit)
      alert('Deck updated successfully')
    }catch (error) {
    console.error('Failed to update deck:', error)
    }
  }
}
</script>

<template>
 <div class="inventory-container bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-semibold mb-4 text-center text-white">Player Inventory</h2>
    
    <div v-if="inventoryDetails.length > 0">
      <h3 class="text-lg font-semibold text-white mb-2">Inventory Details:</h3>
      
      <label for="selectedDeck" class="block text-gray-200 text-sm font-bold mb-2">Select Deck:</label>
      <select v-model="selectedDeck" id="selectedDeck" class="shadow border rounded w-full py-2 px-3 bg-gray-700 text-white border-gray-600">
        <option v-for="deck in uniqueDecks" :key="deck" :value="deck">{{ deck }}</option>
      </select>
      
      <p v-if="selectedDeck" class="text-white mt-2">Selected Deck ID: {{ selectedDeck }}</p>
      
      <div v-if="selectedDeck && getCardsInDeck.length > 0" class="mt-4 flex flex-wrap gap-4">
        <h4 class="text-lg font-semibold text-white mb-2 w-full">Cards in Selected Deck:</h4>
        <div v-for="card in getCardsInDeck" :key="card.idcard" 
            @click="selectCard(card.idcard)" 
            class="cursor-pointer relative w-36 h-48 bg-gray-800 border-4 border-gray-600 rounded-lg shadow-lg hover:scale-105 transition-transform">
          <div class="absolute top-2 left-2 bg-yellow-500 text-white text-sm px-2 py-1 rounded">ID: {{ card.idcard }}</div>
          <!--<img :src="card.imageUrl" alt="Card Image" class="w-full h-24 object-cover rounded-t-lg" />-->
          <div class="absolute bottom-2 w-full text-center text-sm text-yellow-300 font-semibold">{{ card.cardname }}</div>
        </div>
      </div>
      
      <button @click="editingDeck" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Edit Deck</button>
    </div>
      <ul class="text-white">
        <li v-for="item in inventoryDetails" :key="item.deckid">
          <div class="border-b border-gray-600 pb-2 mb-2">
            <p>Inventory ID: {{ item.deckid }}</p>
            <p>Card: <span v-for="card in item.card" :key="card">(ID: {{ card }})</span></p>
            <p>Deck: <span v-for="deck in item.deck" :key="deck">(ID: {{ deck }})</span></p>
            <p>Character: <span v-for="char in item.character" :key="char">(ID: {{ char }})</span></p>
          </div>
        </li>
      </ul>
  </div>
</template>

<style scoped></style>