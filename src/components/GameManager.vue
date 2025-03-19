<script setup>
import { ref, watch } from "vue";
import PlayerCharacter from "./mainGameComponents/PlayerCharacter.vue";
import TableGame from "./mainGameComponents/Table.vue";
import Hand from "./mainGameComponents/Hand.vue";

const currentTurn = ref(1); //player1 & player2
const round = ref(1);
const selectedCard = ref(null);
const board = ref([
  ["score", "pawn1", "blank", "blank", "blank", "blank", "pawn2", "score"],
  ["score", "pawn1", "blank", "blank", "blank", "blank", "pawn2", "score"],
  ["score", "pawn1", "blank", "blank", "blank", "blank", "pawn2", "score"],
]);

// Example each player's hand
const playerHands = ref({
  1: [
    { id: "05ab", cardname: "Success Kid", Power: 1, pawnsRequired: 2 },
    { id: "2471", cardname: "Roll Safe", Power: 2, pawnsRequired: 2 },
    { id: "a825", cardname: "Harambe", Power: 2, pawnsRequired: 2 },
  ],
  2: [
    { id: "b29c", cardname: "Grumpy Cat", Power: 3, pawnsRequired: 2 },
    { id: "c671", cardname: "Doge", Power: 1, pawnsRequired: 1 },
    { id: "d482", cardname: "Pepe", Power: 2, pawnsRequired: 2 },
  ]
});

// Select a card from Hand (receive from Hand.vue)
const selectCard = (card) => {
  selectedCard.value = card;
};

// Place a Card on the Board then Remove from Hand (receive from Table.vue)
const placeCard = (rowIndex, colIndex) => {
  if (!selectedCard.value) return;

  // Place only on player's pawns
  const validPawn = `pawn${currentTurn.value}`;
  if (board.value[rowIndex][colIndex] === validPawn) {
    board.value[rowIndex][colIndex] = { ...selectedCard.value, player: currentTurn.value };

    // Remove the card from the player's hand
    playerHands.value[currentTurn.value] = playerHands.value[currentTurn.value].filter(c => c.id !== selectedCard.value.id);
    // Clear selection after placing
    selectedCard.value = null; 
  }
  console.log(board.value)
};

// Watch for board array changes then switch turns
board.value.forEach((row, index) => {
  watch(
    () => [...row], // Spread to create a shallow reference
    () => {
      currentTurn.value = currentTurn.value === 1 ? 2 : 1;
      if (currentTurn.value === 1) round.value++;
    }
  );
});
</script>

<template>
  <div class="flex flex-col items-center">
    <div class="text-2xl font-bold mt-4">
      <span>Round: {{ round }}</span>
      <span class="ml-4" :class="currentTurn === 1 ? 'text-blue-500' : 'text-red-500'">
        Player {{ currentTurn }}'s Turn
      </span>
    </div>

    <div class="flex gap-15 items-center justify-center">
      <!-- Left Player -->
      <PlayerCharacter 
        :selectId="111"
      >
        <template #image>
          <img src="../assets/logo.svg" alt="Left Player" class="w-24 h-24 rounded-full shadow-lg">  
        </template>
      </PlayerCharacter>

      <!-- Table -->
      <TableGame :currentTurn="currentTurn" :board="board" @placeCard="placeCard" />

      <!-- Right Player -->
      <PlayerCharacter 
        :selectId="112"
      >
        <template #image>
          <img src="../assets/logo.svg" alt="Right Player" class="w-24 h-24 rounded-full shadow-lg">  
        </template>
      </PlayerCharacter>
    </div>

    <div class="flex gap-16 mt-5">
      <Hand :player="1" :currentTurn="currentTurn" :hand="playerHands[1]" @selectCard="selectCard" />
      <Hand :player="2" :currentTurn="currentTurn" :hand="playerHands[2]" @selectCard="selectCard" />
    </div>
  </div>
</template>
