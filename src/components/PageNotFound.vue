<script setup>

</script>

<template>
    <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-gray-800 text-center">
    <h1 class="text-6xl font-bold">404</h1>
    <p class="text-xl mt-4">Sorry Page Not Found. Go Away !!!</p>
    <router-link 
        :to="{name: 'MainMenu'}"
        class="mt-6 px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
        >
        Back To Menu
    </router-link>
  </div>
</template>
