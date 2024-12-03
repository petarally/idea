<script lang="ts" setup>
import { ref, onMounted } from "vue";
import PropertyCard from "@/components/PropertyCard.vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import FilterComponent from "@/components/FilterComponent.vue";
import { useFirestore } from "vuefire";
import { collection, getDocs } from "firebase/firestore";
import { useRouter, useRoute } from "vue-router";

interface Property {
  id: string;
  propertyName: {
    hr: string;
  };
  slug: string;
  latitude?: number;
  longitude?: number;
  displayOnIndex?: boolean;
  images?: string[];
}

const firestore = useFirestore();
const properties = ref<Property[]>([]);
const filteredProperties = ref<Property[]>([]); // Initialize for filtered properties
const loading = ref(true);
const selectedProperty = ref<Property | null>(null);
const mainImage = ref<string | null>(null);
let map: google.maps.Map | null = null;

const fetchProperties = async () => {
  try {
    const realtyCollection = collection(firestore, "nekretnine");
    const querySnapshot = await getDocs(realtyCollection);
    properties.value = querySnapshot.docs.map(
      (doc) =>
        ({
          id: doc.id,
          ...doc.data(),
        } as Property)
    );

    properties.value = properties.value.slice(-4);
    filteredProperties.value = properties.value; // Initially, all properties are displayed

    // Find the first property with displayOnIndex: true and set its main image
    const propertyToDisplay = properties.value.find(
      (property) => property.displayOnIndex
    );
    if (
      propertyToDisplay &&
      propertyToDisplay.images &&
      propertyToDisplay.images.length > 0
    ) {
      mainImage.value = propertyToDisplay.images[0]; // Set mainImage to images[0]
    }
  } catch (error) {
    console.error("Error fetching properties: ", error);
  } finally {
    loading.value = false;
    if (map) {
      initMap();
    }
  }
};

const handleFilteredProperties = (filtered: Property[]) => {
  filteredProperties.value = filtered; // Update the displayed properties based on filter
};

const selectProperty = (property: Property) => {
  selectedProperty.value = property;
  if (property.latitude && property.longitude && map) {
    map.setCenter({ lat: property.latitude, lng: property.longitude });
    map.setZoom(15);
  }
};

const initMap = () => {
  map = new google.maps.Map(document.getElementById("map") as HTMLElement, {
    center: { lat: 45.1, lng: 13.6 }, // Center the map somewhere in the region
    zoom: 8,
  });

  properties.value.forEach((property: Property) => {
    if (property.latitude && property.longitude) {
      const marker = new google.maps.Marker({
        position: { lat: property.latitude, lng: property.longitude },
        map,
        title: property.propertyName.hr,
      });

      marker.addListener("click", () => {
        selectProperty(property);
      });
    }
  });
};

onMounted(() => {
  fetchProperties();
  initMap();
});

const router = useRouter();
const route = useRoute();

const navigateToProperty = ({ id, slug }) => {
  console.log("Navigating to property:", id, slug);
  const currentLang = route.params.lang || "hr";
  let path = `/${currentLang}/default-path/${slug}`;

  if (currentLang === "hr") {
    path = `/${currentLang}/nekretnine/${slug}`;
  } else if (currentLang === "en") {
    path = `/${currentLang}/properties/${slug}`;
  } else if (currentLang === "it") {
    path = `/${currentLang}/immobili/${slug}`;
  } else if (currentLang === "de") {
    path = `/${currentLang}/immobilien/${slug}`;
  }

  router.push({ path });
};
</script>

<template>
  <div class="index-page">
    <Navbar />
    <!-- Main Image Section -->
    <div
      v-if="mainImage"
      class="main-image-section"
      :style="{ backgroundImage: 'url(' + mainImage + ')' }"
    ></div>
    <div class="filter-container mx-auto">
      <div class="container mx-auto">
        <FilterComponent
          :properties="properties"
          :currentLang="route.params.lang || 'hr'"
          @filtered="handleFilteredProperties"
        />
      </div>
    </div>
    <div class="container mx-auto p-4">
      <div class="izdvojeno">
        <h2>IZDVOJENO</h2>
        <hr />
      </div>

      <!-- Properties Section -->
      <div class="properties grid grid-cols-3 gap-8 mb-8">
        <PropertyCard
          v-for="property in properties"
          :key="property.id"
          :property="property"
          @navigateToProperty="navigateToProperty"
        />
      </div>
    </div>
    <!-- Map Section -->
    <div class="map-section">
      <div class="underlined-text">
        <h2 class="text-center mb-4">NAŠE NEKRETNINE</h2>
        <hr />
      </div>
      <div id="map" class="w-full h-96 bg-gray-300"></div>
    </div>
    <Footer />
  </div>
</template>

<style scoped>
.index-page {
  font-family: Poppins, sans-serif;
}

.lang-mail {
  display: flex;
  justify-content: space-between;
  padding: 10px 20px;
  background-color: #556dac;
  color: #d9d9d9;
}

.main-image-section {
  width: 100%;
  height: 800px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.search-filter {
  background-color: #f8f8f8;
  padding: 20px;
}

.filter-container {
  background: #3951a5;
}

.izdvojeno h2 {
  font-weight: 550;
  font-size: 2rem;
  color: #556dac;
}

.izdvojeno hr {
  border: 0.3px solid #000000;
  width: 400px;
  margin-top: 10px;
  margin-bottom: 50px;
}

.properties {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.map-section {
  margin-top: 50px;
  background: #8297b3;
  height: 100%;
}

.map-section .underlined-text {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 2rem 0;
}

.map-section h2 {
  font-weight: 550;
  font-size: 2rem;
  color: #fdfefe;
}

.map-section hr {
  border: 0.3px solid #fdfefe;
  width: 400px;
}

#map {
  width: 100%;
  height: 400px;
}
</style>
