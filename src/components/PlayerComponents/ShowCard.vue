
<script setup>
const props = defineProps({
  card: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray-800 border-4 border-gray-700 rounded-lg shadow-xl p-6 w-96 z-50">
    <h3 class="text-xl font-semibold text-white mb-2">{{ card.cardname }}</h3>
    <img :src="`/cards/${card.idcard}.png`" class="w-full h-auto object-cover rounded-md mb-4">
    <div class="text-gray-300 text-sm mb-1">
        <p>ID: {{ card.idcard }}</p>
        <p>Ability: {{ card.Ability ? 'Yes' : 'No' }}</p>
        <p v-if="card.Ability">Ability Type: {{ card.abilityType }}</p>
        <p>Info: {{ card.cardinfo }}</p>
        <p>Power: {{ card.Power }}</p>
        <p>Pawns Required: {{ card.pawnsRequired }}</p>
        <p>Rarity: {{ card.cardRarity }}</p>
    </div>
    <button @click="$emit('close')" class="mt-4 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-gray-500">
      Close
    </button>
  </div>
</template>

<style scoped>
</style>