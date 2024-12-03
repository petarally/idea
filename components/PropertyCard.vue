<template>
  <div
    class="max-w-sm bg-white shadow-md overflow-hidden cursor-pointer transition-transform transform hover:-translate-y-1"
    @click="showDetails"
  >
    <img
      :src="
        property.images[0] ? property.images[0] : '/path/to/placeholder.png'
      "
      alt="Property Image"
      class="w-full h-52 object-cover"
    />
    <div class="p-4 min-h-72 max-h-72 flex flex-col justify-between">
      <div>
        <h2 class="text-lg font-semibold text-gray-800 mb-2">
          {{ property.propertyName[currentLang] || "N/A" }}
        </h2>
        <p class="text-sm text-gray-600 mb-4">
          {{ truncatedDescription }}
        </p>
      </div>
      <div class="flex gap-2 mb-4">
        <span
          v-if="property.amenities.bedrooms"
          class="flex items-center justify-center bg-gray-100 p-2 rounded text-gray-600"
        >
          <i class="fas fa-bed"></i> {{ property.amenities.bedrooms }}
        </span>
        <span
          v-if="property.amenities.bathrooms"
          class="flex items-center justify-center bg-gray-100 p-2 rounded text-gray-600"
        >
          <i class="fas fa-bath"></i> {{ property.amenities.bathrooms }}
        </span>
        <span
          v-if="property.amenities.parking"
          class="flex items-center justify-center bg-gray-100 p-2 rounded text-gray-600"
        >
          <i class="fas fa-car"></i>
        </span>
        <span
          v-if="property.amenities.garage"
          class="flex items-center justify-center bg-gray-100 p-2 rounded text-gray-600"
        >
          <i class="fas fa-warehouse"></i>
        </span>
        <span
          v-if="property.amenities.pool"
          class="flex items-center justify-center bg-gray-100 p-2 rounded text-gray-600"
        >
          <i class="fas fa-swimming-pool"></i>
        </span>
      </div>
      <div class="flex justify-between items-center">
        <p class="text-xl font-bold text-gray-900">{{ formattedPrice }} €</p>
        <button
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
        >
          Detalji
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    property: {
      type: Object,
      required: true,
    },
    currentLang: {
      type: String,
      required: true,
    },
  },
  computed: {
    formattedPrice() {
      return new Intl.NumberFormat().format(this.property.price);
    },
    truncatedDescription() {
      const fullDescription =
        this.property.description?.[this.currentLang] || "";
      const maxLength = 100; // You can change this value to control the max number of characters
      return fullDescription.length > maxLength
        ? fullDescription.substring(0, maxLength) + "..."
        : fullDescription;
    },
  },
  methods: {
    showDetails() {
      this.$emit("navigateToProperty", {
        id: this.property.id,
        slug: this.property.slugs,
      });
    },
  },
};
</script>
