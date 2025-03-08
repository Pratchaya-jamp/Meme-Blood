<script setup>
import Card from './Card.vue'

const laneProp = defineProps({
    compontents : {
        Card
    },
    handCards : {
        type : Array,
        require:true
    }
})
</script>

<template>

</template>

<style scoped></style>