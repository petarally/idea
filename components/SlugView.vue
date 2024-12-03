<template>
  <div>
    <Navbar />
    <!-- Property details content here -->
    <div class="property-detail">
      <!-- You can now use lang and slug props in your component -->
      <h1>{{ propertyName[lang] }}</h1>
      <p class="price">Cijena: {{ formatPrice(price) }}</p>
      <!-- Rest of your component -->
    </div>
  </div>
</template>

<script>
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    lang: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      propertyId: "",
      propertyName: {},
      price: 0,
      // Other property details
    };
  },
  async mounted() {
    try {
      const db = getFirestore();
      const propertyDoc = doc(db, "nekretnine", this.slug); // Assuming slug is the document ID
      const propertySnapshot = await getDoc(propertyDoc);

      if (propertySnapshot.exists()) {
        const propertyData = propertySnapshot.data();
        this.propertyId = propertySnapshot.id;
        this.propertyName = propertyData.propertyName;
        this.price = propertyData.price;
        // Populate other fields
      } else {
        console.error("No such property!");
      }
    } catch (error) {
      console.error("Error fetching property data:", error);
    }
  },
  methods: {
    formatPrice(price) {
      return price.toLocaleString(this.lang, {
        style: "currency",
        currency: "EUR",
      });
    },
  },
});
</script>
