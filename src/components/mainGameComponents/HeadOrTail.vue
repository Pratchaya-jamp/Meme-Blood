<script setup>
import { ref } from 'vue';
const coin = ['Head', 'Tail']

const result = ref(null)

const flipCoin = () => {
  const randomIndex = Math.floor(Math.random() * 2)
  result.value = coin[randomIndex]
  console.log(result.value)
}
</script>
 
<template>
<div class="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h2 class="text-2xl font-bold mb-4">Head or Tail?</h2>
    
    <button 
      @click="flipCoin"
      class="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition"
    >
      Flip the Coin
    </button>

    <div v-if="result" class="mt-6 text-center">
      <p class="text-xl font-semibold">{{ result }}</p>
    </div>
  </div>
</template>
 
<style scoped>

</style>