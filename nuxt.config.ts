import { favicons } from "./config/favicon-config";

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      NUXT_PUBLIC_FIREBASE_API_KEY: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
        process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NUXT_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
        process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NUXT_PUBLIC_FIREBASE_APP_ID: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID:
        process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
      GOOGLE_MAPS_API_KEY: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
    },
  },
  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css",
        },
        { rel: "icon", type: "image/x-icon", href: favicons.faviconICO },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: favicons.favicon16x16,
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: favicons.favicon32x32,
        },
      ],
      title: "Istrian Villa",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
        {
          hid: "description",
          name: "description",
          content: "Istrian Villa",
        },
      ],
    },
  },
  router: {
    middleware: ["auth"],
    extendRoutes(routes, resolve) {
      routes.push({
        path: "/",
        redirect: "/hr",
      });
    },
  },
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  ssr: false, // Disable server-side rendering
  modules: ["@nuxtjs/tailwindcss", "nuxt-vuefire", "nuxt-easy-lightbox"],
  vuefire: {
    auth: {
      enabled: true,
      sessionCookie: false,
    },
    firestore: true,
    storage: true,
    config: {
      apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID,
      measurementId: process.env.NUXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
    },
  },
  plugins: ["~/plugins/google-maps.ts"],
});
