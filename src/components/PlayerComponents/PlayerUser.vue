<script setup>
import users from '../../../data/users.json'
const userprop = defineProps({
    users:{
        type:Array,
        require:true,
        validator: (value) => {
            return (
                typeof value.username === 'string' &&
                typeof value.uid === 'number' &&
                value.username !== null && value.username !== ''
            );
        }
    }
})
</script>

<template>
    <div class="player-user text-white">
        <p>Welcome, <span class="font-semibold">{{ userprop.users.username }}</span>!</p>
        <p class="text-sm text-gray-400">User ID: {{ userprop.users.uid }}</p>
    </div>

</template>

<style scoped></style>