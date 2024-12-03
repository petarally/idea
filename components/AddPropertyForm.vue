<template>
  <div class="w-full bg-white rounded-lg shadow-md p-8">
    <h2 class="text-3xl font-bold mb-6 text-gray-800">Dodajte nekretninu</h2>
    <form @submit.prevent="addRealty">
      <!-- Property Name Section -->
      <div class="mb-4">
        <div class="flex mb-2 language-buttons">
          <button
            type="button"
            @click="currentLanguage = 'hr'"
            :class="{ active: currentLanguage === 'hr' }"
            class="py-2 px-4 rounded-l"
          >
            HR
          </button>
          <button
            type="button"
            @click="currentLanguage = 'en'"
            :class="{ active: currentLanguage === 'en' }"
            class="py-2 px-4"
          >
            EN
          </button>
          <button
            type="button"
            @click="currentLanguage = 'it'"
            :class="{ active: currentLanguage === 'it' }"
            class="py-2 px-4"
          >
            IT
          </button>
          <button
            type="button"
            @click="currentLanguage = 'de'"
            :class="{ active: currentLanguage === 'de' }"
            class="py-2 px-4 rounded-r"
          >
            DE
          </button>
        </div>

        <!-- Property Name Input Fields -->
        <div class="relative mb-4">
          <input
            v-if="currentLanguage === 'hr'"
            v-model="propertyName.hr"
            placeholder="Naziv nekretnine"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            v-if="currentLanguage === 'en'"
            v-model="propertyName.en"
            placeholder="Enter property name"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            v-if="currentLanguage === 'it'"
            v-model="propertyName.it"
            placeholder="Nome della proprietà"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <input
            v-if="currentLanguage === 'de'"
            v-model="propertyName.de"
            placeholder="Name der Immobilie"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
          <!--
          <button
            v-if="currentLanguage !== 'hr'"
            @click="translatePropertyName"
            type="button"
            class="absolute right-0 top-0 mt-2 mr-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Translate
          </button>
          -->
        </div>
      </div>

      <!-- Address -->
      <div class="mb-4">
        <label
          for="address-input"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Adresa
        </label>
        <input
          id="address-input"
          type="text"
          v-model="inputAddress"
          placeholder="Unesite adresu"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <div id="map" class="mt-4" style="height: 300px; width: 100%"></div>
      </div>

      <!-- Price -->
      <div class="mb-4">
        <label for="price" class="block text-gray-700 text-sm font-bold mb-2">
          Cijena
        </label>
        <input
          type="number"
          id="price"
          v-model="price"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="€"
        />
      </div>

      <!-- Livable Area -->
      <div class="mb-4">
        <label
          for="livable-area"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Stambena površina
        </label>
        <input
          type="number"
          id="livable-area"
          v-model="livableArea"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="m²"
        />
      </div>

      <!-- Bedrooms -->
      <div class="mb-4">
        <label
          for="bedrooms"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Broj Soba
        </label>
        <input
          type="number"
          id="bedrooms"
          v-model="bedrooms"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Unesite broj soba"
        />
      </div>

      <!-- Bathrooms -->
      <div class="mb-4">
        <label
          for="bathrooms"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Broj Kupaonica
        </label>
        <input
          type="number"
          id="bathrooms"
          v-model="bathrooms"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="Unesite broj kupaonica"
        />
      </div>

      <!-- Garden Area -->
      <div class="mb-4">
        <label
          for="garden-area"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Okućnica
        </label>
        <input
          type="number"
          id="garden-area"
          v-model="gardenArea"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          placeholder="m²"
        />
      </div>

      <!-- Amenities -->
      <div class="mb-10">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Sadržaji
        </label>
        <div class="flex flex-wrap gap-4">
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="amenities.wifi"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="ml-2">Wi-Fi</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="amenities.parking"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="ml-2">Parking</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="amenities.pool"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="ml-2">Bazen</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="amenities.garage"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="ml-2">Garaža</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="amenities.seaView"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="ml-2">Pogled more</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="amenities.accessToBeach"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="ml-2">Prilaz plaži</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="amenities.septicTank"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="ml-2">Septička</span>
          </label>
          <label class="inline-flex items-center">
            <input
              type="checkbox"
              v-model="amenities.sewageSystem"
              class="form-checkbox h-5 w-5 text-blue-600"
            />
            <span class="ml-2">Kanalizacija</span>
          </label>
        </div>
      </div>

      <div class="mb-4">
        <div class="flex mb-2 language-buttons">
          <button
            type="button"
            @click="descriptionLanguage = 'hr'"
            :class="{ active: descriptionLanguage === 'hr' }"
            class="py-2 px-4 rounded-l"
          >
            HR
          </button>
          <button
            type="button"
            @click="descriptionLanguage = 'en'"
            :class="{ active: descriptionLanguage === 'en' }"
            class="py-2 px-4"
          >
            EN
          </button>
          <button
            type="button"
            @click="descriptionLanguage = 'it'"
            :class="{ active: descriptionLanguage === 'it' }"
            class="py-2 px-4"
          >
            IT
          </button>
          <button
            type="button"
            @click="descriptionLanguage = 'de'"
            :class="{ active: descriptionLanguage === 'de' }"
            class="py-2 px-4 rounded-r"
          >
            DE
          </button>
        </div>

        <!-- Description Input Fields -->
        <div class="relative mb-4">
          <textarea
            v-if="descriptionLanguage === 'hr'"
            v-model="description.hr"
            placeholder="Opis nekretnine"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <textarea
            v-if="descriptionLanguage === 'en'"
            v-model="description.en"
            placeholder="Property description"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <textarea
            v-if="descriptionLanguage === 'it'"
            v-model="description.it"
            placeholder="Descrizione della proprietà"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <textarea
            v-if="descriptionLanguage === 'de'"
            v-model="description.de"
            placeholder="Immobilienbeschreibung"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
          <!--
          <button
            v-if="descriptionLanguage !== 'hr'"
            @click="translateDescription"
            type="button"
            class="absolute right-0 top-0 mt-2 mr-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Translate
          </button>
          -->
        </div>
      </div>

      <div class="mb-4">
        <label
          for="build-type"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Tip Građevine
        </label>
        <select
          id="build-type"
          v-model="buildType"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="villa">Vila</option>
          <option value="apartment">Stan</option>
          <option value="field">Zemljište</option>
        </select>
      </div>

      <div class="mb-4">
        <label
          for="build-year"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Novogradnja/Starogradnja
        </label>
        <select
          id="build-year"
          v-model="buildYear"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="new">Novogradnja</option>
          <option value="old">Starogradnja</option>
        </select>
      </div>

      <!-- Sale Type -->
      <div class="mb-4">
        <label
          for="sale-type"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Vrsta Prodaje
        </label>
        <select
          id="sale-type"
          v-model="saleType"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
          <option value="direct">Direktna prodaja</option>
          <option value="resell">Resell</option>
        </select>
      </div>

      <!-- Image Upload Section -->
      <div class="mb-4">
        <label class="block text-gray-700 text-sm font-bold mb-2">
          Dodajte fotografije (Drag & Drop ili Click)
        </label>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <!-- Main Image -->
          <div class="col-span-2 row-span-2 relative">
            <div
              @drop="handleDrop($event, 0)"
              @dragover="handleDragOver"
              class="image-dropzone border-2 border-dashed border-gray-300 p-2 flex items-center justify-center cursor-pointer"
              style="height: 100%"
            >
              <img
                v-if="imagePreviews[0]"
                :src="imagePreviews[0]"
                alt="Main Image Preview"
                class="w-full h-full object-cover"
              />
              <input
                type="file"
                class="absolute inset-0 opacity-0 cursor-pointer"
                @change="(event) => previewImage(event, 0)"
              />
              <p v-if="!imagePreviews[0]" class="text-gray-500">Glavna slika</p>
            </div>
          </div>
          <!-- Other Images -->
          <div
            v-for="(preview, index) in imagePreviews.slice(1, 5)"
            :key="index"
            class="relative"
          >
            <div
              @drop="handleDrop($event, index + 1)"
              @dragover="handleDragOver"
              class="image-dropzone border-2 border-dashed border-gray-300 p-2 flex items-center justify-center cursor-pointer"
            >
              <img
                v-if="preview"
                :src="preview"
                alt="Image Preview"
                class="w-full h-full object-cover"
              />
              <input
                type="file"
                class="absolute inset-0 opacity-0 cursor-pointer"
                @change="(event) => previewImage(event, index + 1)"
              />
              <p v-if="!preview" class="text-gray-500">Foto {{ index + 2 }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Name and surname of seller -->
      <div class="mb-4">
        <label
          for="seller-name-input"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Ime i prezime prodavatelja
        </label>
        <input
          id="seller-name-input"
          type="text"
          v-model="sellerName"
          placeholder="Unesite ime i prezime prodavatelja"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <!-- Phone of seller -->
      <div class="mb-4">
        <label
          for="seller-phone-input"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Telefon prodavatelja
        </label>
        <input
          id="seller-phone-input"
          type="tel"
          v-model="sellerPhone"
          placeholder="Unesite telefon prodavatelja"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <!-- Email of seller -->
      <div class="mb-4">
        <label
          for="seller-email-input"
          class="block text-gray-700 text-sm font-bold mb-2"
        >
          Email prodavatelja
        </label>
        <input
          id="seller-email-input"
          type="email"
          v-model="sellerEmail"
          placeholder="Unesite email prodavatelja"
          class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
      </div>

      <!-- Submit Button -->
      <div class="flex items-center justify-end">
        <button
          type="submit"
          class="add-button bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700 transition"
        >
          Dodajte nekretninu
        </button>
      </div>
    </form>
  </div>
</template>

<script lang="ts" setup>
/// <reference types="@types/google.maps" />
import { ref, onMounted, nextTick, watch } from "vue";
import { useFirebaseAuth, useFirestore, useStorage } from "vuefire";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import axios from "axios";

// Initialize Firestore and Storage
const firestore = useFirestore();
const auth = getAuth(); // Initialize Firebase Auth
const storage = useStorage();
const realtyCollection = collection(firestore, "nekretnine");

// Form state
const propertyName = ref({
  en: "",
  hr: "",
  it: "",
  de: "",
});
const address = ref("");
const price = ref("");
const livableArea = ref("");
const bedrooms = ref("");
const bathrooms = ref("");
const gardenArea = ref("");
const sellerName = ref("");
const sellerEmail = ref("");
const sellerPhone = ref("");
const amenities = ref({
  wifi: false,
  parking: false,
  pool: false,
  garage: false,
  seaView: false,
  accessToBeach: false,
  septicTank: false,
  sewageSystem: false,
});
const description = ref({
  en: "",
  hr: "",
  it: "",
  de: "",
});
const currentLanguage = ref("hr");
const descriptionLanguage = ref("hr");
const buildType = ref("villa");
const buildYear = ref("new");
const saleType = ref("direct");
const user = ref<null>(null); // Ensure proper typing based on your auth setup

// Translation functions
const translatePropertyName = async () => {
  try {
    const requestData = {
      text: propertyName.value[currentLanguage.value],
      targetLang: currentLanguage.value,
    };

    console.log("Request data:", requestData); // Debugging line

    const response = await axios.post("/api/translate", requestData);
    propertyName.value[currentLanguage.value] = response.data.translatedText;
  } catch (error) {
    console.error("Translation failed", error);
  }
};

const translateDescription = async () => {
  try {
    console.log("Translating description...");
    const response = await axios.post("/api/translate", {
      text: description.value.hr,
      targetLanguage: descriptionLanguage.value,
    });
    console.log("Translation response:", response.data);
    description.value[descriptionLanguage.value] = response.data.translatedText;
  } catch (error) {
    console.error("Error translating description:", error);
    alert("Error translating description. Please try again.");
  }
};

// Image state
const images = ref<Blob[]>([]);
const imagePreviews = ref<string[]>(new Array(5).fill(null));

// Convert image to WebP format and resize it
const convertImageToWebP = async (
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      // Adjust the quality setting for better clarity
      const dataUrl = canvas.toDataURL("image/webp", 0.9); // Adjusted quality to 0.9
      resolve(dataUrlToBlob(dataUrl));
    };

    img.onerror = (err) => reject(err);
    img.src = URL.createObjectURL(file);
  });
};

// Utility function to convert data URL to Blob
const dataUrlToBlob = (dataUrl: string): Blob => {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new Blob([u8arr], { type: mime });
};

const inputAddress = ref("");
const map = ref<google.maps.Map | null>(null);
const marker = ref<google.maps.Marker | null>(null);

const initMap = () => {
  nextTick(() => {
    const mapDiv = document.getElementById("map") as HTMLElement;
    if (mapDiv) {
      const mapOptions: google.maps.MapOptions = {
        center: { lat: 45.25, lng: 13.75 },
        zoom: 8,
      };

      map.value = new google.maps.Map(mapDiv, mapOptions);

      const autocomplete = new google.maps.places.Autocomplete(
        document.getElementById("address-input") as HTMLInputElement
      );
      autocomplete.bindTo("bounds", map.value);

      marker.value = new google.maps.Marker({
        map: map.value,
        anchorPoint: new google.maps.Point(0, -29),
      });

      autocomplete.addListener("place_changed", () => {
        marker.value?.setVisible(false);
        const place = autocomplete.getPlace();
        if (!place.geometry) {
          console.error('No details available for input: "' + place.name + '"');
          return;
        }

        if (place.geometry.viewport) {
          map.value?.fitBounds(place.geometry.viewport);
        } else {
          map.value?.setCenter(place.geometry.location);
          map.value?.setZoom(17);
        }

        marker.value?.setPosition(place.geometry.location);
        marker.value?.setVisible(true);

        inputAddress.value = place.formatted_address || "";
      });
    } else {
      console.error("Map container not found");
    }
  });
};

onMounted(() => {
  initMap();
});

watch(inputAddress, (newAddress) => {
  address.value = newAddress;
});

// Handle image preview, drag-and-drop, and other events
const previewImage = async (event: Event, index: number) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    try {
      // Convert to WebP and resize
      const webpImage = await convertImageToWebP(file, 800, 800);

      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.value[index] = e.target?.result as string;
      };
      reader.readAsDataURL(webpImage);
      images.value[index] = webpImage;
    } catch (error) {
      console.error("Error processing image: ", error);
    }
  }
};

const handleDrop = async (event: DragEvent, index: number) => {
  event.preventDefault();
  const file = event.dataTransfer?.files[0];
  if (file) {
    try {
      const webpImage = await convertImageToWebP(file, 800, 800);

      const reader = new FileReader();
      reader.onload = (e) => {
        imagePreviews.value[index] = e.target?.result as string;
      };
      reader.readAsDataURL(webpImage);
      images.value[index] = webpImage;
    } catch (error) {
      console.error("Error processing image: ", error);
    }
  }
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
};

const addRealty = async () => {
  try {
    // Ensure user is authenticated and has a valid UID
    const currentUser = auth.currentUser?.uid;
    if (!currentUser) {
      throw new Error("User is not authenticated or does not have a UID.");
    }

    const uploadedImageUrls: string[] = [];
    for (let i = 0; i < images.value.length; i++) {
      if (images.value[i]) {
        const fileName = `realty_images/${Date.now()}_${i}.webp`;
        const imageRef = storageRef(storage, fileName);
        await uploadBytes(imageRef, images.value[i]);
        const downloadURL = await getDownloadURL(imageRef);
        uploadedImageUrls.push(downloadURL);
      }
    }

    const normalizeString = (str: string) => {
      return str
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "-");
    };

    const docRef = await addDoc(realtyCollection, {
      propertyName: propertyName.value,
      slugs: {
        en: normalizeString(propertyName.value.en.trim()),
        hr: normalizeString(propertyName.value.hr.trim()),
        it: normalizeString(propertyName.value.it.trim()),
        de: normalizeString(propertyName.value.de.trim()),
      },
      address: address.value,
      price: price.value,
      livableArea: livableArea.value,
      bedrooms: bedrooms.value,
      bathrooms: bathrooms.value,
      gardenArea: gardenArea.value,
      amenities: amenities.value,
      description: description.value,
      buildType: buildType.value,
      buildYear: buildYear.value,
      saleType: saleType.value,
      images: uploadedImageUrls,
      sellerName: sellerName.value,
      sellerEmail: sellerEmail.value,
      sellerPhone: sellerPhone.value,
      userId: currentUser, // Ensure userId is set
      createdAt: new Date(),
    });
    console.log("Document written with ID: ", docRef.id);

    alert("Nekretnina je uspješno dodana u bazu!");

    // Reset form
    propertyName.value = {
      en: "",
      hr: "",
      it: "",
      de: "",
    };
    address.value = "";
    price.value = "";
    livableArea.value = "";
    bedrooms.value = "";
    bathrooms.value = "";
    gardenArea.value = "";
    amenities.value = {
      wifi: false,
      parking: false,
      pool: false,
      garage: false,
      seaView: false,
      accessToBeach: false,
    };
    description.value = {
      en: "",
      hr: "",
      it: "",
      de: "",
    };
    buildType.value = "villa";
    buildYear.value = "new";
    saleType.value = "direct";
    images.value = [];
    sellerName.value = "";
    sellerEmail.value = "";
    sellerPhone.value = "";
    imagePreviews.value = new Array(5).fill(null);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};
</script>

<style scoped>
#map {
  margin-top: 10px;
  height: 300px;
  width: 100%;
}

.image-dropzone {
  height: 200px;
}

.image-dropzone img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  image-rendering: crisp-edges;
}

.add-button {
  background-color: #1d4ed8;
  color: white;
  font-weight: bold;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 16px;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.add-button:hover {
  background-color: #2563eb;
  transform: scale(1.05);
}

.add-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.6);
}

.language-buttons {
  display: flex;
  margin-bottom: 1rem;
}

.language-buttons button {
  border: 1px solid #d1d5db;
  margin-right: 0.5rem;
}

.language-buttons button:last-child {
  margin-right: 0;
}

.language-buttons .active {
  background-color: #1d4ed8;
  color: white;
}
input,
textarea {
  margin-top: 0.5rem;
}

textarea {
  min-height: 100px;
}
</style>
