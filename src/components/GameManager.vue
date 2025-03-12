<script setup>
import Hand from "./mainGameComponents/Hand.vue";

// Everytime card in put on table must update data in table -> for card operation (use computed)
</script>

<template>
  <div class="flex items-center justify-center h-screen w-screen gap-20 -my-25 px-20">
    <!-- Left Section (Image & Name) -->
    <div class="flex flex-col items-center mr-auto">
      <img src="../assets/logo.svg" alt="Left Player" class="w-20 h-20" />
      <p class="mt-2 font-bold">Left Player</p>
    </div>

    <!-- Table -->
    <table class="border border-gray-800">
      <tbody>
        <tr v-for="row in 3" :key="row">
          <td v-for="col in 7" :key="col" class="border border-gray-600 w-30 h-40 text-center">
            Row {{ row }} <br> Col {{ col }}
          </td>
        </tr>
      </tbody>
    </table>

    <!-- Right Section (Image & Name) -->
    <div class="flex flex-col items-center ml-auto">
      <img src="../assets/logo.svg" alt="Right Player" class="w-20 h-20" />
      <p class="mt-2 font-bold">Right Player</p>
    </div>
  </div>
  <Hand />
</template>
