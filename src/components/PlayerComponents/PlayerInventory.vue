<script setup>
import { computed } from 'vue'
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
    id: item.id,
    card: item.cardid.map(id => inventoryProp.cards.find(card => card.idcard === id)?.idcard || 'N/A'),
    deck: item.deckid.map(id => inventoryProp.decks.find(deck => deck.deckid === id)?.deckid || 'N/A'),
    character: item.characterid.map(id => inventoryProp.characters.find(char => char.idcharacter === id)?.idcharacter || 'N/A')
  }))
})
</script>

<template>
  <div class="inventory-container bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-semibold mb-4 text-center text-white">Player Inventory</h2>

    <div v-if="inventoryDetails.length > 0">
      <h3 class="text-lg font-semibold text-white mb-2">Inventory Details:</h3>
      <ul class="text-white">
        <li v-for="item in inventoryDetails" :key="item.id">
          <div class="border-b border-gray-600 pb-2 mb-2">
            <p>Inventory ID: {{ item.id }}</p>
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