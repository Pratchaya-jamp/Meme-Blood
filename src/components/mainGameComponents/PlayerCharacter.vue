<script setup>
//เเสดงตัวที่playerเลือกเล่น
import { onMounted, ref } from 'vue';
const props = defineProps(['selectId']);
const characters = ref(null);

onMounted(async () => {
    const response = await fetch('data/db.json');
    const data = await response.json();
    characters.value = data.character.find(cha => cha.id === props.selectId);
})
</script>

<template>
    <div v-if="characters" class="character-card">
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
