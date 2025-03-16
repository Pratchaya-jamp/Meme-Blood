<script setup>
import { ref, computed } from "vue";
import Card from './Card.vue'
import DeckInGame from './DeckInGame.vue'

const laneProp = defineProps({
    compontents : {
        Card
    },
    handCards : {
        type : Array,
        require:true
    }
})

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
    <div class="flex gap-4 overflow-x-scroll px-4 pt-2">
        <div
            v-for="(card, index) in selectedCards" :key="index" 
        >
            <Card
                :title="card.name"
                :imageUrl="card.id"
                :cost="card.quality"
                :pawn="3"
                size="scale-80 -mx-6 -mt-18 origin-bottom hover:scale-82"
            />
        </div>
    </div>
</template>

<style scoped></style>