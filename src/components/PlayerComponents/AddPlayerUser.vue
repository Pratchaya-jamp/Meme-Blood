<script setup>
import { addItem, getItems } from "@/lib/fetchUtils";
import { ref , onMounted } from "vue";
import playerManger from '../PlayerManager.vue'
import Card from "../mainGameComponents/Card.vue";


const newUser = ref({ uid: null ,username: '', password: ''})
const User = ref()
const userInventory = ref()
const createUserError = ref('')
const createUserSuccess = ref('')
const createPageStatus = ref(true)

onMounted(async () => {
    try{
        User.value = await getItems(`${import.meta.env.VITE_APP_URL}/users`)
        userInventory.value =await getItems(`${import.meta.env.VITE_APP_URL}/inventory`)
        console.log('Get user and inventory complete')
        } catch {
        console.log('Error cannot get users in add player')
        }
    }
)
 const isUidDuplicate = (uidToCheck) => {
  return User.value.some(user => user.uid === uidToCheck)
 }

 const isInvIdDuplicate = (ivnToCheck) => {
     return userInventory.value.some(ivn => ivn.idinventory === ivnToCheck)
 }
 const genId = () =>{
     return Math.floor(1000 + Math.random() * 9000)
 }

const CreateUser = async () => {
    createUserError.value = ''
    createUserSuccess.value = ''

    const trimmedUsername = newUser.value.username.trim()
    const trimmedPassword = newUser.value.password.trim()

    if(!trimmedUsername || !trimmedPassword)
        {
            createUserError.value = 'User And Password Are Required'
            return
    }
    if (User.value.some(user => user.username === trimmedUsername)) {
        createUserError.value = 'Username Cannot be Duplicate'
        return
    }


    else {
        let uid
        let duplicateUid = true
        while(duplicateUid){
            uid = genId()
            duplicateUid = isUidDuplicate(uid)
            if(!duplicateUid){
                console.log('Uid gen complete')
                break
            }
        }
        let idinv
        let duplicateidinv = true
        while(duplicateidinv){
            idinv = genId()
            duplicateidinv = isInvIdDuplicate(idinv)
            if(!duplicateidinv){
                console.log('IvnId gen complete')
                break
            }
        }

        try{
            const userToAdd = {
                uid: uid,
                username: trimmedUsername,
                password: trimmedPassword
            }
            const inventoryToAdd = {
                idinventory: idinv,
                uid: uid,
                cardid:[],
                deckid:[],
                characterid: [111]
            }
            const addedUser = await addItem(`${import.meta.env.VITE_APP_URL}/users`, userToAdd )
            const addedIvn = await addItem(`${import.meta.env.VITE_APP_URL}/inventory`,inventoryToAdd)
            User.value.push(addedUser)
            userInventory.value.push(addedIvn)
            createUserSuccess.value = 'User created successfully'
            newUser.value = { uid: null ,username: '', password: ''}
            createPageStatus.value = false

        } catch {
            createUserError.value = 'Failed to create user'
        }
    }


}


</script>
<template>
    <div class="bg-gray-900 min-h-screen flex items-center justify-center">
        <div v-if="createPageStatus" class="bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md">
            <h2 class="text-2xl font-semibold text-white text-center mb-6">Create Account</h2>
            <div v-if="createUserError"
                class="bg-red-100 border border-red-400
                        text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert">
                <strong class="font-bold">
                    Error!
                </strong>
                <span class="block sm:inline">{{ createUserError }}</span>
            </div>
            <div v-if="createUserSuccess"
                class="bg-green-100 border border-green-400
                text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong class="font-bold">Success!</strong>
                <span class="block sm:inline">{{ createUserSuccess }}</span>
            </div>
            <form @submit.prevent="CreateUser" class="space-y-4">
                <div>
                    <label for="create-username" class="block text-gray-300 text-sm font-bold mb-2">
                        Username:
                    </label>
                    <input
                        v-model="newUser.username"
                        type="text"
                        placeholder="Enter username"
                        class="shadow appearance-none border rounded w-full py-2 px-3
                        leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600">
                </div>
                <div>
                    <label for="create-password" class="block text-gray-300 text-sm font-bold mb-2">
                        Password:
                    </label>
                    <input v-model="newUser.password"
                        type="password"
                        placeholder="Enter password"
                        class="shadow appearance-none border rounded w-full py-2 px-3
                        leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600">
                </div>

                <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                    Create Account
                </button>
            </form>
        </div>
        <playerManger v-if="!createPageStatus"/>
    </div>
</template>

<style scoped>

</style>