<template>
  <div class="m-3 dark-mode-support">
    <div class="card p-4">
      <h4 class="mb-4">Add New Department</h4>

      <form @submit.prevent="submitDepartment">
        <!-- Department Name -->
        <div class="mb-3">
          <label class="form-label">Department Name</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            placeholder="Enter department name"
            :class="{ 'is-invalid': errors.name }"
          />
          <div class="invalid-feedback" v-if="errors.name">
            {{ errors.name }}
          </div>
        </div>

        <!-- Actions -->
        <div class="d-flex justify-content-between mt-4">
          <router-link to="/departments" class="btn btn-secondary">
            Cancel
          </router-link>
          <button type="submit" class="btn btn-success">Save</button>
        </div>
      </form>
    </div>

    <!-- Toast Notification -->
    <div
      class="toast-container position-fixed bottom-0 end-0 p-3"
      style="z-index: 1055"
    >
      <div
        class="toast align-items-center text-white"
        role="alert"
        :class="[toastType, { show: showToast }]"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toastMessage }}</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="showToast = false"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Form state
const form = ref({
  name: "",
});

// Error state
const errors = ref({});

// Toast state
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("bg-success");

// Toast utility
function showToastMessage(message, type = "bg-success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

// Submit form
async function submitDepartment() {
  errors.value = {};

  try {
    const res = await axios.post(`${BASE_URL}/departments`, form.value);
    if (res.data.success) {
      showToastMessage("Department created successfully.", "bg-success");
      router.push("/departments");
    } else {
      showToastMessage("Something went wrong.", "bg-danger");
    }
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors;
    } else {
      console.error(error);
      showToastMessage("Failed to create department.", "bg-danger");
    }
  }
}
</script>

<style scoped>
/* Optional dark theme tweaks */
body.dark .bg-success {
  background-color: #28a745 !important;
}
body.dark .bg-danger {
  background-color: #dc3545 !important;
}
</style>
