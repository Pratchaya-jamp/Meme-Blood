<script setup>
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
    return;
  }
  const foundDeck = inventoryProp.decks.find(deck => deck.deckid === selectedDeck.value);
  if (foundDeck && foundDeck.cardid) {
    return foundDeck.cardid.map(cardId => inventoryProp.cards.find(card => card.idcard === cardId)?.cardname || 'N/A');
  }
  return;
})
const selectedDeck = ref('')
</script>

<template>
  <div class="inventory-container bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-semibold mb-4 text-center text-white">Player Inventory</h2>

    <div v-if="inventoryDetails.length > 0">
      <h3 class="text-lg font-semibold text-white mb-2">Inventory Details:</h3>
      <div>
        <label for="selectedDeck" class="block text-gray-200 text-sm font-bold mb-2">Select Deck:</label>
        <select v-model="selectedDeck" id="selectedDeck" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600">
          <option value="">-- Select a Deck --</option>
          <option v-for="deck in uniqueDecks" :key="deck" :value="deck">
            {{ deck }}
          </option>
        </select>
        <p v-if="selectedDeck" class="text-white mt-2">Selected Deck ID: {{ selectedDeck }}</p>
        <div v-if="selectedDeck && getCardsInDeck.length > 0" class="mt-4">
          <h4 class="text-lg font-semibold text-white mb-2">Cards in Selected Deck:</h4>
          <ul class="list-disc pl-5 text-white">
            <li v-for="card in getCardsInDeck" :key="card">{{ card }}</li>
          </ul>
        </div>
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
    <div v-else class="text-gray-400">No inventory found for this user.</div>
  </div>
</template>

<style scoped></style>