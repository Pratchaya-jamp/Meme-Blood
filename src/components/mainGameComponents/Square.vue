<script setup>
const squareProp = defineProps({
    laneIndex : {
        type : Number,
        require:true
    },
    squareIndex : {
        type : Number,
        require:true
    },
    cardOnBoard : {
        type : Object,
        default: null //ช่องสามารถไม่ว่างการ์ดได้
    }
})
</script>

<template>

</template>

<style scoped></style>