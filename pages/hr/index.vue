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
const currentLang = ref("hr");
const navBarStrings = ref([
  "Home",
  "About Us",
  "Properties",
  "Contact",
  "Kontaktirajte nas",
]);
const pageStrings = ref(["Izdvojeno", "Naše nekretnine"]);
</script>
