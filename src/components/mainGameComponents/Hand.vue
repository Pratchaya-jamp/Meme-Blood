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
  <div class="flex gap-4 overflow-x-scroll px-4 pt-2">
    <div
      v-for="(card, index) in handProps.hand"
      :key="index"
      @click="selectCard(card)"
      class="cursor-pointer"
      :class="{
        'border-4 border-blue-500': handProps.player === 1 && handProps.currentTurn === 1,
        'border-4 border-red-500': handProps.player === 2 && handProps.currentTurn === 2,
      }"
    >
      <Card
        :title="card.cardname"
        :imageUrl="`/cards/${card.idcard}.png`"
        :score="card.Power"
        :pawnRequired="card.pawnsRequired"
        class="scale-80 -mx-6 -mt-18 origin-bottom hover:scale-82"
      />
    </div>
  </div>
</template>
