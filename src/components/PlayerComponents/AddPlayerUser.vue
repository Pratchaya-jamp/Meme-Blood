<script setup>
import { ref } from "vue";
import users from '../../../data/users.json'
//const userAccount = [{username: '',password: '',uid:0 }]
const addUserForm = ref({username: '',
                        password: '', 
                        uid: uidGenerate()
                    })
const useremit = defineEmits(['user-created'])
const createUserError = ref('')
const createUserSuccess = ref('')

const uidGenerate = () =>{
    let randomUid;
    do {
        randomUid = Math.floor(1000 + Math.random() * 9000)
    } 
    while (users.some(user => user.uid === randomUid))

    return randomUid;
}
const CreateUser = () =>{
    createUserError.value = '';
    createUserSuccess.value = '';

    if (!addUserForm.value.username || !addUserForm.value.password 
        || addUserForm.value.username === '' || addUserForm.value.password === '' ) {
        createUserError.value = "Username and password are required.";
        return;
    }
    else{
        useremit("user-created",addUserForm)
    }
    addUserForm.value.username = ''; 
    addUserForm.value.password = '';

}

</script>

<template>
     <div class="add-player-user bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 class="text-2xl font-semibold mb-4 text-center text-white">Create Account</h2>

        <div v-if="createUserError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong class="font-bold">Creation Error!</strong>
            <span class="block sm:inline">{{ createUserError }}</span>
        </div>
        <div v-if="createUserSuccess" class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
            <strong class="font-bold">Success!</strong>
            <span class="block sm:inline">{{ createUserSuccess }}</span>
        </div>

        <form @submit.prevent="CreateUser()" class="space-y-4">
            <div>
                <label for="create-username" class="block text-gray-200 text-sm font-bold mb-2">Username:</label>
                <input v-model="addUserForm.username" type="text" id="create-username" placeholder="Enter username" class="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600">
            </div>
            <div>
                <label for="create-password" class="block text-gray-200 text-sm font-bold mb-2">Password:</label>
                <input v-model="addUserForm.password" type="password" id="create-password" placeholder="Enter password" class="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-gray-700 text-white border-gray-600">
            </div>

            <button type="submit" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">
                Create Account
            </button>
        </form>
    </div>
  
</template>

<style scoped>

</style>
