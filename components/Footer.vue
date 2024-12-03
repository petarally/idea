<template>
  <footer class="flex flex-col justify-between bg-white">
    <div
      class="flex justify-center items-center py-12 md:justify-start md:items-start"
    >
      <img src="../public/logo.png" alt="Logo" class="max-h-24 ml-0 md:ml-44" />
    </div>
    <div class="text-center bg-[#3951A5] py-4" :style="{ color: '#D9D9D9' }">
      <p>&copy; {{ currentYear }} Istrian-villas</p>
    </div>
  </footer>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>
