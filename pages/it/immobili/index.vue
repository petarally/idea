<template>
  <Navbar :currentLang="currentLang" :navBarStrings="navBarStrings" />
  <div class="all-properties-page">
    <div class="properties grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 w-full">
      <PropertyCard
        v-for="property in properties"
        :key="property.id"
        :property="property"
        :currentLang="currentLang"
        @navigateToProperty="navigateToProperty"
      />
    </div>
  </div>
  <Footer />
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import PropertyCard from "@/components/PropertyCard.vue";
import { useFirestore } from "vuefire";
import { collection, getDocs } from "firebase/firestore";
import { useRouter, useRoute } from "vue-router";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";

export default defineComponent({
  components: {
    PropertyCard,
    Footer,
    Navbar,
  },
  setup() {
    interface Property {
      id: string;
      propertyName: {
        hr: string;
        en: string;
        it: string;
        de: string;
      };
      slug: {
        hr: string;
        en: string;
        it: string;
        de: string;
      };
      latitude?: number;
      longitude?: number;
      displayOnIndex?: boolean;
      images?: string[];
    }

    const firestore = useFirestore();
    const properties = ref<Property[]>([]);
    const currentLang = ref("it"); // Set the default language or get it from props/route

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
      } catch (error) {
        console.error("Error fetching properties: ", error);
      }
    };

    const router = useRouter();
    const route = useRoute();

    const navigateToProperty = ({ id, slug }) => {
      const pathSegments = route.path.split("/");
      const currentLang = pathSegments[1]; // Extract the language code from the path
      console.log("Extracted Language Code:", currentLang);
      console.log("Slug Object:", slug);
      console.log("Navigating to property:", id, slug[currentLang]);

      let path = `/${currentLang}/default-path/${slug[currentLang]}`;

      if (currentLang === "hr") {
        path = `/${currentLang}/nekretnine/${slug.hr}`;
      } else if (currentLang === "en") {
        path = `/${currentLang}/properties/${slug.en}`;
      } else if (currentLang === "it") {
        path = `/${currentLang}/immobili/${slug.it}`;
      } else if (currentLang === "de") {
        path = `/${currentLang}/immobilien/${slug.de}`;
      }

      console.log("Constructed Path:", path); // Log the constructed path
      router.push({ path }).catch((err) => {
        console.error("Router push error:", err); // Log any router push errors
      });
    };

    onMounted(async () => {
      await fetchProperties();
    });

    const navBarStrings = computed(() => {
      const strings = {
        en: ["Home", "About Us", "Properties", "Contact"],
        hr: ["Početna", "O nama", "Nekretnine", "Kontakt"],
        it: ["Home", "Chi siamo", "Proprietà", "Contatto"],
        de: ["Startseite", "Über uns", "Immobilien", "Kontakt"],
      };
      return strings[currentLang.value] || strings.en;
    });

    return {
      properties,
      currentLang,
      navBarStrings,
      navigateToProperty,
    };
  },
});
</script>

<style scoped>
.all-properties-page {
  padding: 20px;
}

.properties {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

@media (min-width: 768px) {
  .properties {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
