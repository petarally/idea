<template>
  <div class="p-4">
    <h2 class="text-2xl font-bold mb-4">Profile</h2>

    <!-- Email Field -->
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="email">
        Email
      </label>
      <input
        type="email"
        id="email"
        v-model="email"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        disabled
      />
    </div>

    <!-- New Password Field -->
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="password">
        New Password
      </label>
      <input
        type="password"
        id="password"
        v-model="password"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Enter new password"
      />
    </div>

    <!-- Current Password Field for Re-authentication -->
    <div class="mb-4">
      <label
        class="block text-gray-700 text-sm font-bold mb-2"
        for="currentPassword"
      >
        Current Password
      </label>
      <input
        type="password"
        id="currentPassword"
        v-model="currentPassword"
        class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        placeholder="Enter current password"
      />
    </div>

    <!-- Update Profile Button -->
    <button
      @click="updateUserProfile"
      class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    >
      Update Profile
    </button>

    <!-- Change Password Button -->
    <button
      @click="changeUserPassword"
      class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
    >
      Change Password
    </button>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
import {
  getAuth,
  updateProfile as firebaseUpdateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";

// State for profile form
const displayName = ref("");
const email = ref("");
const password = ref("");
const currentPassword = ref("");

// Initialize Firebase Auth
const auth = getAuth();
const user = auth.currentUser;

if (user) {
  displayName.value = user.displayName || "";
  email.value = user.email || "";
}

// Handle profile update
const updateUserProfile = async () => {
  if (user) {
    try {
      await firebaseUpdateProfile(user, { displayName: displayName.value });
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile: ", error);
      alert("Failed to update profile.");
    }
  }
};

// Handle password update
const changeUserPassword = async () => {
  if (user && password.value && currentPassword.value) {
    try {
      // Re-authenticate the user
      const credential = EmailAuthProvider.credential(
        user.email!,
        currentPassword.value
      );
      await reauthenticateWithCredential(user, credential);

      // Update the password
      await user.updatePassword(password.value);
      alert("Password updated successfully!");
    } catch (error: any) {
      console.error("Error updating password: ", error);
      if (error.code === "auth/wrong-password") {
        alert("The current password is incorrect.");
      } else if (error.code === "auth/user-mismatch") {
        alert("The user account does not match the provided credentials.");
      } else if (error.code === "auth/too-many-requests") {
        alert(
          "Too many attempts to update the password. Please try again later."
        );
      } else {
        alert(`Failed to update password: ${error.message}`);
      }
    }
  } else {
    alert("Please enter both your current and new passwords.");
  }
};
</script>
