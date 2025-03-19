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
    <div v-if="characters" class="flex-col items-center text-center p-4 shadow-lg rounded-lg bg-white">
        <slot name="name">{{ characters.charatername }}</slot>
        <slot name="image">
            <img :src="`/images/${characters.charatername.toLowerCase()}.png`" :alt="characters.charatername">
        </slot>
        <p>Skill: {{ characters.skill }}</p>
    </div>
    <div v-else>
        Loading character...
    </div>
</template>
