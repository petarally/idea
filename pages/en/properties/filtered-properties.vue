<template>
  <div>
    <Navbar :currentLang="currentLang" :navBarStrings="navBarStrings" />
    <FilteredProperties :currentLang="'en'" />
    <Footer />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from "vue";
import FilteredProperties from "@/components/FilteredProperties.vue";
import Footer from "@/components/Footer.vue";
import Navbar from "@/components/Navbar.vue";

export default defineComponent({
  components: {
    FilteredProperties,
    Footer,
    Navbar,
  },
  setup() {
    const currentLang = ref("en");

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
      currentLang,
      navBarStrings,
    };
  },
});
</script>
