<script setup>
import { ref } from "vue";
import Card from "./Card.vue";
import Hand from "./Hand.vue";

// Define the board with "score", "blank", and "pawn" placeholders
const board = ref([
  ["score", { cardname: "Knight", imageUrl: "", Power: 2, pawnsRequired: 1 }, "pawn", "blank", "pawn", { cardname: "Archer", imageUrl: "", Power: 3, pawnsRequired: 2 }, "score"],
  ["score", { cardname: "Mage", imageUrl: "", Power: 4, pawnsRequired: 2 }, "pawn", "blank", "pawn", { cardname: "Warrior", imageUrl: "", Power: 5, pawnsRequired: 1 }, "score"],
  ["score", { cardname: "Healer", imageUrl: "", Power: 3, pawnsRequired: 1 }, "pawn", "blank", "pawn", { cardname: "Rogue", imageUrl: "", Power: 2, pawnsRequired: 2 }, "score"],
]);

// Store the selected card from Hand.vue
const selectedCard = ref(null);

// Function to select a card (called from Hand.vue)
const selectCard = (card) => {
  selectedCard.value = card;
};

// Function to place the selected card on a pawn slot
const placeCard = (rowIndex, colIndex) => {
  if (selectedCard.value && board.value[rowIndex][colIndex] === "pawn") {
    board.value[rowIndex][colIndex] = { ...selectedCard.value }; // Place the card
    selectedCard.value = null; // Clear selection after placing
  }
};

// Function to get Tailwind class for "score" and "blank" cells
const getCellClass = (type) => {
  if (type === "score") return "bg-yellow-500 text-black font-bold";
  if (type === "blank") return "bg-gray-200";
  return ""; // Empty class for cells that contain cards
};
</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Game Board -->
    <div class="border-4 border-gray-700">
      <table class="border-collapse">
        <tbody>
          <tr v-for="(row, rowIndex) in board" :key="rowIndex">
            <td 
              v-for="(col, colIndex) in row" 
              :key="colIndex"
              class="text-center border border-gray-600 text-2xl w-32 h-44"
              :class="getCellClass(col)"
              @click="placeCard(rowIndex, colIndex)"
            >
              <span v-if="col === 'score'">0</span>
              <span v-else-if="col === 'blank'"></span>
              <span v-else-if="col === 'pawn'">♙</span>

              <!-- Render Card.vue if the cell contains a card -->
              <Card v-else 
                :title="col.cardname"
                :imageUrl="col.id"
                :cost="col.Power"
                :pawn="col.pawnsRequired"
                size="scale-55 -mx-13.5 -my-20.5"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Hand Component -->
    <Hand @selectCard="selectCard" />
  </div>
</template>
