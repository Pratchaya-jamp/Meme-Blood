<script setup>
const usersprop = defineProps({
    user:{
        type:Array,
        require:true,
        validator: (value)=>{
            if(!Array.isArray(value)){
                return false
            }
            return value.every(user => {
                return (
                    typeof user.username === 'string' &&
                    typeof user.password === 'string' &&
                    typeof user.uid === 'number'&&
                    user.username !== null && user.username !== '' &&
                    user.password !== null && user.password !== ''
                )
            })
        }

    }
})
</script>

<template>

</template>

<style scoped></style>