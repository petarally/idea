<script setup>
import { defineProps } from "vue";
import { useRoute, useRouter } from "vue-router";

const props = defineProps({
  currentLang: {
    type: String,
    required: true,
  },
  navBarStrings: {
    type: Array,
    required: true,
  },
});

const route = useRoute();
const router = useRouter();

const pathMappings = {
  it: {
    "immobilien/gefilterte-immobilien": "immobili/proprieta-filtrate",
    "properties/filtered-properties": "immobili/proprieta-filtrate",
    "nekretnine/filtrirane-nekretnine": "immobili/proprieta-filtrate",
    "immobilien/": "immobili/",
    "properties/": "immobili/",
    "nekretnine/": "immobili/",
  },
  de: {
    "immobili/proprieta-filtrate": "immobilien/gefilterte-immobilien",
    "properties/filtered-properties": "immobilien/gefilterte-immobilien",
    "nekretnine/filtrirane-nekretnine": "immobilien/gefilterte-immobilien",
    "immobili/": "immobilien/",
    "properties/": "immobilien/",
    "nekretnine/": "immobilien/",
  },
  en: {
    "immobili/proprieta-filtrate": "properties/filtered-properties",
    "immobilien/gefilterte-immobilien": "properties/filtered-properties",
    "nekretnine/filtrirane-nekretnine": "properties/filtered-properties",
    "immobili/": "properties/",
    "immobilien/": "properties/",
    "nekretnine/": "properties/",
  },
  hr: {
    "immobili/proprieta-filtrate": "nekretnine/filtrirane-nekretnine",
    "immobilien/gefilterte-immobilien": "nekretnine/filtrirane-nekretnine",
    "properties/filtered-properties": "nekretnine/filtrirane-nekretnine",
    "immobili/": "nekretnine/",
    "immobilien/": "nekretnine/",
    "properties/": "nekretnine/",
  },
};

const switchLanguage = (lang) => {
  const pathSegments = route.path.split("/");
  const currentPath = pathSegments.slice(2).join("/"); // Get the path after the language segment
  const newPath = pathMappings[lang][currentPath] || currentPath; // Map the path to the new language or keep it the same
  router.push({ path: `/${lang}/${newPath}`, query: route.query });
};
</script>

<template>
  <div>
    <!-- Language and Mail Section -->
    <div
      class="flex flex-col md:flex-row justify-between items-center py-1 px-4 md:px-16 lg:px-60 bg-[#556DAC] text-[#D9D9D9] border-b border-[#4A5C9A]"
    >
      <!-- Email Link -->
      <div class="flex items-center gap-2 mb-2 md:mb-0">
        <i class="fas fa-envelope"></i>
        <a href="mailto:villaistrian@gmail.com" class="hover:underline"
          >villaistrian@gmail.com</a
        >
      </div>
      <!-- Language Switcher -->
      <div class="flex gap-2 md:gap-4">
        <a
          href="#"
          @click.prevent="switchLanguage('hr')"
          class="text-[#D9D9D9] font-medium py-1 px-2 hover:bg-[#4A5C9A] rounded transition duration-300"
          >HR</a
        >
        <a
          href="#"
          @click.prevent="switchLanguage('en')"
          class="text-[#D9D9D9] font-medium py-1 px-2 hover:bg-[#4A5C9A] rounded transition duration-300"
          >EN</a
        >
        <a
          href="#"
          @click.prevent="switchLanguage('it')"
          class="text-[#D9D9D9] font-medium py-1 px-2 hover:bg-[#4A5C9A] rounded transition duration-300"
          >IT</a
        >
        <a
          href="#"
          @click.prevent="switchLanguage('de')"
          class="text-[#D9D9D9] font-medium py-1 px-2 hover:bg-[#4A5C9A] rounded transition duration-300"
          >DE</a
        >
      </div>
    </div>

    <!-- Navbar Section -->
    <nav
      class="flex flex-col md:flex-row justify-between items-center py-6 px-4 md:px-16 lg:px-4 bg-white max-w-screen-xl mx-auto"
    >
      <!-- Logo -->
      <div class="mb-4 md:mb-0">
        <nuxt-link :to="`/${currentLang}`">
          <img src="/logo.png" alt="Logo" class="h-16 md:h-20 cursor-pointer" />
        </nuxt-link>
      </div>

      <!-- Phone Number -->
      <a
        href="tel:+00385916002494"
        class="flex items-center py-2 px-4 md:py-4 md:px-8 bg-[#556DAC] text-white hover:bg-[#3D4F8C] transition-colors duration-300 rounded"
      >
        <i class="fa fa-phone"></i>
        <span class="ml-2">{{ navBarStrings[4] }}</span>
      </a>
    </nav>
  </div>
</template>
