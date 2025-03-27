<script setup>
import { ref, watch, onMounted } from "vue";
import PlayerCharacter from "./mainGameComponents/PlayerCharacter.vue";
import TableGame from "./mainGameComponents/Table.vue";
import Hand from "./mainGameComponents/Hand.vue";
import HeadOrTail from "./mainGameComponents/HeadOrTail.vue";

const currentTurn = ref(1); // Receive number 1 or 2 for player1 & player2
const round = ref(1);
const selectedCard = ref(null);
const data = ref(null);
const isGameEnd = ref(false) // false by default
const skipsInARow = ref(0); // count how many player skip turn

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
  [{scoreP1: 0}, {pawn1: 2}, "blank", "blank", "blank", "blank", {pawn2: 2}, {scoreP2: 0}],
  [{scoreP1: 0}, {pawn1: 2}, "blank", "blank", "blank", "blank", {pawn2: 2}, {scoreP2: 0}],
  [{scoreP1: 0}, {pawn1: 2}, "blank", "blank", "blank", "blank", {pawn2: 2}, {scoreP2: 0}],
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

let deckP1 = [];
let deckP2 = [];

// Add 1 random card to player's hand
const updatePlayerHands = () => {
  if (round.value > 1) {
    getRandomCards(deckP1, currentTurn.value, 1); // Draw one card at the start of each turn
  }
  console.log(`Update deckP1: `, deckP1);
  console.log(`Update deckP2: `, deckP2);
};

const getRandomCards = (deck, playerSide, quantityRandCards) => {
  if (deck.length === 0) return;

  const randomCards = [];
  const numberOfCardsToDraw = Math.min(quantityRandCards, deck.length); // Draw up to the deck size

  while (randomCards.length < numberOfCardsToDraw) {
    const randNum = Math.floor(Math.random() * deck.length);

    if (!randomCards.includes(randNum)) {
      randomCards.push(randNum);
    }
  }

  const selectedRandCards = randomCards.map(num => deck[num]);
  playerHands.value[playerSide].push(...selectedRandCards);

  randomCards.sort((a, b) => b - a);
  for (let index of randomCards) {
    deck.splice(index, 1);
  }
};

const initCardPlayerHands = (player1Deck, player2Deck) => {
  isGameEnd.value = false;
  if (!player1Deck || !player2Deck) return;

  const getPlayerDeck = (deckId) => {
    const deckInfo = data.value.deck.find(d => d.deckid === deckId);
    if (!deckInfo) return [];

    return deckInfo.cardid
      .map(cardId => data.value.card.find(c => c.idcard === cardId))
      .filter(card => card !== undefined);
  };

  deckP1 = getPlayerDeck(player1Deck);
  deckP2 = getPlayerDeck(player2Deck);

  getRandomCards(deckP1, 1, 4); // Draw 4 cards for player 1
  getRandomCards(deckP2, 2, 4); // Draw 4 cards for player 2

  console.log('Player 1 Hand:', playerHands.value[1]);
  console.log('Player 2 Hand:', playerHands.value[2]);
};

// Player who start first (Receive from HeadOrTail.vue)
const flipCoin = (playerTurn) => {
  currentTurn.value = playerTurn;
  initCardPlayerHands(gameProps.player1Deck, gameProps.player2Deck);
  skipsInARow.value = 0; // Reset skips at the beginning
};

// Select a card from Hand (Receive from Hand.vue)
const selectCard = (card) => {
  selectedCard.value = card;
};

// Place a Card on the Board then Remove from Hand (receive from Table.vue)
const placeCard = (rowIndex, colIndex) => {
  const boardSlot = board.value[rowIndex][colIndex];
  const validPawn = `pawn${currentTurn.value}`;

  // Check selectCard not null & pawnsRequired
  if (!selectedCard.value || Number(boardSlot[validPawn]) < Number(selectedCard.value.pawnsRequired)) {
    return;
  }

  if (typeof boardSlot === "object" && validPawn in boardSlot) {
    // Replace card on pawn
    board.value[rowIndex][colIndex] = { ...selectedCard.value, player: currentTurn.value };
    skipsInARow.value = 0;

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

    changeTurn();
  }
};

// Pawn, Buff and Debuff of card
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
  const cardRow = Math.floor((cardSlot - 1) / cardCols);
  const cardCol = (cardSlot - 1) % cardCols;

  // Compute offset from card center (slot 13 is center, index [2,2])
  const rowOffset = cardRow - 2;
  const colOffset = cardCol - 2;

  // Calculate final board position
  const finalRow = boardRow + rowOffset;
  const finalCol = boardCol + colOffset;

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
    if ((boardSlot[validPawn] || 0) < 3) { // Check if pawn count is less than 3
      boardSlot[validPawn] = (boardSlot[validPawn] || 0) + 1; // Increase pawn count
    }
  } else if (boardSlot === "blank" && !ability && !boardSlot.enemyPawn) {
    board.value[finalRow][finalCol] = { [validPawn]: 1 }; // Replace a new one if empty
  }

  // Buff Card on board
  if (typeof boardSlot === "object" && !(validPawn in boardSlot) && boardSlot !== "blank" && ability === "buff") {
    board.value[finalRow][finalCol].Power = (board.value[finalRow][finalCol].Power || 0) + 1; // Increase power or score in card
  }

  // Debuff Card on board
  if (typeof boardSlot === "object" && !(validPawn in boardSlot) && boardSlot !== "blank" && ability === "debuff") {
    board.value[finalRow][finalCol].Power = (board.value[finalRow][finalCol].Power || 0) - 1; // Decrease power or score in card

    if ((board.value[finalRow][finalCol].Power || 0) < 0) {
      board.value[finalRow][finalCol].Power = 0;
    }
  }
};

const scores = ref({ 1: 0, 2: 0 }); // Store Player 1 & 2 scores

const canPlaceCard = (card) => {
  return board.value.some(row => 
      row.some(slot => 
        typeof slot === "object" && slot[`pawn${currentTurn.value}`] >= card.pawnsRequired
    )
  );
};

const calculateScore = () => {
  let totalScoreP1 = 0;
  let totalScoreP2 = 0;

  board.value.forEach(row => {
    let rowPowerP1 = 0;
    let rowPowerP2 = 0;

    row.forEach(slot => {
      if (typeof slot === "object" && slot.player) {
        if (slot.player === 1) {
          rowPowerP1 += slot.Power || 0;
        } else if (slot.player === 2) {
          rowPowerP2 += slot.Power || 0;
        }
      }
    });

    // Update score in the specific score objects at the beginning and end of the row
    if (typeof row[0] === "object" && row[0].scoreP1 !== undefined) {
      row[0].scoreP1 = rowPowerP1;
    }
    if (typeof row[row.length - 1] === "object" && row[row.length - 1].scoreP2 !== undefined) {
      row[row.length - 1].scoreP2 = rowPowerP2;
    }

    // Determine row winner and add to total score
    if (rowPowerP1 > rowPowerP2) {
      totalScoreP1 += rowPowerP1;
    } else if (rowPowerP2 > rowPowerP1) {
      totalScoreP2 += rowPowerP2;
    }
  });

  // Set total scores
  scores.value[1] = totalScoreP1;
  scores.value[2] = totalScoreP2;

  // Check game end conditions
  const hasPlayableCards = playerHands.value[1].some(card => canPlaceCard(card)) ||
                            playerHands.value[2].some(card => canPlaceCard(card));

  const skippedConsecutively = skipsInARow.value === 2;

  if (!hasPlayableCards || skippedConsecutively) {
    isGameEnd.value = true;
    console.log(`🎉 Game Over! Final Scores → Player 1: ${totalScoreP1}, Player 2: ${totalScoreP2}`);
  }
};
const turnCounter = ref(0);

// Change turn after placeCard
const changeTurn = () => {
  currentTurn.value = currentTurn.value === 1 ? 2 : 1;
  turnCounter.value++; // Count each turn

  if (turnCounter.value % 2 === 0) {
    round.value++; // New round starts
  }

  updatePlayerHands();
  calculateScore();
};

const skipTurn = () => {
  const previousTurn = currentTurn.value;
  currentTurn.value = currentTurn.value === 1 ? 2 : 1;
  turnCounter.value++;
  skipsInARow.value++; // Increment skips

  if (turnCounter.value % 2 === 0) {
    round.value++;
  }

  if (skipsInARow.value === 2) {
    isGameEnd.value = true;
    calculateScore(); // Calculate score when game ends due to skips
    return; // Prevent further actions if game ended
  }

  updatePlayerHands();
  calculateScore();
  selectedCard.value = null; // Clear any selected card when skipping
};

</script>

<template>
  <HeadOrTail @playerTurn="flipCoin" />

  <div class="flex flex-col items-center">
    <div class="text-2xl font-bold mt-4">
      <span>Round: {{ round }}</span>
      <span class="ml-4" :class="currentTurn === 1 ? 'text-blue-500' : 'text-red-500'">
        Player {{ currentTurn }}'s Turn
      </span>
    </div>

    <div class="flex gap-15 items-center justify-center">
      <PlayerCharacter
        :selectId="gameProps.playerCharacter1"
      >
      </PlayerCharacter>

      <TableGame :currentTurn="currentTurn" :board="board" @placeCard="placeCard" />

      <PlayerCharacter
        :selectId="gameProps.playerCharacter2"
      >
      </PlayerCharacter>
    </div>

    <div class="flex gap-16 mt-5">
      <Hand v-if="currentTurn === 1" :player="1" :currentTurn="currentTurn" :hand="playerHands[1]" @selectCard="selectCard" />
      <Hand v-if="currentTurn === 2" :player="2" :currentTurn="currentTurn" :hand="playerHands[2]" @selectCard="selectCard" />
      <button
        class="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
        @click="skipTurn"
      >
      Skip Turn
      </button>
    </div>
  </div>

  <div
    v-if="isGameEnd"
    class="fixed inset-0 flex flex-col justify-center items-center z-20 w-screen h-screen bg-gray-800/90 mt-6 text-2xl font-bold text-center"
  >
    <p class="text-blue-500">Player 1 Score: {{ scores[1] }}</p>
    <p class="text-red-500">Player 2 Score: {{ scores[2] }}</p>

    <p v-if="scores[1] > scores[2]" class="text-green-500 mt-4">🏆 Player 1 Wins!</p>
    <p v-else-if="scores[2] > scores[1]" class="text-green-500 mt-4">🏆 Player 2 Wins!</p>
    <p v-else class="text-gray-400 mt-4">🤝 It's a Tie!</p>
  </div>
</template>