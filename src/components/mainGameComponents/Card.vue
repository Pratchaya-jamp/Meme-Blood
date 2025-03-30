<script setup>
const cardProps = defineProps({
    title : {
        type: String,
        required: true
    },
    imageUrl : {
        type: String,
        required: false
    },
    score : {
        type: Number,
        required: true
    },
    pawnsRequired: {
      type: String,
      required: true
    },
    pawnLocations: {
      type: Array,
      required: true
    }
})
</script>

<template>
  <div 
    class="relative w-60 h-90 bg-gray-800 border-4 border-gray-600 shadow-lg transition-transform duration-150"
    :class="cardProps.size"
  > <!-- height & weight = 2:3 -->
  
    <!-- Card Top Icons -->
    <div 
      class="absolute top-2 left-2 bg-yellow-500 text-black text-4xl flex items-center justify-center rounded z-15"
    >
      <div v-for="n in parseInt(cardProps.pawnsRequired)" :key="n">
        ♙
      </div>
    </div>
    <div class="absolute top-1.5 right-1.5 w-12 h-12 bg-gray-700 text-2xl text-yellow-500 font-bold flex items-center justify-center rounded-full z-10">
      {{ cardProps.score }}
    </div>

    <div class="relative w-full h-full">
      <!-- Image (Background) -->
      <img 
        :src="cardProps.imageUrl" 
        alt="Card Image" 
        class="absolute inset-0 w-full h-full z-0 rounded-lg"
      />

      <!-- Grid (Foreground, Centered at Bottom) -->
      <div class="absolute bottom-15 left-1/2 -translate-x-1/2 z-10">
        <div class="grid grid-cols-5 gap-1 bg-black p-1">
          <template v-for="i in 25" :key="i">
            <div
              class="w-3.5 h-3.5 bg-gray-600"
              :class="{ 
                'bg-yellow-400': cardProps.pawnLocations.includes(i),
                'bg-white': i === 13
              }"
            ></div>
          </template>
        </div>
      </div>
    </div>

    <!-- Title -->
    <div class="absolute bottom-2 w-full text-center text-lg text-yellow-300 font-semibold">
      <!-- {{ cardProps.title }} -->
    </div>
  </div>
</template>

