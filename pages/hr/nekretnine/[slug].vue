<template>
  <div>
    <Navbar :currentLang="currentLang" :navBarStrings="navBarStrings" />
    <PropertyDetails />
    <Footer />
  </div>
</template>

<script setup>
import PropertyDetails from "@/components/PropertyDetails.vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { ref } from "vue";
const currentLang = ref("hr");
const navBarStrings = ref([
  "Home",
  "About Us",
  "Properties",
  "Contact",
  "Kontaktirajte nas",
]);
</script>
