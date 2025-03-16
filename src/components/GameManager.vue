<script setup>
import Hand from "./mainGameComponents/Hand.vue";
import TableGame from "./mainGameComponents/Table.vue";
import PlayerCharacter from "./mainGameComponents/PlayerCharacter.vue";

// Everytime card in put on table must update data in table -> for card operation (use computed)
</script>

<template>
  <div class="flex items-center justify-center gap-20">
    <!-- Left Player -->
    <PlayerCharacter selectId="1669">
      <template #image>
        <img src="../assets/logo.svg" alt="Left Player" class="w-24 h-24 rounded-full shadow-lg">  
      </template>
    </PlayerCharacter>

    <TableGame />
    
    <!-- Right Player -->
    <PlayerCharacter selectId="9f71">
      <template #image>
        <img src="../assets/logo.svg" alt="Right Player" class="w-24 h-24 rounded-full shadow-lg">  
      </template>
    </PlayerCharacter>
  </div>
  <Hand />
</template>
