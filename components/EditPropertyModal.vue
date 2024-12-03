<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div
      class="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-1/2 lg:w-1/3 max-h-screen overflow-y-auto"
    >
      <h2 class="text-2xl font-bold mb-4">Uredi Nekretninu</h2>

      <form @submit.prevent="updateProperty">
        <!-- Property Name Section -->
        <div class="mb-4">
          <div class="flex mb-2 language-buttons">
            <button
              type="button"
              @click="currentLanguage = 'hr'"
              :class="{ active: currentLanguage === 'hr' }"
              class="py-2 px-4 rounded-l"
            >
              HR
            </button>
            <button
              type="button"
              @click="currentLanguage = 'en'"
              :class="{ active: currentLanguage === 'en' }"
              class="py-2 px-4"
            >
              EN
            </button>
            <button
              type="button"
              @click="currentLanguage = 'it'"
              :class="{ active: currentLanguage === 'it' }"
              class="py-2 px-4"
            >
              IT
            </button>
            <button
              type="button"
              @click="currentLanguage = 'de'"
              :class="{ active: currentLanguage === 'de' }"
              class="py-2 px-4 rounded-r"
            >
              DE
            </button>
          </div>

          <!-- Property Name Input Fields -->
          <input
            v-if="currentLanguage === 'hr'"
            v-model="editedProperty.propertyName.hr"
            placeholder="Naziv nekretnine"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            v-if="currentLanguage === 'en'"
            v-model="editedProperty.propertyName.en"
            placeholder="Enter property name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            v-if="currentLanguage === 'it'"
            v-model="editedProperty.propertyName.it"
            placeholder="Nome della proprietà"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            v-if="currentLanguage === 'de'"
            v-model="editedProperty.propertyName.de"
            placeholder="Name der Immobilie"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <!-- Address -->
        <div class="mb-4">
          <label class="block text-gray-700">Adresa:</label>
          <input
            v-model="editedProperty.address"
            class="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <!-- Price -->
        <div class="mb-4">
          <label class="block text-gray-700">Cijena:</label>
          <input
            type="number"
            v-model="editedProperty.price"
            class="w-full px-3 py-2 border rounded-lg"
            required
          />
        </div>

        <!-- Livable Area -->
        <div class="mb-4">
          <label class="block text-gray-700">Stambena površina:</label>
          <input
            type="number"
            v-model="editedProperty.livableArea"
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="m²"
          />
        </div>

        <!-- Bedrooms -->
        <div class="mb-4">
          <label class="block text-gray-700">Broj Soba:</label>
          <input
            type="number"
            v-model="editedProperty.bedrooms"
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="Unesite broj soba"
          />
        </div>

        <!-- Bathrooms -->
        <div class="mb-4">
          <label class="block text-gray-700">Broj Kupaonica:</label>
          <input
            type="number"
            v-model="editedProperty.bathrooms"
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="Unesite broj kupaonica"
          />
        </div>

        <!-- Garden Area -->
        <div class="mb-4">
          <label class="block text-gray-700">Okućnica:</label>
          <input
            type="number"
            v-model="editedProperty.gardenArea"
            class="w-full px-3 py-2 border rounded-lg"
            placeholder="m²"
          />
        </div>

        <!-- Amenities -->
        <div class="mb-10">
          <label class="block text-gray-700">Sadržaji:</label>
          <div class="flex flex-wrap gap-4">
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="editedProperty.amenities.wifi"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2">Wi-Fi</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="editedProperty.amenities.parking"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2">Parking</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="editedProperty.amenities.pool"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2">Bazen</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="editedProperty.amenities.garage"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2">Garaža</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="editedProperty.amenities.seaView"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2">Pogled more</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="editedProperty.amenities.accessToBeach"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2">Prilaz plaži</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="editedProperty.amenities.septicTank"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2">Septička</span>
            </label>
            <label class="inline-flex items-center">
              <input
                type="checkbox"
                v-model="editedProperty.amenities.sewageSystem"
                class="form-checkbox h-5 w-5 text-blue-600"
              />
              <span class="ml-2">Kanalizacija</span>
            </label>
          </div>
        </div>

        <!-- Description -->
        <div class="mb-4">
          <div class="flex mb-2 language-buttons">
            <button
              type="button"
              @click="descriptionLanguage = 'hr'"
              :class="{ active: descriptionLanguage === 'hr' }"
              class="py-2 px-4 rounded-l"
            >
              HR
            </button>
            <button
              type="button"
              @click="descriptionLanguage = 'en'"
              :class="{ active: descriptionLanguage === 'en' }"
              class="py-2 px-4"
            >
              EN
            </button>
            <button
              type="button"
              @click="descriptionLanguage = 'it'"
              :class="{ active: descriptionLanguage === 'it' }"
              class="py-2 px-4"
            >
              IT
            </button>
            <button
              type="button"
              @click="descriptionLanguage = 'de'"
              :class="{ active: descriptionLanguage === 'de' }"
              class="py-2 px-4 rounded-r"
            >
              DE
            </button>
          </div>

          <!-- Description Input Fields -->
          <textarea
            v-if="descriptionLanguage === 'hr'"
            v-model="editedProperty.description.hr"
            placeholder="Opis nekretnine"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <textarea
            v-if="descriptionLanguage === 'en'"
            v-model="editedProperty.description.en"
            placeholder="Property description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <textarea
            v-if="descriptionLanguage === 'it'"
            v-model="editedProperty.description.it"
            placeholder="Descrizione della proprietà"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <textarea
            v-if="descriptionLanguage === 'de'"
            v-model="editedProperty.description.de"
            placeholder="Immobilienbeschreibung"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>

        <!-- Build Type -->
        <div class="mb-4">
          <label class="block text-gray-700">Tip Građevine:</label>
          <select
            v-model="editedProperty.buildType"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="villa">Vila</option>
            <option value="apartment">Stan</option>
            <option value="field">Zemljište</option>
          </select>
        </div>

        <!-- Build Year -->
        <div class="mb-4">
          <label class="block text-gray-700">Novogradnja/Starogradnja:</label>
          <select
            v-model="editedProperty.buildYear"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="new">Novogradnja</option>
            <option value="old">Starogradnja</option>
          </select>
        </div>

        <!-- Sale Type -->
        <div class="mb-4">
          <label class="block text-gray-700">Vrsta Prodaje:</label>
          <select
            v-model="editedProperty.saleType"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="direct">Direktna prodaja</option>
            <option value="resell">Resell</option>
          </select>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            @click="closeModal"
            class="bg-gray-500 text-white px-4 py-2 rounded-lg mr-2"
          >
            Zatvori
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Spremi
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import { doc, updateDoc } from "firebase/firestore";
import { useFirestore } from "vuefire";

export default defineComponent({
  name: "EditPropertyModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    property: {
      type: Object,
      required: true,
    },
  },
  setup(props, { emit }) {
    const firestore = useFirestore();

    const currentLanguage = ref("hr");
    const descriptionLanguage = ref("hr");

    // Clone the property object to avoid mutating the original
    const editedProperty = ref({ ...props.property });

    watch(
      () => props.property,
      (newVal) => {
        editedProperty.value = { ...newVal };
      }
    );

    // Function to close modal
    const closeModal = () => {
      emit("close");
    };

    // Function to handle property update
    const updateProperty = async () => {
      try {
        if (editedProperty.value.id) {
          const propertyDocRef = doc(
            firestore,
            "nekretnine",
            editedProperty.value.id
          );
          await updateDoc(propertyDocRef, { ...editedProperty.value });

          emit("propertyUpdated");
          closeModal();
        }
      } catch (error) {
        console.error("Error updating property: ", error);
      }
    };

    return {
      currentLanguage,
      descriptionLanguage,
      editedProperty,
      closeModal,
      updateProperty,
    };
  },
});
</script>

<style scoped>
.language-buttons {
  display: flex;
  margin-bottom: 1rem;
}

.language-buttons button {
  border: 1px solid #d1d5db;
  margin-right: 0.5rem;
}

.language-buttons button:last-child {
  margin-right: 0;
}

.language-buttons .active {
  background-color: #1d4ed8;
  color: white;
}
</style>
