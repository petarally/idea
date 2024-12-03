<template>
  <div class="filtered-properties-page">
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
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import PropertyCard from "@/components/PropertyCard.vue";
import { useFirestore } from "vuefire";
import { collection, getDocs } from "firebase/firestore";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    PropertyCard,
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
    const filteredProperties = ref<Property[]>([]);

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

        applyFilters();
      } catch (error) {
        console.error("Error fetching properties: ", error);
      }
    };

    const route = useRoute();
    const currentLang = computed(() => {
      const pathSegments = route.path.split("/");
      return pathSegments[1]; // This will get 'hr', 'en', 'it', or 'de' from the URL
    });

    const applyFilters = () => {
      const query = route.query;
      filteredProperties.value = properties.value.filter((property: any) => {
        return (
          (query.location
            ? property.location.includes(query.location)
            : true) &&
          (query.propertyType ? property.type === query.propertyType : true) &&
          (query.status ? property.status === query.status : true) &&
          (query.price
            ? property.price <= parseInt(query.price as string)
            : true) &&
          (query.size
            ? filterBySize(property.size, query.size as string)
            : true)
        );
      });
    };

    const filterBySize = (size: number, selectedSize: string) => {
      switch (selectedSize) {
        case "small":
          return size < 50;
        case "medium":
          return size >= 50 && size <= 100;
        case "large":
          return size > 100;
        default:
          return true;
      }
    };

    onMounted(async () => {
      await fetchProperties();
    });

    return {
      properties,
      filteredProperties,
      currentLang,
      applyFilters,
      filterBySize,
    };
  },
});
</script>

<style scoped>
.filtered-properties-page {
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
