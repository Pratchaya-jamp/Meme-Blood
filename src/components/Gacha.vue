<script setup>
import { ref } from "vue";

const props = defineProps({
  Gachaitems: {
    type: Array,
    required: true,
  },
  GoldCardRate: {
    type: Number,
    required: true,
  },
  EpicCardRate: {
    type: Number,
    required: true,
  },
  currentUser: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["spinGacha"]);

const spinGacha = () => {
  const randNum = Math.random() * 100;
  let selectedCard;

  if (randNum <= props.GoldCardRate) {
    const goldCards = props.Gachaitems.filter((card) => card.cardRarity === "Legend");
    selectedCard = goldCards[Math.floor(Math.random() * goldCards.length)];
  } else if (randNum <= props.EpicCardRate) {
    const epicCards = props.Gachaitems.filter((card) => card.cardRarity === "Epic");
    selectedCard = epicCards[Math.floor(Math.random() * epicCards.length)];
  } else {
    const standardCards = props.Gachaitems.filter((card) => card.cardRarity === "Standard");
    selectedCard = standardCards[Math.floor(Math.random() * standardCards.length)];
  }

  if (selectedCard) {
    emit("spinGacha", selectedCard);
  }
};
</script>

<template>
  <button @click="spinGacha">Spin Gacha</button>
</template>

<style scoped></style>