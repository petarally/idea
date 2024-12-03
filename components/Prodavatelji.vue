<template>
  <div class="p-4">
    <h2 class="text-2xl font-semibold mb-4">Prodavatelji</h2>
    <div class="overflow-x-auto">
      <table class="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th
              class="px-4 py-2 border-b bg-gray-100 text-left text-sm font-semibold text-gray-700"
            >
              Ime i prezime
            </th>
            <th
              class="px-4 py-2 border-b bg-gray-100 text-left text-sm font-semibold text-gray-700"
            >
              Telefon
            </th>
            <th
              class="px-4 py-2 border-b bg-gray-100 text-left text-sm font-semibold text-gray-700"
            >
              Email
            </th>
            <th
              class="px-4 py-2 border-b bg-gray-100 text-left text-sm font-semibold text-gray-700"
            >
              Prodavateljeve nekretnine
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="seller in uniqueSellers"
            :key="seller.email"
            class="hover:bg-gray-100"
          >
            <td class="px-4 py-2 border-b">{{ seller.name }}</td>
            <td class="px-4 py-2 border-b">{{ seller.phone }}</td>
            <td class="px-4 py-2 border-b">{{ seller.email }}</td>
            <td class="px-4 py-2 border-b">
              <ul>
                <li v-for="property in seller.properties" :key="property.id">
                  <a
                    :href="`/property/${property.id}`"
                    class="text-blue-500 hover:underline"
                  >
                    {{ property.name }}
                  </a>
                </li>
              </ul>
            </td>
          </tr>
          <tr v-if="uniqueSellers.length === 0">
            <td colspan="4" class="px-4 py-2 text-center text-gray-500">
              Nema dostupnih prodavatelja
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { useFirestore } from "vuefire";

// State to hold the list of unique sellers
const uniqueSellers = ref<
  Array<{
    name: string;
    phone: string;
    email: string;
    properties: Array<{ id: string; name: string }>;
  }>
>([]);

// Firestore reference
const firestore = useFirestore();
const realtyCollection = collection(firestore, "nekretnine");

// Fetch the list of sellers from Firestore on component mount
onMounted(async () => {
  const realtySnapshot = await getDocs(realtyCollection);
  const allSellers = new Map();

  realtySnapshot.forEach((doc) => {
    const data = doc.data();
    const sellerKey = data.sellerEmail;

    if (!allSellers.has(sellerKey)) {
      // Add new seller to the map
      allSellers.set(sellerKey, {
        name: data.sellerName,
        phone: data.sellerPhone,
        email: data.sellerEmail,
        properties: [{ id: doc.id, name: data.propertyName }],
      });
    } else {
      // Append the property to the existing seller's list of properties
      allSellers
        .get(sellerKey)
        .properties.push({ id: doc.id, name: data.propertyName });
    }
  });

  // Convert Map to an array
  uniqueSellers.value = Array.from(allSellers.values());
});
</script>
