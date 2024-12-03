<template>
  <div>
    <!-- Property Header -->
    <div class="property-header">
      <div class="header-content">
        <div class="property-title">
          <h1>{{ propertyName[currentLang] }}</h1>
          <p class="price">Cijena: {{ formatPrice(price) }}</p>
        </div>
      </div>
    </div>

    <!-- Property Detail Section -->
    <div class="property-detail">
      <!-- Property Gallery -->
      <div class="property-gallery">
        <!-- Main Image -->
        <div class="main-image" v-if="images.length > 0">
          <img :src="images[0]" alt="Main Image" @click="showImg(0)" />
        </div>

        <!-- Thumbnails -->
        <div class="gallery-thumbnails">
          <img
            v-for="(img, idx) in images.slice(1)"
            :src="img"
            :key="idx"
            alt="Thumbnail"
            @click="showImg(idx + 1)"
          />
        </div>

        <!-- VueEasyLightbox Component -->
        <VueEasyLightbox
          :visible="visibleRef"
          :imgs="images"
          :index="indexRef"
          @hide="onHide"
        />
      </div>

      <!-- Property Info Bar -->
      <div class="property-info-bar">
        <p><i class="fas fa-ruler-combined"></i> {{ livableArea }} m²</p>
        <p><i class="fas fa-bed"></i> {{ bedrooms }}</p>
        <p><i class="fas fa-bath"></i> {{ bathrooms }}</p>
      </div>

      <!-- Property Description and Features -->
      <div class="section-contact">
        <div class="section-desc-feat">
          <h2>{{ sectionLabels.descriptionTitle }}</h2>
          <hr />
          <div class="property-description">
            <p>{{ description[currentLang] }}</p>
          </div>

          <!-- Property Features -->
          <div class="property-features">
            <ul>
              <li v-if="amenities.accessToBeach">
                <i class="fas fa-umbrella-beach"></i>
                {{ amenitiesLabels.accessToBeach }}
              </li>
              <li v-if="amenities.garage">
                <i class="fas fa-warehouse"></i> {{ amenitiesLabels.garage }}
              </li>
              <li v-if="amenities.parking">
                <i class="fas fa-parking"></i> {{ amenitiesLabels.parking }}
              </li>
              <li v-if="amenities.pool">
                <i class="fas fa-swimmer"></i> {{ amenitiesLabels.pool }}
              </li>
              <li v-if="amenities.seaView">
                <i class="fas fa-water"></i> {{ amenitiesLabels.seaView }}
              </li>
              <li v-if="amenities.septicTank">
                <i class="fas fa-toilet"></i> {{ amenitiesLabels.septicTank }}
              </li>
              <li v-if="amenities.sewageSystem">
                <i class="fas fa-water"></i> {{ amenitiesLabels.sewageSystem }}
              </li>
              <li v-if="amenities.wifi">
                <i class="fas fa-wifi"></i> {{ amenitiesLabels.wifi }}
              </li>
            </ul>
          </div>
        </div>

        <!-- Contact Form -->
        <ContactForm :propertyId="propertyId" :currentLang="currentLang" />
      </div>
    </div>
  </div>
</template>

<script>
import ContactForm from "@/components/ContactForm.vue";
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

export default {
  components: {
    ContactForm,
  },
  setup() {
    const route = useRoute();
    const pathSegments = route.path.split("/");
    const currentLang = pathSegments[1];

    const visibleRef = ref(false); // Controls lightbox visibility
    const indexRef = ref(0); // Tracks the currently selected image in the lightbox
    const propertyId = ref(null);
    const propertyName = ref({});
    const price = ref(0);
    const address = ref("");
    const images = ref([]);
    const livableArea = ref(0);
    const bedrooms = ref(0);
    const bathrooms = ref(0);
    const amenities = ref({});
    const description = ref({});

    // Fetch property data from Firestore
    const fetchPropertyData = async () => {
      try {
        const db = getFirestore();
        const propertiesCollection = collection(db, "nekretnine");
        const q = query(
          propertiesCollection,
          where(`slugs.${currentLang}`, "==", route.params.slug)
        );
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
          querySnapshot.forEach((doc) => {
            const propertyData = doc.data();
            propertyName.value = propertyData.propertyName;
            price.value = propertyData.price;
            address.value = propertyData.address;
            images.value = propertyData.images;
            livableArea.value = propertyData.livableArea;
            bedrooms.value = propertyData.bedrooms;
            bathrooms.value = propertyData.bathrooms;
            amenities.value = propertyData.amenities;
            description.value = propertyData.description;
          });
        } else {
          console.error("No such property!");
        }
      } catch (error) {
        console.error("Error fetching property data:", error);
      }
    };

    onMounted(() => {
      fetchPropertyData();
    });

    // Lightbox Functions
    const showImg = (index) => {
      indexRef.value = index;
      visibleRef.value = true;
    };

    const onHide = () => {
      visibleRef.value = false;
    };

    // Format price for display
    const formatPrice = (price) => {
      return price.toLocaleString("hr-HR", {
        style: "currency",
        currency: "EUR",
      });
    };

    // Define multilingual amenities labels
    const amenitiesLabels = computed(() => {
      const labels = {
        en: {
          accessToBeach: "Access to Beach",
          garage: "Garage",
          parking: "Parking",
          pool: "Swimming Pool",
          seaView: "Sea View",
          septicTank: "Septic Tank",
          sewageSystem: "Sewage System",
          wifi: "Wi-Fi",
        },
        hr: {
          accessToBeach: "Pristup plaži",
          garage: "Garaža",
          parking: "Parkiralište",
          pool: "Bazen",
          seaView: "Pogled na more",
          septicTank: "Septička jama",
          sewageSystem: "Kanalizacijski sustav",
          wifi: "Wi-Fi",
        },
        it: {
          accessToBeach: "Accesso alla spiaggia",
          garage: "Garage",
          parking: "Parcheggio",
          pool: "Piscina",
          seaView: "Vista mare",
          septicTank: "Fossa settica",
          sewageSystem: "Sistema fognario",
          wifi: "Wi-Fi",
        },
        de: {
          accessToBeach: "Zugang zum Strand",
          garage: "Garage",
          parking: "Parkplatz",
          pool: "Schwimmbad",
          seaView: "Meerblick",
          septicTank: "Sickergrube",
          sewageSystem: "Abwassersystem",
          wifi: "Wi-Fi",
        },
      };
      return labels[currentLang] || labels.en;
    });

    // Define multilingual section labels
    const sectionLabels = computed(() => {
      const labels = {
        en: {
          descriptionTitle: "Property Description",
        },
        hr: {
          descriptionTitle: "Opis nekretnine",
        },
        it: {
          descriptionTitle: "Descrizione della proprietà",
        },
        de: {
          descriptionTitle: "Objektbeschreibung",
        },
      };
      return labels[currentLang] || labels.en;
    });

    return {
      propertyId,
      propertyName,
      price,
      address,
      images,
      livableArea,
      bedrooms,
      bathrooms,
      amenities,
      description,
      currentLang,
      visibleRef,
      indexRef,
      showImg,
      onHide,
      formatPrice,
      amenitiesLabels,
      sectionLabels,
    };
  },
};
</script>

<style scoped>
/* Header */
.property-header {
  width: 100%;
  background-color: #556dac;
  color: #d9d9d9;
  padding: 20px 0;
  box-sizing: border-box;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.property-title {
  font-family: Poppins, sans-serif;
}

.property-title h1 {
  font-size: 2.5em;
  margin: 0;
}

.price {
  font-size: 2em;
  color: #fff000;
  margin: 0;
  align-self: flex-end;
}

/* Property Details */
.property-detail {
  max-width: 1400px;
  margin: 0 auto;
  font-family: Poppins, sans-serif;
}

.property-gallery {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  align-items: start;
  margin-top: 20px;
}

.main-image img {
  width: 100%;
  height: 410px;
  object-fit: cover;
  cursor: pointer;
}

.gallery-thumbnails {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.gallery-thumbnails img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.gallery-thumbnails img:hover {
  transform: scale(1.05);
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .header-content {
    padding: 0 20px;
  }

  .property-gallery {
    grid-template-columns: 1fr;
    padding: 0 20px;
  }

  .gallery-thumbnails {
    grid-template-columns: 1fr 1fr;
  }

  .property-info-bar p {
    padding: 0 20px;
  }

  .section-desc-feat h2,
  .section-desc-feat hr,
  .property-description p,
  .property-features {
    padding: 0 20px;
  }
}

.section-desc-feat {
  display: flex;
  flex-direction: column;
  padding: 20px 0;
}

.section-desc-feat h2 {
  color: #556dac;
  font-size: 2rem;
  font-weight: 550;
}

.section-desc-feat hr {
  border: 0.3px solid #000000;
  width: 400px;
  margin-top: 10px;
  margin-bottom: 20px;
}

/* Property Info Bar */
.property-info-bar {
  display: flex;
  justify-content: space-between;
  background-color: #f7f7f7;
  padding: 20px;
  margin-top: 20px;
}

.property-info-bar p {
  font-size: 1.2em;
  margin: 0;
}

.property-description,
.property-features {
  background-color: #fff;
}

.property-features ul {
  list-style: none;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Creates two columns */
  grid-auto-rows: auto; /* Automatic row height */
  gap: 10px; /* Space between grid items */
  margin-top: 20px;
}

.property-features li {
  font-size: 1.1em;
  display: flex;
  align-items: center;
}

.property-features li i {
  margin-right: 10px;
}

/* Contact Form */
.section-contact {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;
}

@media (max-width: 768px) {
  .section-contact {
    grid-template-columns: 1fr;
  }
}
</style>
