<script setup>
import { ref, computed } from "vue";
import Card from "./Card.vue";
import DeckInGame from './DeckInGame.vue'

// Emit event when a card is clicked
const emit = defineEmits(["selectCard"]);

// TODO represent deck below with DeckInGame
// Example of a deck with different card qualities
const deck = ref([
    {
      "idcard": 120,
      "cardname": "Success Kid",
      "Ability": true,
      "abilityType": "buff",
      "cardinfo": "Victory!",
      "Power": 1,
      "pawnsRequired": "2",
      "cardRarity": "Standard",
      "id": "05ab"
    },
    {
      "idcard": 121,
      "cardname": "Roll Safe",
      "Ability": true,
      "abilityType": "debuff",
      "cardinfo": "Thinking outside the box.",
      "Power": 2,
      "pawnsRequired": "2",
      "cardRarity": "Standard",
      "id": "2471"
    },
    {
      "idcard": 122,
      "cardname": "Harambe",
      "Ability": false,
      "abilityType": "non",
      "cardinfo": "Dicks out.",
      "Power": 2,
      "pawnsRequired": "2",
      "cardRarity": "Epic",
      "id": "a825"
    },
    {
      "idcard": 123,
      "cardname": "Left Exit 12",
      "Ability": true,
      "abilityType": "buff",
      "cardinfo": "Sudden realization.",
      "Power": 1,
      "pawnsRequired": "2",
      "cardRarity": "Standard",
      "id": "5ee0"
    },
    {
      "idcard": 124,
      "cardname": "Two Buttons",
      "Ability": true,
      "abilityType": "debuff",
      "cardinfo": "Difficult choices.",
      "Power": 3,
      "pawnsRequired": "2",
      "cardRarity": "Epic",
      "id": "3993"
    },
    {
      "idcard": 125,
      "cardname": "Is This a Pigeon?",
      "Ability": false,
      "abilityType": "non",
      "cardinfo": "Is this a...?",
      "Power": 1,
      "pawnsRequired": "1",
      "cardRarity": "Standard",
      "id": "1d39"
    },
    {
      "idcard": 126,
      "cardname": "Arthur's Fist",
      "Ability": true,
      "abilityType": "buff",
      "cardinfo": "Anger intensifies.",
      "Power": 1,
      "pawnsRequired": "2",
      "cardRarity": "Standard",
      "id": "82a2"
    },
    {
      "idcard": 127,
      "cardname": "Surprised Pikachu",
      "Ability": true,
      "abilityType": "debuff",
      "cardinfo": "Shocking revelations.",
      "Power": 2,
      "pawnsRequired": "2",
      "cardRarity": "Standard",
      "id": "a51f"
    },
    {
      "idcard": 128,
      "cardname": "Gru's Plan",
      "Ability": false,
      "abilityType": "non",
      "cardinfo": "A cunning plan.",
      "Power": 2,
      "pawnsRequired": "2",
      "cardRarity": "Epic",
      "id": "fed3"
    },
    {
      "idcard": 129,
      "cardname": "Woman Pointing at a Cat",
      "Ability": true,
      "abilityType": "buff",
      "cardinfo": "Accusations fly.",
      "Power": 1,
      "pawnsRequired": "2",
      "cardRarity": "Standard",
      "id": "275a"
    },
    {
      "idcard": 130,
      "cardname": "American Chopper Argument",
      "Ability": true,
      "abilityType": "debuff",
      "cardinfo": "Heated debate.",
      "Power": 3,
      "pawnsRequired": "2",
      "cardRarity": "Epic",
      "id": "313f"
    },
    {
      "idcard": 131,
      "cardname": "Bad Luck Brian",
      "Ability": false,
      "abilityType": "non",
      "cardinfo": "Just my luck.",
      "Power": 1,
      "pawnsRequired": "1",
      "cardRarity": "Standard",
      "id": "6848"
    },
    {
      "idcard": 132,
      "cardname": "First World Problems",
      "Ability": true,
      "abilityType": "buff",
      "cardinfo": "Minor inconveniences.",
      "Power": 1,
      "pawnsRequired": "2",
      "cardRarity": "Standard",
      "id": "887f"
    },
    {
      "idcard": 133,
      "cardname": "Salt Bae",
      "Ability": true,
      "abilityType": "debuff",
      "cardinfo": "A dash of flair.",
      "Power": 2,
      "pawnsRequired": "2",
      "cardRarity": "Standard",
      "id": "8e16"
    },
    {
      "idcard": 134,
      "cardname": "Ancient Aliens",
      "Ability": false,
      "abilityType": "non",
      "cardinfo": "Aliens? I think not.",
      "Power": 4,
      "pawnsRequired": "3",
      "cardRarity": "Legend",
      "id": "1db2"
    },
    {
      "idcard": 135,
      "cardname": "Leonardo DiCaprio Laughing",
      "Ability": true,
      "abilityType": "buff",
      "cardinfo": "Pure joy.",
      "Power": 1,
      "pawnsRequired": "2",
      "cardRarity": "Standard",
      "id": "68f0"
    },
    {
      "idcard": 136,
      "cardname": "Expanding Brain Galaxy",
      "Ability": true,
      "abilityType": "debuff",
      "cardinfo": "Cosmic knowledge.",
      "Power": 2,
      "pawnsRequired": "2",
      "cardRarity": "Epic",
      "id": "54e6"
    },
    {
      "idcard": 137,
      "cardname": "Distracted Boyfriend Galaxy",
      "Ability": false,
      "abilityType": "non",
      "cardinfo": "Galactic distraction.",
      "Power": 2,
      "pawnsRequired": "2",
      "cardRarity": "Epic",
      "id": "3f57"
    },
    {
      "idcard": 138,
      "cardname": "Pepe the Frog Wizard",
      "Ability": true,
      "abilityType": "buff",
      "cardinfo": "Magical feels.",
      "Power": 1,
      "pawnsRequired": "2",
      "cardRarity": "Standard",
      "id": "11b2"
    },
    {
      "idcard": 139,
      "cardname": "Troll Face Ninja",
      "Ability": true,
      "abilityType": "debuff",
      "cardinfo": "Sneaky problem?",
      "Power": 3,
      "pawnsRequired": "2",
      "cardRarity": "Epic",
      "id": "23d7"
    },
]);

// Function to emit selected card
const selectCard = (card) => {
  emit("selectCard", card);
};

// Select 10 random cards and sort them from low to high cardRarity
const cardFromRND = computed(() => {
  return [...deck.value]
    .sort((a, b) => a.cardRarity - b.cardRarity) // Sort by cardRarity
    .slice(0, 10); // Take first 10
});
</script>

<template>
    <div class="flex gap-4 overflow-x-scroll px-4 pt-2">
        <div
            v-for="(card, index) in cardFromRND" :key="index" 
            @click="selectCard(card)"
            class="cursor-pointer"
        >
            <Card
                :title="card.cardname"
                :imageUrl="card.id"
                :cost="card.Power"
                :pawn="card.pawnsRequired"
                size="scale-80 -mx-6 -mt-18 origin-bottom hover:scale-82"
            />
        </div>
    </div>
</template>

<style scoped></style>