<script setup>
import { ref, onMounted } from "vue";
import PlayerCharacter from "./mainGameComponents/PlayerCharacter.vue";
import TableGame from "./mainGameComponents/Table.vue";
import Hand from "./mainGameComponents/Hand.vue";
import HeadOrTail from "./mainGameComponents/HeadOrTail.vue";
import Gacha from "./Gacha.vue";
import { getItems, editItem } from "@/lib/fetchUtils";
import PlayerInventory from "./PlayerComponents/PlayerInventory.vue";

const currentTurn = ref(1); // Receive number 1 or 2 for player1 & player2
const round = ref(1);
const selectedCard = ref(null);
const data = ref(null);
const isGameEnd = ref(false) // false by default
const skipsInARow = ref(0); // count how many player skip turn
const showGacha = ref(false); // Add showGacha state
const showPlayerInventory = ref(false)


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
  },
  selectedMap: {
    type: String,
    required: true
  },
  currentUser: {
    type: Object,
    required: true,
  },
  allDecks:{
    type:Array,
    required: true
  },
  allCards:{
    type:Array,
    required: true
  },
  userInv:{
    type:Array,
    required: true
  },
  allCharacters: {
    type: Array,
    required: true
  }
})

const board = ref([
  [{scoreP1: 0}, {pawn1: 1}, "blank", "blank", "blank", "blank", {pawn2: 1}, {scoreP2: 0}],
  [{scoreP1: 0}, {pawn1: 1}, "blank", "blank", "blank", "blank", {pawn2: 1}, {scoreP2: 0}],
  [{scoreP1: 0}, {pawn1: 1}, "blank", "blank", "blank", "blank", {pawn2: 1}, {scoreP2: 0}],
]);

onMounted(async () => {
  try {
    const response = await fetch('/data/db.json');
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
  if(round.value > 1) {
    getRandomCards(deckP1, currentTurn.value, 1)
  }
  console.log(`Update deckP1: `, deckP1)
  console.log(`Update deckP2: `, deckP2)
}

const getRandomCards = (deck, playerSide, quantityRandCards) => {
  if(deck.length === 0) return;
  
  // If requesting more cards than card in the deck adjust quantity
  const actualQuantity = Math.min(quantityRandCards, deck.length);
  
  const randomCards = [];
  
  while (randomCards.length < actualQuantity) {
    const randNum = Math.floor(Math.random() * deck.length);
    
    // Check if index is not already selected
    if (!randomCards.includes(randNum)) {
      randomCards.push(randNum);
    }
  }

  // Distribute random card(s) to player
  const selectedRandCards = randomCards.map(num => deck[num]);
  playerHands.value[playerSide].push(...selectedRandCards);

  // Remove already distributed cards in deck
  randomCards.sort((a, b) => b - a); // Sort highest to lowest to prevent index shifting while remove
  for (let index of randomCards) {
    deck.splice(index, 1);
  }
};

// Random 3 cards at begining
const initCardPlayerHands = (player1Deck, player2Deck) => {
  isGameEnd.value = false;
  if (!player1Deck || !player2Deck) return;
  const getPlayerDeck = (deckId) => {
    const deckInfo = data.value?.deck.find((d) => d.deckid === deckId);
    if (!deckInfo) return [];
    return deckInfo.cardid
      .map((cardId) => data.value.card.find((c) => c.idcard === cardId))
      .filter((card) => card !== undefined);
  };
  deckP1 = getPlayerDeck(player1Deck);
  deckP2 = getPlayerDeck(player2Deck);
  getRandomCards(deckP1, 1, 3);
  getRandomCards(deckP2, 2, 3);
  console.log('Player 1 Hand:', playerHands.value[1]);
  console.log('Player 2 Hand:', playerHands.value[2]);

  // Check for character 999 and set starting pawns
  if (gameProps.playerCharacter1 === 999) {
    board.value.forEach((row) => {
      if (typeof row[1] === "object") row[1].pawn1 = 3;
    });
  }
  if (gameProps.playerCharacter2 === 999) {
    board.value.forEach((row) => {
      if (typeof row[6] === "object") row[6].pawn2 = 3;
    });
  }
};


// Player who start first (Receive from HeadOrTail.vue)
const flipCoin = (playerTurn) => {
  currentTurn.value = playerTurn;
  initCardPlayerHands(gameProps.player1Deck, gameProps.player2Deck);
  skipsInARow.value = 0; // Reset skips at the beginning
  playMapTheme();
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

const scores = ref({ 1: 0, 2: 0 }); // Store Player 1 & 2 scores

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

    // Apply buff and debuff effects
    row.forEach(slot => {
      if (typeof slot === "object" && slot.player && slot.Ability) {

        if (slot.abilityType === "buff") {
          if (slot.player === 1) {
            rowPowerP1 += slot.Power;
          } else if (slot.player === 2) {
            rowPowerP2 += slot.Power;
          }

        } else if (slot.abilityType === "debuff") {
          if (slot.player === 1) {
            rowPowerP2 -= slot.Power;
            if (rowPowerP2 < 0) rowPowerP2 = 0;
          } else if (slot.player === 2) {
            rowPowerP1 -= slot.Power;
            if (rowPowerP1 < 0) rowPowerP1 = 0;
          }
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
  const hasPawn = board.value.some(row => 
    row.some(slot => typeof slot === "object" && (slot.pawn1 || slot.pawn2))
  );

  const overSkipped = skipsInARow.value > 4;

  if (overSkipped || !hasPawn) {
    isGameEnd.value = true;
    stopMapTheme()
    setTimeout(() => {
      isGameEnd.value = false;
      showGacha.value = true; // Show Gacha when game ends
    }, 5000);
    
    let winnerCharacter = null
    let isDraw = false
    if (scores.value[1] > scores.value[2]) {
      winnerCharacter = gameProps.playerCharacter1
    } else if (scores.value[2] > scores.value[1]) {
      winnerCharacter = gameProps.playerCharacter2
    } else {
      isDraw = true
    }
  
    if (winnerCharacter) {
      winnerSound = playCharacterWinSound(winnerCharacter)
    } else if (isDraw) {
      playDrawSound()
    }
  
    console.log(`🎉 Game Over! Final Scores → Player 1: ${scores.value[1]}, Player 2: ${scores.value[2]}`)
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
  skipsInARow.value++; // Increment skips

  changeTurn();
  selectedCard.value = null; // Clear any selected card when skipping
};

const spinGacha = async (card) => {
  if (!gameProps.currentUser.uid) {
    console.error("currentUser is undefined or Gacha already spun.");
    return;
  }
  try {
    const inventories = await getItems(`${import.meta.env.VITE_APP_URL}/inventory`);
    const userInventory = inventories.find(
      (inv) => inv.uid === gameProps.currentUser.uid
    );

    if (userInventory) {
      if (!userInventory.cardid.includes(card.idcard)) {
        userInventory.cardid.push(card.idcard);
        await editItem(
          `${import.meta.env.VITE_APP_URL}/inventory`,
          userInventory.id,
          userInventory
        );
        console.log(`Added card ${card.cardname} to inventory`);
      } else {
        console.log(`Card ${card.cardname} already exists in inventory.`);
      }
    } else {
      console.error("User inventory not found.");
    }
  } catch (error) {
    console.error("Error updating inventory:", error);
  }
};

const playCharacterWinSound = (characterId) => {
  if (!characterId) {
    console.error("Character ID not found!")
    return;
  }

  const soundPath = `/sounds/charactersounds/${characterId}.mp3`
  const audio = new Audio(soundPath)
  audio.volume = 0.10
  audio.play()

  return audio
};

const stopWinnerSound = () => {
  if (winnerSound) {
    winnerSound.pause()
    winnerSound.currentTime = 0
    winnerSound = null 
  }
}

const playDrawSound = () => {
  const soundPath = "/sounds/charactersounds/draw.mp3"
  const audio = new Audio(soundPath);
  audio.volume = 0.10;
  audio.play();
}

const mapThemeAudio = ref(null)

const playMapTheme = () => {
  if (!gameProps.selectedMap) {
    console.error("No map selected!")
    return
  }

  let mapName = gameProps.selectedMap.split('/').at(-1)
  if (mapName.includes('.')) {
    mapName = mapName.split('.')[0]
  }

  const themePath = `/sounds/mapthemes/${mapName}.mp3`
  console.log("🎵 Theme Path:", themePath)

  if (mapThemeAudio.value) {
    mapThemeAudio.value.pause()
    mapThemeAudio.value = null
  }

  mapThemeAudio.value = new Audio(themePath)
  mapThemeAudio.value.loop = true;
  mapThemeAudio.value.volume = 0.03;
  mapThemeAudio.value.play().catch(error => {
    console.error("🔇 Audio Play Error:", error)
  })
}

const stopMapTheme = () => {
  if (mapThemeAudio.value) {
    console.log("Stopping map theme...")
    mapThemeAudio.value.pause();
    mapThemeAudio.value.currentTime = 0
    mapThemeAudio.value = null
  } else {
    console.log("No audio to stop")
  }
};
const closeGacha = () => {
  showGacha.value = false;
  showPlayerInventory.value = true;
};
</script>

<template>
  <template v-if="!showPlayerInventory">
    <HeadOrTail @playerTurn="flipCoin" />
    <img
      :src="selectedMap"
      alt="background"
      class="fixed w-screen h-screen"
    />

    <div class="flex flex-col items-center -mt-10 z-10 overflow-hidden">
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

      <!-- Right Player -->
      <PlayerCharacter 
        :selectId="gameProps.playerCharacter2"
      >
      </PlayerCharacter>
    </div>
    <div class="flex items-center transition-all duration-300 -mt-10 hover:-mt-35">
      <Hand v-if="currentTurn === 1" :player="1" :currentTurn="currentTurn" :hand="playerHands[1]" @selectCard="selectCard" />
      <Hand v-if="currentTurn === 2" :player="2" :currentTurn="currentTurn" :hand="playerHands[2]" @selectCard="selectCard" />
      <div class="flex flex-col items-center">
        <button
          class="bg-red-900 hover:bg-red-800 text-white font-bold px-4 py-8 rounded-3xl border-4 border-black"
          @click="skipTurn"
        >
          {{ skipsInARow < 4 ? 'Skip Turn' : 'Surrender' }}
        </button>
        <p
          v-if="skipsInARow < 4" 
          class="font-bold text-red-400"
        >
        Remain: {{ 4 - skipsInARow }}
        </p>
      </div>
    </div>
  </div>

  <!-- END GAME -->
  <div
    v-if="isGameEnd"
      class="fixed inset-0 flex flex-col gap-5 justify-center items-center z-50 w-screen h-screen bg-gray-800/90 text-2xl font-bold text-center"
    >
      <p v-if="scores[1] > scores[2]" class="text-green-500 text-4xl mt-5">🏆 Player 1 Wins!</p>
      <PlayerCharacter
        v-if="scores[1] > scores[2]"
        :selectId="gameProps.playerCharacter1"
      >
      </PlayerCharacter>

      <p v-if="scores[2] > scores[1]" class="text-green-500 text-4xl mt-5">🏆 Player 2 Wins!</p>
      <PlayerCharacter
        v-if="scores[2] > scores[1]"
        :selectId="gameProps.playerCharacter2"
      >
      </PlayerCharacter>

      <p v-if="scores[2] === scores[1]" class="text-gray-400 text-4xl my-5">It's a Tie!</p>
      <div
        v-if="scores[2] === scores[1]"
        class="flex justify-center items-center gap-5 mb-5"
      >
        <PlayerCharacter
          :selectId="gameProps.playerCharacter1"
        >
        </PlayerCharacter>

        <span class="text-gray-400 text-9xl">🤝</span>

        <PlayerCharacter
          :selectId="gameProps.playerCharacter2"
        >
        </PlayerCharacter>
      </div>

      <div>
        <p class="text-blue-500">Player 1 Score: {{ scores[1] }}</p>
        <p class="text-red-500">Player 2 Score: {{ scores[2] }}</p>
      </div>
    </div>

    <Gacha
      v-if="showGacha"
      :Gachaitems="data?.card || []"
      :GoldCardRate="1"
      :EpicCardRate="20"
      :inventory="gameProps.userInv"
      :cards="gameProps.allCards"
      :current-user="gameProps.currentUser"
      :decks="gameProps.allDecks"
      :characters="gameProps.allCharacters"
      @spinGacha="spinGacha"
      @closeGacha="closeGacha"
    />
  </template>
  <PlayerInventory
    v-if="showPlayerInventory"
    :inventory="gameProps.userInv"
    :cards="gameProps.allCards"
    :decks="gameProps.allDecks"
    :characters="gameProps.allCharacters"
    :currentUser="gameProps.currentUser"
  />
</template>
