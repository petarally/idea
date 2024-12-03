<template>
  <div>
    <Navbar :currentLang="currentLang" :navBarStrings="navBarStrings" />
    <MainPage
      :currentLang="currentLang"
      :pageStrings="pageStrings"
      :navBarStrings="navBarStrings"
    />
    <Footer />
  </div>
</template>

<script setup>
import MainPage from "@/components/MainPage.vue";
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
import { ref } from "vue";
const currentLang = ref("de");
const navBarStrings = ref([
  "Home",
  "About Us",
  "Properties",
  "Contact",
  "Kontaktieren Sie uns",
]);
const pageStrings = ref(["Hervorgehoben", "Unsere Immobilien"]);
</script>
