import { defineNuxtPlugin } from "#app";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig(); // Get runtime config
  const apiKey = config.public.GOOGLE_MAPS_API_KEY; // Corrected key reference

  if (!apiKey) {
    console.error("Google Maps API key is not defined. Check your .env file.");
    return;
  }

  if (typeof window !== "undefined") {
    const googleMapsScript = document.createElement("script");
    googleMapsScript.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    googleMapsScript.async = true;
    googleMapsScript.defer = true;

    // Load Google Maps API
    googleMapsScript.onload = () => {
      console.log("Google Maps API loaded successfully.");
      // Emit an event or set a flag that Google Maps has loaded
      window.dispatchEvent(new Event("google-maps-loaded"));
    };

    googleMapsScript.onerror = () => {
      console.error("Failed to load the Google Maps API script.");
    };

    document.head.appendChild(googleMapsScript);
  }
});
