<script setup>
import { ref } from "vue";
import Card from "./mainGameComponents/Card.vue";
import { useRouter } from 'vue-router';

const router = useRouter();

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
const getCard = ref(null);
const locked = ref(false);
const standardSound = new Audio('/sounds/gacha/standard.mp3')
const epicSound = new Audio('/sounds/gacha/epic.mp3')
const legendSound = new Audio('/sounds/gacha/legend.mp3')

standardSound.volume = 0.1
standardSound.loop = false

epicSound.volume = 0.1
epicSound.loop = false

legendSound.volume = 0.1
legendSound.loop = false

const spinGacha = () => {
  if (!locked.value) {
    locked.value = true;
    const randNum = Math.random() * 100;

    if (randNum <= props.GoldCardRate) {
      const goldCards = props.Gachaitems.filter((card) => card.cardRarity === "Legend");
      getCard.value = goldCards[Math.floor(Math.random() * goldCards.length)];
      legendSound.currentTime = 0
      legendSound.play()
    } else if (randNum <= props.EpicCardRate) {
      const epicCards = props.Gachaitems.filter((card) => card.cardRarity === "Epic");
      getCard.value = epicCards[Math.floor(Math.random() * epicCards.length)];
      epicSound.currentTime = 0
      epicSound.play()
    } else {
      const standardCards = props.Gachaitems.filter((card) => card.cardRarity === "Standard");
      getCard.value = standardCards[Math.floor(Math.random() * standardCards.length)];
      standardSound.currentTime = 0
      standardSound.play()
    }

    if (getCard.value) {
      emit("spinGacha", getCard.value);
    }

    setTimeout(() => {
      locked.value = false;
      router.push({ name: 'Login' }); // Now router should work properly
    }, 2500);
  }
};

const hoverBtnSound = new Audio('/sounds/se/hover.mp3');
hoverBtnSound.volume = 0.1

const playHoverButton = () => {
    hoverBtnSound.currentTime = 0
    hoverBtnSound.play().catch(error => console.log("Sound play error:", error))
}
</script>


<template>
  <div class="fixed inset-0 z-50 flex flex-col items-center justify-center gap-10 min-h-screen backdrop-blur-md">
    <img 
      v-if="!locked"
      class="w-1/3" 
      src="/src/assets/maxwell-cat.gif" 
      alt="maxwell-cat"
    >
    <Card
        v-if="locked"
        :title="getCard.cardname"
        :imageUrl="`/cards/${getCard.idcard}.png`"
        :score="getCard.Power"
        :pawnsRequired="getCard.pawnsRequired"
        :pawnLocations="getCard.pawnLocations"
      />
    <button 
      @mouseenter="playHoverButton"
      @click="spinGacha"
      class="cursor-pointer bg-gradient-to-r from-yellow-600 to-yellow-400 font-bold text-black text-lg px-6 py-3 border-2 border-gray-800
      rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all duration-200"
    >
      Spin Gacha
    </button>
  </div>
</template>
