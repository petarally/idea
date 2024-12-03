<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useFirebaseAuth, useFirestore, useStorage } from "vuefire";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import { ref as storageRef, deleteObject } from "firebase/storage";
import EditPropertyModal from "./EditPropertyModal.vue";

// Initialize Firestore, Auth, and Storage
const firestore = useFirestore();
const auth = useFirebaseAuth();
const storage = useStorage();

// State for properties and loading
const properties = ref<any[]>([]);
const loading = ref(true);

// Fetch properties from Firestore
const fetchProperties = async () => {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      // Reference to the 'nekretnine' collection
      const realtyCollection = collection(firestore, "nekretnine");
      // Query for properties belonging to the current user
      const q = query(realtyCollection, where("userId", "==", currentUser.uid));
      const querySnapshot = await getDocs(q);

      properties.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
    }
  } catch (error) {
    console.error("Error fetching properties: ", error);
  } finally {
    loading.value = false;
  }
};

const selectedProperty = ref<any>(null);
const isEditModalOpen = ref(false);

const openEditModal = (property: any) => {
  selectedProperty.value = { ...property }; // Clone the property object to avoid mutating the original
  isEditModalOpen.value = true;
};

const closeEditModal = () => {
  isEditModalOpen.value = false;
};

// Handle deletion of a property
const deleteProperty = async (propertyId: string, imageUrls: string[]) => {
  if (confirm("Jeste li sigurni da želite izbrisati ovu nekretninu?")) {
    try {
      // Delete the property document from Firestore
      const propertyDocRef = doc(firestore, "nekretnine", propertyId);
      await deleteDoc(propertyDocRef);

      // Delete all images associated with the property from Storage
      for (const imageUrl of imageUrls) {
        const imageName = imageUrl.split("/").pop(); // Extract image name from URL
        if (imageName) {
          const imageRef = storageRef(storage, `realty_images/${imageName}`);
          await deleteObject(imageRef);
        }
      }

      // Refresh the property list
      await fetchProperties();

      // Show success alert
      alert("Nekretnina je uspješno izbrisana iz baze!");
    } catch (error) {
      console.error("Error deleting property: ", error);
    }
  }
};

const formatPrice = (price: number) => {
  return price.toLocaleString("hr-HR", {
    style: "currency",
    currency: "EUR",
  });
};

// Toggle the displayOnIndex field
const toggleDisplayOnIndex = async (
  propertyId: string,
  currentValue: boolean
) => {
  try {
    const propertyDocRef = doc(firestore, "nekretnine", propertyId);
    await updateDoc(propertyDocRef, {
      displayOnIndex: !currentValue,
    });
    await fetchProperties(); // Refresh the list after update
  } catch (error) {
    console.error("Error updating property: ", error);
  }
};

// Fetch properties on component mount
onMounted(() => {
  fetchProperties();
});
</script>

<template>
  <div class="flex h-screen">
    <!-- Main Content -->
    <main class="flex-1 p-4 sm:p-8 bg-white rounded-lg shadow-lg overflow-auto">
      <h2 class="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gray-800">
        Moje nekretnine
      </h2>

      <!-- Show loading spinner if data is being fetched -->
      <div v-if="loading" class="flex justify-center items-center h-48">
        <svg
          class="animate-spin h-12 w-12 text-blue-500"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12 4V1M12 23v-3m8.657-2.657l2.121-2.121M3.343 20.657l2.121-2.121M21 12h3m-24 0h3m15.657-5.657l2.121-2.121M5.657 18.657l2.121-2.121M21 12a9 9 0 0 1-18 0"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <!-- Show table with properties -->
      <div v-else class="overflow-x-auto">
        <table class="min-w-full bg-white divide-y divide-gray-200">
          <thead class="bg-gray-100">
            <tr>
              <th
                class="px-4 sm:px-6 py-3 text-left text-sm sm:text-lg font-semibold text-gray-700"
              >
                Foto
              </th>
              <th
                class="px-4 sm:px-6 py-3 text-left text-sm sm:text-lg font-semibold text-gray-700"
              >
                Naziv nekretnine
              </th>
              <th
                class="px-4 sm:px-6 py-3 text-left text-sm sm:text-lg font-semibold text-gray-700"
              >
                Adresa
              </th>
              <th
                class="px-4 sm:px-6 py-3 text-left text-sm sm:text-lg font-semibold text-gray-700"
              >
                Cijena
              </th>
              <th
                class="px-4 sm:px-6 py-3 text-left text-sm sm:text-lg font-semibold text-gray-700"
              >
                Prikaz na početnoj
              </th>
              <th
                class="px-4 sm:px-6 py-3 text-left text-sm sm:text-lg font-semibold text-gray-700"
              >
                Radnja
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-300">
            <tr v-for="property in properties" :key="property.id">
              <td class="px-4 sm:px-6 py-3 text-sm font-medium text-gray-900">
                <img
                  :src="property.images[0]"
                  alt="Main Image"
                  class="w-24 h-16 sm:w-32 sm:h-24 object-cover"
                />
              </td>
              <td class="px-4 sm:px-6 py-3 text-sm font-medium text-gray-900">
                {{ property.propertyName.hr }}
              </td>
              <td class="px-4 sm:px-6 py-3 text-sm font-medium text-gray-900">
                {{ property.address }}
              </td>
              <td class="px-4 sm:px-6 py-3 text-sm font-medium text-gray-900">
                {{ formatPrice(property.price) }}
              </td>
              <td class="px-4 sm:px-6 py-3 text-sm font-medium text-gray-900">
                <input
                  type="checkbox"
                  :checked="property.displayOnIndex"
                  @change="
                    toggleDisplayOnIndex(property.id, property.displayOnIndex)
                  "
                />
              </td>
              <td class="px-4 sm:px-6 py-3 text-sm font-medium text-gray-900">
                <div class="flex space-x-2">
                  <button
                    @click="openEditModal(property)"
                    class="bg-blue-500 text-white px-4 py-2 rounded-lg flex-1"
                  >
                    Uredi
                  </button>
                  <button
                    @click="deleteProperty(property.id, property.images)"
                    class="bg-red-500 text-white px-4 py-2 rounded-lg flex-1"
                  >
                    Izbriši
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </main>

    <!-- Edit Property Modal -->
    <EditPropertyModal
      :isOpen="isEditModalOpen"
      :property="selectedProperty"
      @close="closeEditModal"
      @propertyUpdated="fetchProperties"
    />
  </div>
</template>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
}

th,
td {
  padding: 12px 15px;
  text-align: left;
}

th {
  background-color: #f4f4f4;
  font-weight: bold;
}

tr:nth-child(even) {
  background-color: #f9f9f9;
}

button {
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

button.bg-red-500:hover {
  background-color: #c53030;
}
</style>
