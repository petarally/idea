// middleware/auth.ts
import { useCurrentUser } from "vuefire";
import { navigateTo } from "#app";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const currentUser = useCurrentUser(); // This is a ref, so you should handle it accordingly

  if (!currentUser.value) {
    // .value because it's a ref
    return navigateTo("/login");
  }
});
