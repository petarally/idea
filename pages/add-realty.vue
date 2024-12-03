<template>
  <div class="flex min-h-screen bg-gray-100 flex-col md:flex-row">
    <!-- Sidebar -->
    <div
      v-if="user"
      :class="[
        'fixed inset-y-0 left-0 transform bg-white shadow-md overflow-y-auto z-30 w-64',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full',
        'transition-transform duration-300 ease-in-out',
        'md:relative md:translate-x-0',
      ]"
    >
      <div class="p-4">
        <h2 class="text-xl font-semibold text-gray-800">{{ username }}</h2>
        <button
          @click="logout"
          class="mt-2 w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Odjava
        </button>
      </div>
      <div class="mt-8">
        <nav class="space-y-2">
          <a
            href="#"
            @click.prevent="selectMenu('Dodaj nekretninu')"
            :class="[
              'block py-2 px-4 text-gray-600 rounded',
              selectedMenu === 'Dodaj nekretninu'
                ? 'bg-gray-200 text-gray-900'
                : 'hover:bg-gray-200 hover:text-gray-900',
            ]"
          >
            Dodaj nekretninu
          </a>
          <a
            href="#"
            @click.prevent="selectMenu('Moje nekretnine')"
            :class="[
              'block py-2 px-4 text-gray-600 rounded',
              selectedMenu === 'Moje nekretnine'
                ? 'bg-gray-200 text-gray-900'
                : 'hover:bg-gray-200 hover:text-gray-900',
            ]"
          >
            Moje nekretnine
          </a>
          <!--
          <a
            href="#"
            @click.prevent="selectMenu('Profil')"
            :class="[
              'block py-2 px-4 text-gray-600 rounded',
              selectedMenu === 'Profil'
                ? 'bg-gray-200 text-gray-900'
                : 'hover:bg-gray-200 hover:text-gray-900',
            ]"
          >
            Profil
          </a>-->
          <a
            href="#"
            @click.prevent="selectMenu('Prodavatelji')"
            :class="[
              'block py-2 px-4 text-gray-600 rounded',
              selectedMenu === 'Prodavatelji'
                ? 'bg-gray-200 text-gray-900'
                : 'hover:bg-gray-200 hover:text-gray-900',
            ]"
          >
            Prodavatelji
          </a>
        </nav>
      </div>
    </div>

    <!-- Overlay for Sidebar on Mobile -->
    <div
      v-if="user && sidebarOpen"
      class="fixed inset-0 bg-black opacity-50 z-20 md:hidden"
      @click="sidebarOpen = false"
    ></div>

    <!-- Main Content -->
    <div class="flex-1 p-4 flex flex-col justify-center items-center">
      <!-- Menu Toggle Button (Hamburger) -->
      <div class="md:hidden fixed top-4 right-4 z-40">
        <button @click="sidebarOpen = !sidebarOpen" class="focus:outline-none">
          <!-- Hamburger Icon -->
          <svg
            class="w-8 h-8 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>

      <div v-if="user" class="w-full max-w-4xl bg-white rounded-lg shadow-md">
        <!-- Conditionally render components based on selected menu -->
        <component
          :is="
            selectedMenu === 'Dodaj nekretninu'
              ? AddPropertyComponent
              : selectedMenu === 'Moje nekretnine'
              ? MyPropertiesComponent
              : selectedMenu === 'Prodavatelji'
              ? ProdavateljiComponent
              : ProfileComponent
          "
          :user="user"
          :username="username"
          :propertyName="propertyName"
          :address="address"
          :price="price"
          :images="images"
          :imagePreviews="imagePreviews"
          @previewImage="previewImage"
          @handleDrop="handleDrop"
          @handleDragOver="handleDragOver"
          @addRealty="addRealty"
        />
      </div>

      <div
        v-else
        class="flex items-center justify-center min-h-screen bg-gray-100"
      >
        <p class="text-gray-700 text-center">
          You must be logged in to add realty.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getAuth, signOut } from "firebase/auth";
import { useFirestore, useStorage } from "vuefire";
import { collection } from "firebase/firestore";
import AddPropertyForm from "../components/AddPropertyForm.vue";
import MyPropertiesDisplay from "../components/MyPropertiesDisplay.vue";
import Profile from "../components/Profile.vue";
import Prodavatelji from "../components/Prodavatelji.vue";

// State for mobile menu (sidebar) visibility
const sidebarOpen = ref(false);

// State for selected menu item
const selectedMenu = ref<
  "Dodaj nekretninu" | "Moje nekretnine" | "Profil" | "Prodavatelji"
>("Dodaj nekretninu");

// Initialize Fire, Auth, and Storage
const firestore = useFirestore();
const auth = getAuth(); // Directly get the Firebase Auth instance
const storage = useStorage();

// Get a reference to the Firestore collection "nekretnine"
const realtyCollection = collection(firestore, "nekretnine");

// Form state
const propertyName = ref("");
const address = ref("");
const price = ref("");
const user = ref<any>(null);
const username = ref("");

// Image state
const images = ref<Blob[]>([]);
const imagePreviews = ref<string[]>(new Array(5).fill(null));

// Check authentication state
onMounted(() => {
  auth.onAuthStateChanged((currentUser) => {
    if (currentUser) {
      user.value = currentUser;
      username.value = currentUser.displayName || currentUser.email;
    } else {
      user.value = null;
    }
  });
});

// Handle sign out
const logout = async () => {
  try {
    await signOut(auth);
    user.value = null;
    alert("You have been signed out.");
    window.location.href = "/";
  } catch (error) {
    console.error("Error signing out: ", error);
  }
};

// Handle menu item click
const selectMenu = (
  menu: "Dodaj nekretninu" | "Moje nekretnine" | "Profil"
) => {
  selectedMenu.value = menu;
  sidebarOpen.value = false; // Close sidebar on mobile after selection
};

// Component references
const AddPropertyComponent = AddPropertyForm;
const MyPropertiesComponent = MyPropertiesDisplay;
const ProfileComponent = Profile;
const ProdavateljiComponent = Prodavatelji;
</script>
