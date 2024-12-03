// plugins/vuefire.ts
import { defineNuxtPlugin } from "#app";
import { VueFire, VueFireAuth } from "vuefire";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueFire, {
    modules: [VueFireAuth()],
  });
});
