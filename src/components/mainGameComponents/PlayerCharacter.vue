<script setup>
//เเสดงตัวที่playerเลือกเล่น
import { onMounted, ref } from 'vue';
const props = defineProps(['selectId']);
const characters = ref(null);

onMounted(async () => {
    const response = await fetch('data/db.json');
    const data = await response.json();
    characters.value = data.character.find(cha => cha.idcharacter === props.selectId);
})
</script>

<template>
    <div 
      v-if="characters" 
      class="relative w-50 h-60 bg-gray-800 border-4 border-gray-600 rounded-lg shadow-lg transition-transform duration-150 flex flex-col items-center p-4 text-yellow-300"
    >
      <!-- Character Image -->
      <div class="relative w-full h-40 flex justify-center items-center">
        <slot name="image">
            <img 
              :src="`/images/${characters.charatername.toLowerCase()}.png`" 
              :alt="characters.charatername" 
              class="w-24 h-24 rounded-full border-2 border-yellow-500"
            />
        </slot>
      </div>
      
      <!-- Character Name -->
      <div class="text-lg font-bold">
        <slot name="name">{{ characters.charatername }}</slot>
      </div>
  
      <!-- Skill -->
      <div class="mt-2 text-sm bg-gray-700 px-2 py-1 rounded-lg border border-yellow-500">
        Skill: {{ characters.skill }}
      </div>
    </div>
  
    <div v-else class="text-center text-white py-4">
      Loading character...
    </div>
</template>
