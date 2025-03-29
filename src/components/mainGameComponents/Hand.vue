<script setup>
import { defineProps, defineEmits } from "vue";
import Card from "./Card.vue";

//Receive from GameManager
const handProps = defineProps({
  player: {
    type: Number,
    required: true
  },
  currentTurn: {
    type: Number,
    required: true
  },
  hand: {
    type: Array,
    required: true
  }
});

const emits = defineEmits(["selectCard"]);

// Select a Card (give to GameManager.vue)
const selectCard = (card) => {
  if (handProps.player === handProps.currentTurn) {
    emits("selectCard", card);
  }
};
</script>

<template>
  <div class="scale-75 flex p-3 gap-3 bg-gray-900 border-t border-gray-700 overflow-x-auto scrollbar-hide">
    <div
      v-for="(card, index) in hand"
      :key="index"
      @click="selectCard(card)"
      class="cursor-pointer transition-transform transform hover:scale-90"
      :class="{
        'border-4 border-blue-500 shadow-lg': player === 1 && currentTurn === 1,
        'border-4 border-red-500 shadow-lg': player === 2 && currentTurn === 2,
      }"
    >
      <Card
        :title="card.cardname"
        :imageUrl="`/cards/${card.idcard}.png`"
        :score="card.Power"
        :pawnsRequired="card.pawnsRequired"
        :pawnLocations="card.pawnLocations"
      />
    </div>
  </div>
</template>
