<script setup>
import { ref, watch, onMounted } from "vue";
import PlayerCharacter from "./mainGameComponents/PlayerCharacter.vue";
import TableGame from "./mainGameComponents/Table.vue";
import Hand from "./mainGameComponents/Hand.vue";

const currentTurn = ref(1); //player1 & player2
const round = ref(1);
const selectedCard = ref(null);
const data = ref(null);

const gameProps = defineProps({
  player1Deck: {
    type: Number,
    required: true
  },
  player2Deck: {
    type: Number,
    required: true
  },
  playerCharacter1: {
    type: Number,
    required: true
  },
  playerCharacter2: {
    type: Number,
    required: true
  }
})
const board = ref([
  ["score", {pawn1: 2}, "blank", "blank", "blank", "blank", {pawn2: 2}, "score"],
  ["score", {pawn1: 2}, "blank", "blank", "blank", "blank", {pawn2: 2}, "score"],
  ["score", {pawn1: 2}, "blank", "blank", "blank", "blank", {pawn2: 2}, "score"],
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

const playerHands = ref({
  1: [],  // Player 1's hand
  2: [],  // Player 2's hand
});

const updatePlayerHands = (player1Deck, player2Deck) => {
  if (!player1Deck || !player2Deck) return;

  const getPlayerDeck = (deckId) => {
    const deckInfo = data.value.deck.find(d => d.deckid === deckId);
    if (!deckInfo) return [];

    return deckInfo.cardid
      .map(cardId => data.value.card.find(c => c.idcard === cardId)) // Found cards in db.json from deck selected in each player
      .filter(card => card !== undefined); // Remove undefined from not found cards in deck
  };

  const randomCards = (deck, playerSide) => {
    if(deck.length === 0) return;
    
    const randomCards = [];
    const quantityRandCards = 3; // Can define quantity random card from each player
    
    while (randomCards.length < quantityRandCards) {
      const randNum = Math.floor(Math.random() * deck.length);
      
      // Check if index is not already selected
      if (!randomCards.includes(randNum)) {
        randomCards.push(randNum);
      }
    }

    // Distrubute random card to player
    const selectedRandCards = randomCards.map(num => deck[num]);
    playerHands.value[playerSide].push(...selectedRandCards);

    // Remove already distrubute cards from the deck
    deck.filter((_, index) => !randomCards.includes(index));
  };

  const deckP1 = getPlayerDeck(player1Deck);
  const deckP2 = getPlayerDeck(player2Deck);

  randomCards(deckP1, 1);
  randomCards(deckP2, 2);

  // Logging (optional, can be removed in production)
  console.log('Player 1 Hand:', playerHands.value[1]);
  console.log('Player 2 Hand:', playerHands.value[2]);
};

// TODO - change currentTurn upon flip coin include initilize player's hand

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

    // Expand Pawn
    const slot = selectedCard.value.pawnLocations;
    if (slot){
      for(let pawn of slot) {
        cardAbilityOnBoard(rowIndex, colIndex, pawn)
      }
    }

    let arrayLength = 0;  // Define quantity of slot to buff/debuff
    const abilityType = selectedCard.value.abilityType
    if (abilityType !== 'non'){
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
        cardAbilityOnBoard(rowIndex, colIndex, slot, abilityType);
        slots.push(slot) // Test Only 
      }
      console.log(`${selectedCard.value.cardname} => ${abilityType}: ${slots}`);
    }

    // Remove the card from the player's hand
    playerHands.value[currentTurn.value] = playerHands.value[currentTurn.value].filter(c => c.id !== selectedCard.value.id);
    // Clear selection after placing
    selectedCard.value = null; 
  }
};

const cardAbilityOnBoard = (boardRow, boardCol, cardSlot, ability = null) => {
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
  const enemyPawn = `pawn${currentTurn.value === 1 ? 2 : 1}`;
  const boardSlot = board.value[finalRow][finalCol];

  // Expand Pawn on board
  if (typeof boardSlot === "object" && validPawn in boardSlot && !ability) {
    boardSlot[validPawn] += 1; // Increase pawn count
  } else if (boardSlot === "blank" && !ability && !boardSlot.enemyPawn) {
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
watch(board, () => {
  // TODO - count score after not has any pawn on board OR not has card pawnRequired to Place on board
  // if(!board.pawn1 && !board.pawn2){
  //   //TODO calculate score
  //   return;
  // }

  currentTurn.value = currentTurn.value === 1 ? 2 : 1;
  if (currentTurn.value === 1) {
    round.value++; // New round starts
  }

  // updatePlayerHands(gameProps.player1Deck, gameProps.player2Deck)
}, { deep: true });

</script>

<template>
  <div class="flex flex-col items-center">
    <!-- Test Show Card Button -->
    <button
      class="bg-blue-500 p-3 rounded-xl"
      @click="updatePlayerHands(gameProps.player1Deck, gameProps.player2Deck)"
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
        :selectId="gameProps.playerCharacter1"
      >
        <template #image>
          <img src="../assets/logo.svg" alt="Left Player" class="w-24 h-24 rounded-full shadow-lg">  
        </template>
      </PlayerCharacter>

      <!-- Table -->
      <TableGame :currentTurn="currentTurn" :board="board" @placeCard="placeCard" />

      <!-- Right Player -->
      <PlayerCharacter 
        :selectId="gameProps.playerCharacter2"
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
