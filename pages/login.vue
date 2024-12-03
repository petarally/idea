<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useNuxtApp } from "#app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Form state
const email = ref("");
const password = ref("");
const error = ref("");

// Get Firebase app and router from Nuxt context
const { $fire } = useNuxtApp();
const router = useRouter();

let auth;
try {
  auth = getAuth($fire);
} catch (e) {
  console.error("Error initializing Firebase Auth: ", e);
  error.value = "Error initializing Firebase Auth.";
}

// Handle form submission
const login = async () => {
  error.value = ""; // Clear previous errors
  if (!auth) {
    error.value = "Authentication not initialized.";
    return;
  }

  try {
    await signInWithEmailAndPassword(auth, email.value, password.value);
    alert("Uspješna registracija!"); // Show popup message
    router.push("/add-realty"); // Redirect to add realty page after successful login
  } catch (e) {
    error.value = "Invalid email or password";
    console.error("Error logging in: ", e);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center">Login</h1>
      <form @submit.prevent="login">
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
            >Email</label
          >
          <input
            type="email"
            id="email"
            v-model="email"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
          />
        </div>
        <div class="mb-6">
          <label
            for="password"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Password</label
          >
          <input
            type="password"
            id="password"
            v-model="password"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your password"
          />
        </div>
        <div v-if="error" class="mb-4 text-red-500 text-sm">{{ error }}</div>
        <div class="flex items-center justify-between">
          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
