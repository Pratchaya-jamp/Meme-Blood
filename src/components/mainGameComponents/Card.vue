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
    cost : {
        type: Number,
        required: true
    },
    pawn: {
      type: Number,
      required: true
    },
    // slots: {
    //   type: Object,
    //   required: true
    // }
})
</script>

<template>
  <div 
    class="relative w-60 h-90 bg-gray-800 border-4 border-gray-600 rounded-lg shadow-lg transition-transform duration-150"
    :class="cardProps.size"
  > <!-- height & weight = 2:3 -->
    <!-- Card Top Icons -->
    <div 
      class="absolute top-2 left-2 bg-yellow-500 text-black text-4xl flex items-center justify-center rounded"
    >
      <div v-for="n in cardProps.pawn" :key="n">
        ♙
      </div>
    </div>
    <div class="absolute top-2 right-2 w-10 h-10 bg-yellow-500 text-black text-2xl font-bold flex items-center justify-center rounded-full">
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
            :class="{ 
              'bg-yellow-400': [7, 11, 17, 19].includes(i),
              'bg-white': i === 13
             }"
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