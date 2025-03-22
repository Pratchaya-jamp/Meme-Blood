<script setup>
import { editItem,addItem,deleteItemById } from '@/lib/fetchUtils';
import { computed, ref,watch, watchEffect } from 'vue'
import GameManager from '../GameManager.vue';
import GameLobby from '../UI/GameLobby.vue';
const inventoryProp = defineProps({
    inventory:{
        type:Array,
        required: true
    },
    cards: {
        type: Array,
        required: true
    },
    decks: {
        type: Array,
        required: true
    },
    characters: {
        type: Array,
        required: true
    },
    currentUser: {
        type: Object,
        required: true
    }
})
const emit = defineEmits(['deckAdded'])
const selectedDeck = ref()
const deckDetails = ref()
const selectedInventoryCards = ref([]);
const addCard = ref(false)
const removeCard = ref(false)
const lobbyPageStatus = ref(false)

const inventoryDetails = computed(() => { //เรียกของในiventory
    return inventoryProp.inventory.map(item => ({
        deckid: item.deckid,
        card: item.cardid.map(id => inventoryProp.cards.find(card => card.idcard === id)?.idcard || 'N/A'),
        deck: item.deckid.map(id => inventoryProp.decks.find(deck => deck.deckid === id)?.deckid || 'N/A'),
        character: item.characterid.map(id => inventoryProp.characters.find(char => char.idcharacter === id)?.idcharacter || 'N/A')
    }))
})
const uniqueDecks = computed(() => { //เรียกdeckในinventoryของuser
    if (!inventoryProp.currentUser) return []

    const userInventory = inventoryProp.inventory.find(inv => inv.uid === inventoryProp.currentUser.uid)
    
    if (!userInventory || !userInventory.deckid) return []

    return inventoryProp.decks
        .filter(deck => userInventory.deckid.includes(deck.deckid))
        .map(deck => deck.deckid)
})

watch(() => inventoryProp.inventory, (newInventory) => {
    if (!inventoryProp.currentUser) return

    const userInventory = newInventory.find(inv => inv.uid === inventoryProp.currentUser.uid)

    if (userInventory && userInventory.deckid) {
        uniqueDecks.value = inventoryProp.decks
            .filter(deck => userInventory.deckid.includes(deck.deckid))
            .map(deck => deck.deckid);
    } else {
        uniqueDecks.value = []
    }
}, { immediate: true, deep: true })

const getCardsInDeck = computed(() => { //เรียกการ์ดที่อยู่ในdeckอีกที
    if (!selectedDeck.value || selectedDeck.value === 'AddDeck') {
        return
    }
    const foundDeck = inventoryProp.decks.find(deck => deck.deckid === selectedDeck.value);
    if (foundDeck && foundDeck.cardid) {
        return foundDeck.cardid.map(cardId => inventoryProp.cards.find(card => card.idcard === cardId))
    }
    return
})

const getCardsInInventory = computed(() =>{ //เรียกcardในinventoryของuser
    const cardsInInventory = inventoryProp.cards.filter(card => inventoryDetails.value.some(inv => inv.card.includes(card.idcard)))
    if(!selectedDeck.value || !getCardsInDeck.value){
        return cardsInInventory
    }
    const cardInDeck = getCardsInDeck.value.map(card => card && card.idcard).filter(id => id !== undefined)
    return cardsInInventory.filter(card => !cardInDeck.includes(card.idcard))
})

const availableCharacters = computed(() => { //เรียกตัวละครในinventoryของuser
    if (!inventoryProp.currentUser) {
            return
        }
    const userInventory = inventoryProp.inventory.find(inv => inv.uid === inventoryProp.currentUser.uid);
    if (!userInventory || !userInventory.characterid) {
            return
        }
    return userInventory.characterid.map(id => inventoryProp.characters
            .find(char => char.idcharacter === id)?.idcharacter)
            .filter(id => id !== undefined)
})

const editingDeck = async () =>{
    if(!selectedDeck.value || selectedInventoryCards.value.length === 0){
        alert('Please select a deck and at least one card from the inventory.')
        return
    }
    if(selectedDeck.value === 'AddDeck'){
       addingDeck()
    }
    else{
        let deckToEdit = inventoryProp.decks.find(deck => deck.deckid === selectedDeck.value)
        if(addCard.value){
            selectedInventoryCards.value.forEach(card => {
            if(!deckToEdit.cardid.includes(card.idcard)){
                deckToEdit.cardid.push(card.idcard)
            }})
            try{
            const editedDeck = await editItem(`${import.meta.env.VITE_APP_URL}/deck`, deckToEdit.id, deckToEdit)
            if (editedDeck) {
                alert('Deck updated successfully')
                setTimeout(() => {
                        selectedInventoryCards.value = []
                        setNormalState()
                    }, 300)
            }
            }catch (error) {
               console.log('Failed to update deck:', error)
            }
        }
        if(removeCard.value){
            deckToEdit.cardid = deckToEdit.cardid.filter(
                cardId => !selectedInventoryCards.value.some(card => card.idcard === cardId)
            )
            try{
                const editedDeck = await editItem(`${import.meta.env.VITE_APP_URL}/deck`, deckToEdit.id, deckToEdit)
                if(editedDeck){
                    alert('Card(s) removed from deck successfully')
                    setTimeout(() => {
                        selectedInventoryCards.value = []
                        setNormalState()
                    }, 300)
                }
                }catch(error){
                   console.log('Failed to remove cards from deck:', error)
                }
            }

            selectedInventoryCards.value = []
            setNormalState()
        }
    }

const addingDeck = async () =>{
    if (selectedInventoryCards.value.length === 0) {
        alert('Please select at least one card to create a new deck.')
        return
    }

    const newDeckId =  Math.floor(1000 + Math.random() * 9000)
        const newDeck = {
        deckid: newDeckId,
        cardid: selectedInventoryCards.value.map(card => card.idcard),
    };

    try {
        const addedDeck = await addItem(`${import.meta.env.VITE_APP_URL}/deck`, newDeck);
        if (addedDeck) {
            console.log(`Deck ${newDeckId} added successfully.`);
            inventoryProp.decks.push(newDeck);
 
            if (inventoryProp.inventory.length > 0 && inventoryProp.currentUser) {
                const userInventoryItem = inventoryProp.inventory.find(inv => inv.uid === inventoryProp.currentUser.uid)
                if (userInventoryItem) {
                    userInventoryItem.deckid = [...(userInventoryItem.deckid || []), newDeckId];

                    try {
                        await editItem(`${import.meta.env.VITE_APP_URL}/inventory`, userInventoryItem.id, userInventoryItem)
                        console.log(`Deck ID ${newDeckId} added to inventory.`)
                    } catch (error){
                        alert('Failed to update inventory with the new deck ID.');
                        console.error("Error updating inventory:", error); // Log the error for debugging
                    }
                }
            }

            selectedDeck.value = newDeckId
            selectedInventoryCards.value = []
        }
    }catch(error){
        console.error('Failed to add new deck:', error); // Log the error for debugging
    }
}
const setAddCard = () =>{
    addCard.value = true
    removeCard.value = false
}

const setRemoveCard = () =>{
    removeCard.value = true
    addCard.value = false
}
const setNormalState = () =>{
    addCard.value = false
    removeCard.value = false
}
const selectInventoryCardFunc = (card) => {
    const index = selectedInventoryCards.value.findIndex(selectedCard => selectedCard.idcard === card.idcard)
    const isInInventory = getCardsInInventory.value.some(invCard => invCard.idcard === card.idcard)
    if(removeCard.value){
        const isInDeck = getCardsInDeck.value.some(deckCard => deckCard && deckCard.idcard === card.idcard)
        if(isInDeck){
            if(index === -1){
                selectedInventoryCards.value.push(card)
            } else {
                selectedInventoryCards.value.splice(index, 1)
            }
        
        } else{
            alert('Please select a card from the deck to remove.')
            return
        }
    } 
    else if(addCard.value){
        if(isInInventory){
            if(index === -1){
                selectedInventoryCards.value.push(card)
            } else{
                selectedInventoryCards.value.splice(index,1)
            }
        } else {
            alert('Please select a card from the inventory to add.')
            return
        }
    }   else if (selectedDeck.value === 'AddDeck') {
        if (isInInventory) {
            if (index === -1) {
                selectedInventoryCards.value.push(card);
            } else {
                selectedInventoryCards.value.splice(index, 1);
            }
        } else {
            alert('Please select a card from the inventory to add.')
            return;
        }
    }
}
const removeSelectedDeck = async () =>{
    if(!selectedDeck.value || selectedDeck.value === 'AddDeck'){
        alert('Please select a deck to remove.');
        return
    }

    const deckIndex = inventoryProp.decks.findIndex(deck => deck.deckid === selectedDeck.value);
    if (deckIndex === -1) {
        alert('Deck not found.');
        return;
    }

    const deckToDelete = inventoryProp.decks[deckIndex];

    try {
        await deleteItemById(`${import.meta.env.VITE_APP_URL}/deck`, deckToDelete.id);
        console.log(`Deck ID ${selectedDeck.value} removed successfully.`);

        if (inventoryProp.inventory.length > 0 && inventoryProp.currentUser) {
            const userInventoryItem = inventoryProp.inventory.find(inv => inv.uid === inventoryProp.currentUser.uid)//ดึงข้อมูลinvก่อนหน้านั้น
            if (userInventoryItem) {
                userInventoryItem.deckid = userInventoryItem.deckid.filter(id => id !== selectedDeck.value);

                try {
                    await editItem(`${import.meta.env.VITE_APP_URL}/inventory`, userInventoryItem.id, userInventoryItem)
                    console.log(`Deck ID ${selectedDeck.value} removed from inventory.`)
                } catch (error) {
                    alert('Failed to update inventory after removing the deck.')
                    console.log('Error updating inventory:', error)
                }
            }
        }

        inventoryProp.decks.splice(deckIndex, 1);

        if (inventoryProp.decks.length > 0) {
            selectedDeck.value = inventoryProp.decks[Math.max(0, deckIndex - 1)].deckid;
        } else {
            selectedDeck.value = null;
        }

    } catch (error) {
        console.error('Error removing deck:', error);
    }
};

const setLobbyPage = () => {
    console.log("Switching to Lobby Page");
    lobbyPageStatus.value = true;
}

watch(selectedDeck, (newDeck) => {
  if (newDeck && newDeck !== "AddDeck") {
    deckDetails.value = inventoryProp.decks.find(deck => deck.deckid === newDeck);
  }
});

watch(uniqueDecks, (newDecks) => {
    if (newDecks.length > 0) {
        selectedDeck.value = null; // ให้ default เป็น null เสมอ
    }
}, { immediate: true })

watchEffect(() => {
    if (inventoryProp.inventory.length > 0 && inventoryProp.decks.length > 0) {
        console.log("Inventory and Decks Loaded:", inventoryProp.inventory, inventoryProp.decks);
    }
});
</script>

<template>
    <div class="inventory-container bg-gray-800 p-6 rounded-lg shadow-lg max-w-full flex-grow" v-if="!lobbyPageStatus" >
      <h2 class="text-2xl font-semibold mb-4 text-center text-white">Player Inventory</h2>
  
      <div v-if="inventoryDetails.length > 0">
        <h3 class="text-lg font-semibold text-white mb-2">Inventory Details:</h3>
        <label for="selectedDeck" class="block text-gray-200 text-sm font-bold mb-2 w-fit">Select Deck:</label>
        <select v-model="selectedDeck" id="selectedDeck" :key="uniqueDecks.length" class="shadow border rounded w-full py-2 px-3 bg-gray-700 text-white border-gray-600">
            <option v-for="deck in uniqueDecks" :key="deck" :value="deck">{{ deck }}</option>
            <option value="AddDeck"> Add Deck </option>
        </select>
  
        <div v-if="selectedDeck && getCardsInDeck && getCardsInDeck.length > 0" class="mt-4 flex flex-wrap gap-4">
          <h4 class="text-lg font-semibold text-white mb-2 w-full">Cards in Selected Deck:</h4>
          <p v-if="removeCard">Remove Card From Deck</p>
          <div v-for="card in getCardsInDeck" :key="card.idcard"
              @click="selectInventoryCardFunc(card)"
              :class="[ 'cursor-pointer relative w-36 h-48 bg-gray-800 border-4 border-gray-600 rounded-lg hover:scale-105 transition-transform',
               selectedInventoryCards.some(selectedCard => selectedCard.idcard === card.idcard) ? 'shadow-lg' : '', 
               addCard && selectedInventoryCards.some(selectedCard => selectedCard.idcard === card.idcard) ? 'bg-green-600' : '', 
               removeCard && selectedInventoryCards.some(selectedCard => selectedCard.idcard === card.idcard) ? 'bg-red-600' : '']">
            <div class="absolute top-2 left-2 bg-yellow-500 text-white text-sm px-2 py-1 rounded">
              ID: {{ card.idcard }}</div>
            <div class="absolute bottom-2 w-full text-center text-sm text-yellow-300 font-semibold">{{ card.cardname }}</div>
          </div>
          <button
                v-if="selectedDeck && selectedDeck !== 'AddDeck'"
                @click="removeSelectedDeck"
                class="bg-red-600 hover:bg-red-800 text-white font-bold py-2 px-4 rounded mt-2">
                Remove Deck
            </button>
        </div>
  
        <button @click="setAddCard" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">Add Card to Deck</button>
        <button @click="setRemoveCard" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">Remove Card from Deck</button>
        <button @click="setNormalState" class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4">Cancel</button>
      </div>
      <ul class="text-white">
        <li v-for="item in inventoryDetails" :key="item.deckid">
          <div class="border-b border-gray-600 pb-2 mb-2">
            <h4 class="text-lg font-semibold text-white mb-2 w-full">Cards in Inventory</h4>
            <p v-if="addCard && selectedDeck === 'AddDeck'">Select cards to create a new deck</p>
            <p v-else-if="addCard">Add Card To Deck</p>
            <div class="flex flex-wrap gap-x-4 gap-y-4">
              <div v-for="card in getCardsInInventory" :key="card.idcard"
                   @click="selectInventoryCardFunc(card)"
                   :class="[ 'cursor-pointer relative w-36 h-48 bg-gray-800 border-4 border-gray-600 rounded-lg hover:scale-105 transition-transform',
                   selectedInventoryCards.some(selectedCard => selectedCard.idcard === card.idcard) ? 'shadow-lg' : '',
                   addCard && selectedInventoryCards.some(selectedCard => selectedCard.idcard === card.idcard) ? 'bg-green-600' : '', 
                   removeCard && selectedInventoryCards.some(selectedCard => selectedCard.idcard === card.idcard) ? 'bg-red-600' : '' ]">
                <div class="absolute top-2 left-2 bg-yellow-500 text-white text-sm px-2 py-1 rounded">
                  ID: {{ card.idcard }}
                </div>
                <div class="absolute bottom-2 w-full text-center text-sm text-yellow-300 font-semibold">
                  {{ card.cardname }}
                </div>
              </div>
            </div>
            <button @click="editingDeck" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">Edited</button>
            <p>Character: <span v-for="char in item.character" :key="char">(ID: {{ char }})</span></p>
          </div>
        </li>
      </ul>
      <button @click="setLobbyPage" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4">Play</button>
    </div>
    <GameLobby 
        :decks="uniqueDecks"
        :characters="availableCharacters" 
        v-if="lobbyPageStatus" />
  </template>
<style scoped></style>