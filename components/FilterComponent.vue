<template>
  <div class="filter-section bg-customBlue py-8 px-4 sm:px-6">
    <!-- Full-width grid layout for desktop and stack layout for mobile -->
    <div class="grid lg:grid-cols-4 gap-4">
      <!-- Location Filter -->
      <select
        v-model="filters.location"
        class="p-2 bg-gray-100 border border-gray-300 w-full"
      >
        <option value="">{{ filterOptions.locationLabel }}</option>
        <option v-for="location in locations" :key="location" :value="location">
          {{ location }}
        </option>
      </select>

      <!-- Property Type Filter -->
      <select
        v-model="filters.propertyType"
        class="p-2 bg-gray-100 border border-gray-300 w-full"
      >
        <option value="">{{ filterOptions.propertyTypeLabel }}</option>
        <option v-for="type in propertyTypes" :key="type" :value="type">
          {{ type }}
        </option>
      </select>

      <!-- Status Filter -->
      <select
        v-model="filters.status"
        class="p-2 bg-gray-100 border border-gray-300 w-full"
      >
        <option value="">{{ filterOptions.statusLabel }}</option>
        <option value="Novogradnja">{{ filterOptions.newConstruction }}</option>
        <option value="Starogradnja">{{ filterOptions.resale }}</option>
      </select>

      <!-- Button for Desktop View -->
      <button
        @click="applyFilter"
        class="p-2 hidden lg:block hover:bg-blue-700 w-full"
        :style="{ backgroundColor: '#556DAC', color: '#FFF000' }"
      >
        {{ filterOptions.searchButton }}
      </button>
    </div>

    <!-- Filters for mobile view -->
    <div class="grid lg:grid-cols-2 gap-4 mt-4">
      <!-- Max Price Input -->
      <input
        v-model="filters.price"
        type="number"
        :placeholder="filterOptions.maxPricePlaceholder"
        class="p-2 bg-gray-100 border border-gray-300 w-full"
      />

      <!-- Size Filter -->
      <input
        v-model="filters.size"
        type="number"
        :placeholder="filterOptions.sizePlaceholder"
        class="p-2 bg-gray-100 border border-gray-300 w-full"
      />
    </div>

    <!-- Button for Mobile View -->
    <div class="mt-4 lg:hidden flex justify-end">
      <button
        @click="applyFilter"
        class="p-2 w-full md:w-auto hover:bg-blue-700"
        :style="{ backgroundColor: '#556DAC', color: '#FFF000' }"
      >
        {{ filterOptions.searchButton }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineProps, defineEmits, onMounted, computed } from "vue";
import { useFirestore } from "vuefire";
import { collection, getDocs } from "firebase/firestore";

const props = defineProps({
  properties: Array,
  currentLang: String,
});

const emits = defineEmits(["filtered"]);
const firestore = useFirestore();

const filters = ref({
  location: "",
  propertyType: "",
  status: "",
  price: "",
  size: "",
});

const locations = ref<string[]>([]);
const propertyTypes = ref<string[]>([]);

// Define multilingual filter options
const filterOptions = computed(() => {
  const options = {
    en: {
      locationLabel: "Location",
      propertyTypeLabel: "Property Type",
      statusLabel: "New/Resale",
      newConstruction: "New Construction",
      resale: "Resale",
      maxPricePlaceholder: "Max Price (€)",
      sizePlaceholder: "Size (m2)",
      searchButton: "Search",
      propertyTypes: ["Villa", "Apartment", "Land"],
      status: {
        Novogradnja: "new construction",
        Starogradnja: "resale",
      },
    },
    hr: {
      locationLabel: "Lokacija",
      propertyTypeLabel: "Vrsta nekretnine",
      statusLabel: "Novogradnja/Starogradnja",
      newConstruction: "Novogradnja",
      resale: "Starogradnja",
      maxPricePlaceholder: "Max cijena (€)",
      sizePlaceholder: "Površina (m2)",
      searchButton: "Pretraživanje",
      propertyTypes: ["Vila", "Stan", "Zemljište"],
      status: {
        Novogradnja: "novogradnja",
        Starogradnja: "starogradnja",
      },
    },
    it: {
      locationLabel: "Località",
      propertyTypeLabel: "Tipo di proprietà",
      statusLabel: "Nuova/Rivendita",
      newConstruction: "Nuova costruzione",
      resale: "Rivendita",
      maxPricePlaceholder: "Prezzo massimo (€)",
      sizePlaceholder: "Dimensione (m2)",
      searchButton: "Cerca",
      propertyTypes: ["Villa", "Appartamento", "Terreno"],
      status: {
        Novogradnja: "nuova costruzione",
        Starogradnja: "rivendita",
      },
    },
    de: {
      locationLabel: "Ort",
      propertyTypeLabel: "Immobilientyp",
      statusLabel: "Neu/Wiederverkauf",
      newConstruction: "Neubau",
      resale: "Wiederverkauf",
      maxPricePlaceholder: "Max Preis (€)",
      sizePlaceholder: "Größe (m2)",
      searchButton: "Suche",
      propertyTypes: ["Villa", "Wohnung", "Grundstück"],
      status: {
        Novogradnja: "neubau",
        Starogradnja: "wiederverkauf",
      },
    },
  };
  return options[props.currentLang] || options.en;
});

// Fetch unique locations and property types dynamically
onMounted(async () => {
  const realtyCollection = collection(firestore, "nekretnine");
  const querySnapshot = await getDocs(realtyCollection);
  const allProperties = querySnapshot.docs.map((doc) => doc.data());

  // Extract unique locations and property types from allProperties
  locations.value = [...new Set(allProperties.map((p: any) => p.location))];
  propertyTypes.value = filterOptions.value.propertyTypes;
});

const applyFilter = () => {
  const localizedStatus =
    filterOptions.value.status[filters.value.status] || filters.value.status;

  const queryParams = {
    location: filters.value.location.toLowerCase(),
    propertyType: filters.value.propertyType.toLowerCase(),
    status: localizedStatus.toLowerCase(),
    price: filters.value.price,
    size: filters.value.size,
  };

  emits("filtered", queryParams);
};
</script>

<style scoped>
/* Add your styles here */
</style>
