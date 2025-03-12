<script setup>
// TODO 
// Add shuffle card?
// Check table from data that has card to buff or debuff
// & pawn replace with card + add pawn nearby

import { ref, computed } from "vue";
import Deck from "./Deck.vue";

// Example of a deck with different card qualities
const deck = ref([
  { id: 1, name: "Card A", quality: 3 },
  { id: 2, name: "Card B", quality: 5 },
  { id: 3, name: "Card C", quality: 1 },
  { id: 4, name: "Card D", quality: 7 },
  { id: 5, name: "Card E", quality: 2 },
  { id: 6, name: "Card F", quality: 9 },
  { id: 7, name: "Card G", quality: 4 },
  { id: 8, name: "Card H", quality: 8 },
  { id: 9, name: "Card I", quality: 6 },
  { id: 10, name: "Card J", quality: 10 },
  { id: 11, name: "Card K", quality: 3 },
  { id: 12, name: "Card L", quality: 7 },
]);

// Select 10 random cards and sort them from low to high quality
const selectedCards = computed(() => {
  return [...deck.value]
    .sort((a, b) => a.quality - b.quality) // Sort by quality
    .slice(0, 10); // Take first 10
});
</script>

<template>
  <div class="flex justify-center gap-4">
    <div v-for="card in selectedCards" :key="card.id" class="p-4 bg-gray-200 border rounded-lg text-center w-30 h-40">
      <p class="text-lg font-bold">{{ card.name }}</p>
      <p class="text-sm text-gray-600">Quality: {{ card.quality }}</p>
    </div>
  </div>
</template>
