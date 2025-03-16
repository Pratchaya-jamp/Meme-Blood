<script setup>
import Square from './Square.vue';

const laneProp = defineProps({
    laneCollect: {
        type: Array,
        required: true
    },
    laneIndex: {
        type : Number,
        require: true
    }
})

//TODO Loop 7 times from Square
</script>

<template>
    <div
        class="flex items-center"
        v-for="n in 7"
    >
        <Square
            :square-index="n"
            :card-on-board="null"
        />
    </div>
</template>

<style scoped></style>