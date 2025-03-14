<script setup>
import { addItem, getItems } from "@/lib/fetchUtils";
import { ref , onMounted } from "vue";

const useremit = defineEmits(['user-created'])
const newUser = ref({ uid: null ,username: '', password: ''})
const User = ref([])
const createUserError = ref('')
const createUserSuccess = ref('')

onMounted(async () => {
    try{
        User.value = await getItems(`${import.meta.env.VITE_APP_URL}/users`)
        console.log('Get user complete')
        } catch {
        console.log('Error cannot get users')
        }
    }
)
 const isUidDuplicate = (uidToCheck) => {
  return User.value.some(user => user.uid === uidToCheck)
 }


const CreateUser = async () => {
    createUserError.value = ''
    createUserSuccess.value = ''

    if(!newUser.value.username || !newUser.value.password || 
        newUser.value.username === '' || newUser.value.password === '')
        {
            createUserError.value = 'User And Password Are Required'
            return
    }
    let uid
    let duplicateUid = true
    while(duplicateUid){
        uid = Math.floor(1000 + Math.random() * 9000)
        duplicateUid = isUidDuplicate(uid)
        if(!duplicateUid){
            console.log('Uid gen complete')
            break
        }
    }

    try{
        const userToAdd = {
            uid: uid,
            username: newUser.value.username,
            password: newUser.value.password
        }
        const addedUser = await addItem(`${import.meta.env.VITE_APP_URL}/users`, userToAdd )
        createUserSuccess.value = 'User created successfully'
        useremit('user-created' , addedUser)
        newUser.value = { uid: null ,username: '', password: ''}
    } catch {
        createUserError.value = 'Failed to create user'
    }

}


</script>
<template>
    <div class="add-player-user bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
     <h2 class="text-2xl font-semibold mb-4 text-center text-white">Create Account</h2>
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
        <label for="create-username" class="block text-gray-200 text-sm font-bold mb-2">
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
       <label for="create-password" class="block text-gray-200 text-sm font-bold mb-2">
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
</template>

<style scoped>

</style>
