<script setup>
const inventoryProp = defineProps({
    inventory:{
        type:Array,
        require:true
    }
})
</script>

<template>
  <div class="inventory-container bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
    <h2 class="text-2xl font-semibold mb-4 text-center text-white">Player Inventory</h2>

    <div v-if="inventory.length">
      <h3 class="text-lg font-semibold text-white mb-2">Inventory Details:</h3>
      <ul class="text-white">
        <li v-for="item in inventory" :key="item.idinventory">
            Inventory ID: {{ item.idinventory }}
        </li>
      </ul>
    </div>
    <div v-else class="text-gray-400">No inventory found for this user.</div>
  </div>
</template>

<style scoped></style>