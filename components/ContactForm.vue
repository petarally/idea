<template>
  <div class="flex justify-center mt-10">
    <div class="w-full max-w-md p-6 bg-white border border-gray-200 shadow-lg">
      <form @submit.prevent="submitForm" class="space-y-6">
        <div class="form-group">
          <label for="name" class="block text-sm font-medium text-gray-700">
            {{ formLabels.name }}
          </label>
          <input
            type="text"
            id="name"
            v-model="form.name"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div class="form-group">
          <label for="surname" class="block text-sm font-medium text-gray-700">
            {{ formLabels.surname }}
          </label>
          <input
            type="text"
            id="surname"
            v-model="form.surname"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div class="form-group">
          <label for="email" class="block text-sm font-medium text-gray-700">
            {{ formLabels.email }}
          </label>
          <input
            type="email"
            id="email"
            v-model="form.email"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        <div class="form-group">
          <label for="message" class="block text-sm font-medium text-gray-700">
            {{ formLabels.message }}
          </label>
          <textarea
            id="message"
            v-model="form.message"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>
        <div>
          <button
            type="submit"
            class="w-full bg-black text-white py-2 px-4 hover:bg-gray-700 transition"
          >
            {{ formLabels.submitButton }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    propertyId: {
      type: String,
      required: true,
    },
    currentLang: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      form: {
        name: "",
        surname: "",
        email: "",
        message: "",
      },
    };
  },
  computed: {
    formLabels() {
      const labels = {
        en: {
          name: "Name",
          surname: "Surname",
          email: "Email",
          message: "Message",
          submitButton: "Submit",
        },
        hr: {
          name: "Ime",
          surname: "Prezime",
          email: "Email",
          message: "Poruka",
          submitButton: "Pošalji",
        },
        it: {
          name: "Nome",
          surname: "Cognome",
          email: "Email",
          message: "Messaggio",
          submitButton: "Invia",
        },
        de: {
          name: "Name",
          surname: "Nachname",
          email: "Email",
          message: "Nachricht",
          submitButton: "Senden",
        },
      };
      return labels[this.currentLang] || labels.en;
    },
  },
  methods: {
    submitForm() {
      const subject = `Property Inquiry: ${this.propertyId}`;
      const body = `
Name: ${this.form.name}
Surname: ${this.form.surname}
Email: ${this.form.email}
Message: ${this.form.message}
Property ID: ${this.propertyId}
    `;

      window.location.href = `mailto:villaistrian@gmail.com?subject=${encodeURIComponent(
        subject
      )}&body=${encodeURIComponent(body)}`;
    },
  },
};
</script>
