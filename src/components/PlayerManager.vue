<script setup>
import PlayerUser from './PlayerComponents/PlayerUser.vue';
import AddPlayerUser from './PlayerComponents/AddPlayerUser.vue';
import PlayerInventory from './PlayerComponents/PlayerInventory.vue';
import { ref, computed ,onMounted } from 'vue';
import { getItems } from '@/lib/fetchUtils';
import mainMenu from './UI/mainMenu.vue';

const userAccount = ref([])
const loginPageStatus = ref(true)
const currentUser = ref(null)
const loginUsername = ref('')
const loginPassword = ref('')
const loginError = ref('')
const mainMenuStatus = ref(false)
const createUserStatus = ref(false)

onMounted(async () => {
    try{
        userAccount.value = await getItems(`${import.meta.env.VITE_APP_URL}/users`)
        console.log('Get user complete')
    }
    catch{
        console.log('Error cannot get users in player manager')
    }

})
const switchMainmenu = () =>{
    mainMenuStatus.value=true
    loginPageStatus.value=false
}

const loginUser = async() => {
    //login script
    const user = userAccount.value.find(user => user.username === loginUsername.value &&
        user.password === loginPassword.value)
    if(user){
        currentUser.value = user
        loginUsername.value = ''
        loginPassword.value = ''
        await loadInventoryData()
        console.log(currentUser.value)
    }
    else{
        loginError.value = 'Invalid username or password'
    }

}

//Inventory
const inventories = ref([])
const cards = ref([])
const decks = ref([])
const characters = ref([])
const loadInventoryData = async() => {
    try {
        inventories.value = await getItems(`${import.meta.env.VITE_APP_URL}/inventory`)
        cards.value = await getItems(`${import.meta.env.VITE_APP_URL}/card`)
        decks.value = await getItems(`${import.meta.env.VITE_APP_URL}/deck`)
        characters.value = await getItems(`${import.meta.env.VITE_APP_URL}/character`)
        loginPageStatus.value = false
        console.log('Game data loaded successfully')
    } catch (error) {
        console.error('Error loading game data: ', error)
    }
}

const userInventory = computed(() => {
    if (!currentUser.value) return []
    return inventories.value.filter(inv => inv.uid === currentUser.value.uid)
})

//CreateUser
const SwitchToCreateUser = () =>{
    loginPageStatus.value = false
    createUserStatus.value = true
}

const SwitchToLogin = () => {
  loginPageStatus.value = true;
 }

</script>

<template>
   <div class="player-manager-container bg-gray-900 text-white
   min-h-screen flex flex-col items-center justify-center p-8" v-if="loginPageStatus">

   <PlayerUser v-if="currentUser" :user="currentUser" />

   <div v-if="!currentUser" class="auth-container w-full max-w-md">

    <div v-if="loginPageStatus" class="login-section bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
        <h1 class="text-4xl font-bold mb-8 text-center">
             война(Voyna) Of Meme
        </h1>
     <h2  class="text-2xl font-semibold mb-4 text-center text-white">Login</h2>
     <div v-if="loginError" class="bg-red-100 border border-red-400
      text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
      <strong class="font-bold">Login Error!</strong>
      <span class="block sm:inline">{{ loginError }}</span>
     </div>
     <form @submit.prevent="loginUser()" class="space-y-4">
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
     <button type="button" @click="switchMainmenu()" class="text-sm text-blue-400 hover:text-blue-300 focus:outline-none">
       Back To Menu
      </button>
    </div>

   </div>
  </div>
  <div v-if="currentUser" class="game-logged-in-container w-full h-screen flex flex-col">
  <div class="user-info-bar flex justify-between items-center mb-4">
    <PlayerUser :user="currentUser" />
    <button
      @click="logoutUser"
      class="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline text-sm">
      Logout
    </button>
  </div>
  <PlayerInventory
      :inventory="userInventory"
      :cards="cards"
      :decks="decks"
      :characters="characters"
      class="flex-1 overflow-y-auto"/>
  </div>

  <mainMenu v-if="mainMenuStatus"/>
  <AddPlayerUser v-if="createUserStatus"/>

</template>

<style scoped></style>