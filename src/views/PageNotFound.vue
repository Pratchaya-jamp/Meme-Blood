<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
const backHome = () => {
  // router.push({ name: 'Home' })
  router.push({ path: '/' })
}
</script>

<template>
  <div class="flex flex-col p-40 shadow-2xl items-center max-w-lg">
    <p class="text-red-600 font-semibold text-xl">Page Not Found</p>
    <p>please contact your admin.</p>
    <button @click="backHome" class="cursor-pointer underline text-purple-600">
      Back to Homepage
    </button>
  </div>
</template>

<style scoped></style>
