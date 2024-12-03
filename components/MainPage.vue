<template>
  <div class="index-page">
    <!-- Main Image Section -->
    <div
      v-if="mainImage"
      class="main-image-section hidden md:block"
      :style="{ backgroundImage: 'url(' + mainImage + ')' }"
    ></div>
    <div class="filter-container mx-auto px-4 sm:px-6 md:px-8">
      <div class="container mx-auto">
        <FilterComponent
          :properties="properties"
          :currentLang="currentLang"
          @filtered="handleFilteredProperties"
        />
      </div>
    </div>

    <div class="categories container mx-auto p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Category Cards -->
        <a
          v-for="(category, key) in categoryLabels"
          :key="key"
          href="#"
          class="card relative block transform transition-transform hover:scale-105"
        >
          <img
            :src="`/${key}.jpg`"
            :alt="category"
            class="w-full h-64 object-cover shadow-md filter transition-all duration-500 ease-in-out"
          />
          <h1
            class="absolute inset-0 flex items-center justify-center text-white text-xl font-bold bg-black bg-opacity-50"
          >
            {{ category }}
          </h1>
        </a>
      </div>
    </div>

    <div class="container mx-auto p-4">
      <div class="izdvojeno">
        <h2>{{ pageStrings[0].toUpperCase() }}</h2>
        <hr />
      </div>

      <!-- Properties Section -->
      <div class="properties grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 w-full">
        <PropertyCard
          v-for="property in filteredProperties"
          :key="property.id"
          :property="property"
          :currentLang="currentLang"
          @navigateToProperty="navigateToProperty"
        />
      </div>
    </div>

    <!-- Map Section -->
    <div class="map-section">
      <div class="underlined-text">
        <h2 class="text-center mb-4">{{ pageStrings[1].toUpperCase() }}</h2>
        <hr />
      </div>
      <div id="map" class="w-full h-96 bg-gray-300"></div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  nextTick,
  computed,
  watch,
} from "vue";
import PropertyCard from "@/components/PropertyCard.vue";
import FilterComponent from "@/components/FilterComponent.vue";
import { useFirestore } from "vuefire";
import { collection, getDocs } from "firebase/firestore";
import { useRouter, useRoute } from "vue-router";

export default defineComponent({
  name: "MainPage",
  components: {
    PropertyCard,
    FilterComponent,
  },
  props: {
    currentLang: {
      type: String,
      required: true,
    },
    pageStrings: {
      type: Array,
      required: true,
    },
  },
  setup(props) {
    const firestore = useFirestore();
    const router = useRouter();
    const route = useRoute();
    const properties = ref([]);
    const filteredProperties = ref([]);
    const loading = ref(true);
    const selectedProperty = ref(null);
    const mainImage = ref(null);
    let map = null;

    watch(
      [() => route.query, () => props.currentLang],
      async ([newQuery, currentLang]) => {
        if (newQuery && Object.keys(newQuery).length > 0) {
          filteredProperties.value = properties.value.filter((property) => {
            // Ensure content matches current language
            const propertyContent = property.propertyName[currentLang];
            if (!propertyContent) return false;

            if (newQuery.price) {
              const maxPrice = parseInt(newQuery.price as string);
              if (property.price > maxPrice) return false;
            }
            if (newQuery.status && property.status !== newQuery.status) {
              return false;
            }
            return true;
          });
        } else {
          filteredProperties.value = properties.value;
        }
      },
      { immediate: true }
    );

    const fetchProperties = async () => {
      try {
        const realtyCollection = collection(firestore, "nekretnine");
        const querySnapshot = await getDocs(realtyCollection);
        properties.value = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        filteredProperties.value = properties.value;

        const propertyToDisplay = properties.value.find(
          (property) => property.displayOnIndex
        );
        if (propertyToDisplay?.images?.length > 0) {
          mainImage.value = propertyToDisplay.images[0];
        }
      } catch (error) {
        console.error("Error fetching properties: ", error);
      } finally {
        loading.value = false;
        if (map) initMap();
      }
    };

    const handleFilteredProperties = (queryParams) => {
      const filteredQueryParams = Object.fromEntries(
        Object.entries(queryParams).filter(([_, value]) => value)
      );
      const paths = {
        hr: "/hr/nekretnine/filtrirane-nekretnine",
        en: "/en/properties/filtered-properties",
        it: "/it/immobili/proprieta-filtrate",
        de: "/de/immobilien/gefilterte-immobilien",
      };
      router.push({
        path: paths[props.currentLang] || paths.en,
        query: filteredQueryParams,
      });
    };

    const initMap = () => {
      map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: 45.1, lng: 13.6 },
        zoom: 8,
      });

      properties.value.forEach((property) => {
        if (property.latitude && property.longitude) {
          const marker = new google.maps.Marker({
            position: { lat: property.latitude, lng: property.longitude },
            map,
            title: property.propertyName[props.currentLang],
          });
          marker.addListener("click", () => selectProperty(property));
        }
      });
    };

    const selectProperty = (property) => {
      selectedProperty.value = property;
      if (property.latitude && property.longitude && map) {
        map.setCenter({ lat: property.latitude, lng: property.longitude });
        map.setZoom(15);
      }
    };

    const navigateToProperty = ({ id, slug }) => {
      const paths = {
        hr: `/hr/nekretnine/${slug.hr}`,
        en: `/en/properties/${slug.en}`,
        it: `/it/immobili/${slug.it}`,
        de: `/de/immobilien/${slug.de}`,
      };
      router.push(paths[props.currentLang] || paths.en);
    };

    const categoryLabels = computed(
      () =>
        ({
          villas: {
            en: "Villas",
            hr: "Vile",
            it: "Ville",
            de: "Villen",
          },
          apartments: {
            en: "Apartments",
            hr: "Stanovi",
            it: "Appartamenti",
            de: "Wohnungen",
          },
          land: {
            en: "Land",
            hr: "Zemljišta",
            it: "Terreni",
            de: "Grundstücke",
          },
        }[props.currentLang] || categoryLabels.en)
    );

    onMounted(async () => {
      await fetchProperties();
      await nextTick();
      initMap();
    });

    return {
      properties,
      filteredProperties,
      loading,
      selectedProperty,
      mainImage,
      handleFilteredProperties,
      navigateToProperty,
      categoryLabels,
    };
  },
});
</script>

<style scoped>
.index-page {
  font-family: Poppins, sans-serif;
}

.main-image-section {
  width: 100%;
  height: 800px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  margin: 10px 0 50px;
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
