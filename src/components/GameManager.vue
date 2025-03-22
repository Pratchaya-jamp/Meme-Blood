<script setup>
import { ref, watch, onMounted } from "vue";
import PlayerCharacter from "./mainGameComponents/PlayerCharacter.vue";
import TableGame from "./mainGameComponents/Table.vue";
import Hand from "./mainGameComponents/Hand.vue";

const currentTurn = ref(1); //player1 & player2
const round = ref(1);
const selectedCard = ref(null);
const data = ref(null);
const cardDetails = ref(null);

const gameProps = defineProps({
  deck: {
    type: Object,
    required: true
  }
})
const board = ref([
  ["score", {pawn1: 1}, "blank", "blank", "blank", "blank", {pawn2: 1}, "score"],
  ["score", {pawn1: 1}, "blank", "blank", "blank", "blank", {pawn2: 1}, "score"],
  ["score", {pawn1: 1}, "blank", "blank", "blank", "blank", {pawn2: 1}, "score"],
]);

onMounted(async () => {
  try {
    const response = await fetch('../data/db.json'); // Fetch from public folder
    if (!response.ok) throw new Error("Failed to load data");
    data.value = await response.json();
  } catch (error) {
    console.error("Error fetching data:", error);
  }
});

//TODO - add card on hand after our turn again

//TODO - count score after not has any pawn on board

const playerHands = ref({
  1: [],  // Player 1's hand
  2: [],  // Player 2's hand
});

// Example Player 1
const updatePlayerHands = (deck) => {
  if (!deck || !deck.cardid) return;

  for(let card of deck.cardid){
    cardDetails.value = data.value.card.find(c => c.idcard === card)
    playerHands.value[1].push(cardDetails.value);
  }
  console.log(`playerHands: ${currentTurn.value}`)
  console.log(playerHands.value[1])
};

// TODO - updatePlayerHands will work when flip coin

// Select a card from Hand (receive from Hand.vue)
const selectCard = (card) => {
  selectedCard.value = card;
};

// Place a Card on the Board then Remove from Hand (receive from Table.vue)
const placeCard = (rowIndex, colIndex) => {
  const boardSlot = board.value[rowIndex][colIndex];
  const validPawn = `pawn${currentTurn.value}`;

  // Check selectCard not null & pawnsRequired
  if (!selectedCard.value || boardSlot[validPawn] < selectedCard.value.pawnsRequired ) {
    return;
  }

  if (typeof boardSlot === "object" && validPawn in boardSlot) {
    // Replace card on pawn
    board.value[rowIndex][colIndex] = { ...selectedCard.value, player: currentTurn.value };

    // ----------------------------------------------- //

    const slot = selectedCard.value.pawnLocations;
    // Expand Pawn
    if (slot && slot.pawn){
      for(let pawn of slot.pawn) {
        expandPawnOnBoard(rowIndex, colIndex, pawn)
      }
    }

    let arrayLength = 0;  // Define quantity of slot to buff/debuff
    const rarity = selectedCard.value.cardRarity
    if (rarity === 'Standard') {
      arrayLength = 2
    } else if (rarity === 'Epic') {
      arrayLength = 3
    } else if (rarity === 'Legend') {
      arrayLength = 5
    }

    let randomSlots = [];
    while (randomSlots.length < arrayLength) {
      // Random numbers between 1 and 25
      let randNum = Math.floor(Math.random() * 25) + 1;
      // Check it's not the same
      if (!randomSlots.includes(randNum)) {
        randomSlots.push(randNum);
      }
    }

    let slots = [] // Test Only 
    // Loop through the generated random slots
    for (let slot of randomSlots) {
      expandPawnOnBoard(rowIndex, colIndex, slot, cardDetails.value.abilityType);
      slots.push(slot) // Test Only 
    }
    console.log(`${cardDetails.value.abilityType}: ${slots}`);

    // Remove the card from the player's hand
    playerHands.value[currentTurn.value] = playerHands.value[currentTurn.value].filter(c => c.id !== selectedCard.value.id);
    // Clear selection after placing
    selectedCard.value = null; 
  }
};

const expandPawnOnBoard = (boardRow, boardCol, cardSlot, ability = null) => {
  // Validate inputs
  if (cardSlot < 1 || cardSlot > 25) {
    return;
  }
  if (boardRow < 0 || boardRow >= 3 || boardCol < 0 || boardCol >= 8) {
    return;
  }

  // Grid sizes
  const cardCols = 5;  // 5x5 card grid

  // Convert to 0-based indices
  const cardRow = Math.floor((cardSlot - 1) / cardCols); // ลบ 1 เพราะอัลกอริทึมจับเป็น 0-24 ไม่ใช่ 1-25 หาร 5 เพราะต้องการรู้ row ที่ต้องการวาง card
  const cardCol = (cardSlot - 1) % cardCols; // ลบ 1 เพราะอัลกอริทึมจับเป็น 0-24 ไม่ใช่ 1-25 หาร 5 เพราะต้องการรู้ colume ที่ต้องการวาง card

  // Compute offset from card center (slot 13 is center, index [2,2]) // ความคลาดเคลื่อนจาก slot 13 บน card
  const rowOffset = cardRow - 2; // นับมาจาก 0-2 ดังนั้นตรงนี้คือ index ของ rowOffset
  const colOffset = cardCol - 2; // นับมาจาก 0-2 ดังนั้นตรงนี้คือ index ของ colOffset

  // Calculate final board position ตำแหน่งช่องใน board ที่จะทำการเพิ่ม pawn , buff, debuff
  const finalRow = boardRow + rowOffset;
  const finalCol = boardCol + colOffset;

  // console.log(`BoardRow: ${boardRow}, BoardCol: ${boardCol}, Card: ${cardSlot} | FRow: ${finalRow}, FColumn: ${finalCol}`)

  // Check boundaries (valid board: 3 rows, 8 columns)
  if (finalRow < 0 || finalRow >= 3 || finalCol < 0 || finalCol >= 8) {
    return
  }

  // Get the current turn's pawn type
  const validPawn = `pawn${currentTurn.value}`;
  const boardSlot = board.value[finalRow][finalCol];

  // Expand Pawn on board
  if (typeof boardSlot === "object" && validPawn in boardSlot && !ability) {
    boardSlot[validPawn] += 1; // Increase pawn count
  } else if (boardSlot === "blank" && !ability) {
    board.value[finalRow][finalCol] = { [validPawn]: 1 }; // Replace a new one if empty
  }

  // Buff Card on board
  if (typeof boardSlot === "object" && !(validPawn in boardSlot) && boardSlot !== "blank" && ability === "buff") {
    board.value[finalRow][finalCol].Power += 1; // Increase power or score in card
  }

  // Debuff Card on board
  if (typeof boardSlot === "object" && !(validPawn in boardSlot) && boardSlot !== "blank" && ability === "debuff") {
    board.value[finalRow][finalCol].Power -= 1; // Decrease power or score in card

    if (board.value[finalRow][finalCol].Power < 0) {
      board.value[finalRow][finalCol].Power = 0;
    }
  }
};


// Watch for board array changes then switch turns
board.value.forEach((row, index) => {
  watch(
    () => [...row], // Spread to create a shallow reference
    () => {
      currentTurn.value = currentTurn.value === 1 ? 2 : 1;
      if (currentTurn.value === 1) round.value++;

      //TODO - check on pawn on board to count the score
    }
  );
});

</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Test Show Card Button -->
    <button
      class="bg-blue-500 p-3 rounded-xl"
      @click="updatePlayerHands(gameProps.deck)"
    >
      <b>Show Card</b>
    </button>

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
