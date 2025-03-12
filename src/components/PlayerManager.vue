<script setup>
import PlayerUser from './PlayerComponents/PlayerUser.vue';
import AddPlayerUser from './PlayerComponents/AddPlayerUser.vue';
import users from '../../data/users.json';
import { ref } from 'vue';

const userAccount = ref(users)
const loginPageStatus = ref(true)
const currentUser = ref(null)
const loginError = ref('');

const addUserAccount = (newUser)=>{
    
}


</script>

<template>
     <div class="player-manager-container bg-gray-900 text-white
      min-h-screen flex flex-col items-center justify-center p-8">
        <h1 class="text-4xl font-bold mb-8 text-center">
            Queen's Blood (Inspired) - Game
        </h1>

        <PlayerUser v-if="currentUser" :user="currentUser" />

        <div v-if="!currentUser" class="auth-container w-full max-w-md">

            <div v-if="LoginPageStatus" class="login-section bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
                <h2  class="text-2xl font-semibold mb-4 text-center text-white">Login</h2>
                <div v-if="loginError" class="bg-red-100 border border-red-400
                 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
                    <strong class="font-bold">Login Error!</strong>
                    <span class="block sm:inline">{{ loginError }}</span>
                </div>
                <form @submit.prevent="LoginUser()" class="space-y-4">
                    <div>
                        <label for="login-username-manager" class="block text-gray-200 text-sm font-bold mb-2">Username:</label>
                        <input  v-model="loginUsername" type="text" id="login-username-manager" placeholder="Enter username" 
                        class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600">
                    </div>
                    <div>
                        <label for="login-password-manager" class="block text-gray-200 text-sm font-bold mb-2">Password:</label>
                        <input  v-model="loginPassword" type="password" id="login-password-manager" placeholder="Enter password" 
                        class="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600">
                    </div>

                    <button type="submit" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                        Login
                    </button>
                </form>
                <div class="mt-4 text-center">
                    <button type="button" @click="SwitchToCreateUser()" class="text-sm text-blue-400 hover:text-blue-300 focus:outline-none">
                        Need an account? Create one
                    </button>
                </div>
            </div>

        </div>
        <AddPlayerUser v-else @user-created="handleUserCreated" />

        <div v-if="currentUser" class="game-logged-in-container w-full max-w-4xl">
            <div class="user-info-bar flex justify-between items-center mb-4">
                <PlayerUser :user="currentUser" />
                <button @click="logoutUser" class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm">
                    Logout
                </button>
            </div>
        </div>
    </div>

</template>

<style scoped></style>