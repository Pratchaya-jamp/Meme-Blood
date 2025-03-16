<script setup>
import { ref } from "vue";
import Card from "./Card.vue";

// Define the board with "score", "blank", and card objects for "pawn"
const board = ref([
  ["score", { title: "Knight", imageUrl: "", cost: 2, pawn: 1 }, "blank", "blank", "blank", { title: "Archer", imageUrl: "", cost: 3, pawn: 2 }, "score"],
  ["score", { title: "Mage", imageUrl: "", cost: 4, pawn: 2 }, "blank", "blank", "blank", { title: "Warrior", imageUrl: "", cost: 5, pawn: 1 }, "score"],
  ["score", { title: "Healer", imageUrl: "", cost: 3, pawn: 1 }, "blank", "blank", "blank", { title: "Rogue", imageUrl: "", cost: 2, pawn: 2 }, "score"],
]);

// Function to get Tailwind class for "score" and "blank" cells
const getCellClass = (type) => {
  if (type === "score") return "bg-yellow-500 text-black font-bold ";
  if (type === "blank") return "bg-gray-200";
  return ""; // Empty class for cells that contain cards
};
</script>

<template>
  <div class="flex justify-center items-center my-5">
    <div class="border-4 border-gray-700">
      <table class="border-collapse">
        <tbody>
          <tr v-for="(row, rowIndex) in board" :key="rowIndex">
            <td 
              v-for="(col, colIndex) in row" 
              :key="colIndex"
              class="text-center border border-gray-600 text-2xl w-33 h-45"
              :class="getCellClass(col)"
            >
              <!-- Render Score -->
              <span v-if="col === 'score'">0</span>

              <!-- Render Empty Cells -->
              <span v-else-if="col === 'blank'"></span>

              <!-- Render Card.vue if the cell contains a pawn -->
              <Card v-else 
                :title="col.title" 
                :imageUrl="col.imageUrl" 
                :cost="col.cost" 
                :pawn="col.pawn"
                size="scale-55 -mx-13.5 -my-20.5"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
