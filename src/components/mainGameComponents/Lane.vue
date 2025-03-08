<script setup>
import Square from './Square.vue';

const laneProp = defineProps({
    compontents : {
        Square
    },
    laneIndex : {
        type : Number,
        require:true
    }
})
</script>

<template>

</template>

<style scoped></style>