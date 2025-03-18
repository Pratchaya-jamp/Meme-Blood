<script setup>
import TableGame from "./mainGameComponents/Table.vue";
import PlayerCharacter from "./mainGameComponents/PlayerCharacter.vue";

// Everytime card in put on table must update data in table -> for card operation (use computed)
</script>

<template>
  <div class="flex items-center justify-center">
    <!-- Left Player -->
    <PlayerCharacter 
      :selectId="111"
      class="-mr-125 -mt-100"
    >
      <template #image>
        <img src="../assets/logo.svg" alt="Left Player" class="w-24 h-24 rounded-full shadow-lg">  
      </template>
    </PlayerCharacter>

    <!-- Table & Hand -->
    <TableGame />
    
    <!-- Right Player -->
    <PlayerCharacter 
      :selectId="112"
      class="-ml-125 -mt-100"
    >
      <template #image>
        <img src="../assets/logo.svg" alt="Right Player" class="w-24 h-24 rounded-full shadow-lg">  
      </template>
    </PlayerCharacter>
  </div>
</template>
