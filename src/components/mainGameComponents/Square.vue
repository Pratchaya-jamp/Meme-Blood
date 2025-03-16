<script setup>

const squareProp = defineProps({
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
    <!-- Check if square-index -->
    <div
        v-if="squareProp.squareIndex === 1 || squareProp.squareIndex === 7"
        class="bg-yellow-500"
    >
        1
    </div>
    <div
        v-if="squareProp.squareIndex === 1+1 || squareProp.squareIndex === 7-1"
        class="bg-blue-500"
    >
        ♙
    </div>
    <div
        v-if="squareProp.squareIndex > 2 && squareProp.squareIndex < 6"
        class="bg-gray-400"
    >
        
    </div>
</template>

<style scoped></style>