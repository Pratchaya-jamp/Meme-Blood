<script setup>
const cardProps = defineProps({
    title : {
        type: String,
        require: true
    },
    cost : {
        type: Number,
        require: true
    },
    imageUrl : {
        type: String,
        require: false
    }
})
</script>

<template>
<div class="relative w-60 h-90 bg-gray-800 border-4 border-gray-600 rounded-lg shadow-lg scale-80 origin-bottom"> <!-- height & weight = 2:3 => "w-60 h-90" -->
    <!-- Card Top Icons -->
    <div class="absolute top-2 left-2 w-6 h-6 bg-yellow-500 text-black flex items-center justify-center rounded">
      ♙
    </div>
    <div class="absolute top-2 right-2 w-8 h-8 bg-yellow-500 text-black text-xl font-bold flex items-center justify-center rounded-full">
      {{ cardProps.cost }}
    </div>

    <!-- Image -->
    <img :src="cardProps.imageUrl" alt="Card Image" class="w-full h-48 object-cover rounded-t-lg" />

    <!-- Grid (Placeholder) -->
    <div class="flex justify-center py-4">
      <div class="grid grid-cols-5 gap-0.5">
        <template v-for="i in 25" :key="i">
          <div
            class="w-4 h-4 border border-gray-600"
            :class="{ 'bg-yellow-400': [7, 11, 13, 17, 19].includes(i) }"
          ></div>
        </template>
      </div>
    </div>

    <!-- Title -->
    <div class="absolute bottom-2 w-full text-center text-lg text-yellow-300 font-semibold">
      {{ cardProps.title }}
    </div>
  </div>
</template>

<style scoped></style>