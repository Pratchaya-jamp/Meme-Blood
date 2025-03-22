<script setup>
import { defineProps, defineEmits } from "vue";
import Card from "./Card.vue";

const props = defineProps({ 
  currentTurn: {
    type: Number,
    required: true
  }, 
  board: {
    type: Array,
    required: true
  } 
});
const emits = defineEmits(["placeCard"]);

// Place a card only on valid spots (give it to GameManager.vue )
const placeCard = (rowIndex, colIndex) => {
  const cell = props.board[rowIndex][colIndex];
  if (typeof cell === "object" && !('pawn1' in cell) && !('pawn2' in cell)) return; // Prevent replacing exist card
  emits("placeCard", rowIndex, colIndex);
};

// Highlight active pawn spaces
const getCellClass = (col) => {
  if (col === "score") return "bg-yellow-500 text-black font-bold";
  if (col === "blank") return "bg-gray-300";
  
  if ("pawn1" in col && props.currentTurn === 1) return "border-4 border-blue-500";
  if ("pawn2" in col && props.currentTurn === 2) return "border-4 border-red-500";
};

</script>

<template>
  <div class="flex justify-center items-center my-5">
    <div class="border-4 border-gray-700">
      <table class="border-collapse">
        <tbody>
          <tr v-for="(row, rowIndex) in props.board" :key="rowIndex">
            <td
              v-for="(col, colIndex) in row"
              :key="colIndex"
              class="text-center border border-gray-600 text-2xl w-32 h-44"
              :class="getCellClass(col)"
              @click="placeCard(rowIndex, colIndex)"
            >
              <span v-if="col === 'score'">0</span>
              <span v-else-if="col === 'blank'"></span>
              <span v-if="typeof col === 'object' && 'pawn1' in col">
                <span v-for="(v, k) in col.pawn1" :key="k">♙</span>
              </span>
              <span v-if="typeof col === 'object' && 'pawn2' in col">
                <span v-for="(v, k) in col.pawn2" :key="k">♙</span>
              </span>

              <Card
                v-else-if="typeof col === 'object' && !('pawn1' in col) && !('pawn2' in col)"
                :title="col.cardname"
                :imageUrl="`/cards/${col.idcard}.png`"
                :score="col.Power"
                :pawnsRequired="col.pawnsRequired"
                :pawnLocations="col.pawnLocations"
                class="scale-55 -mx-13.5 -my-20.5"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>