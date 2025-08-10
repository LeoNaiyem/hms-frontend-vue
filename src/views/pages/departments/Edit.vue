<template>
  <div class="m-3 dark-mode-support">
    <div class="card p-4">
      <h4 class="mb-4">Edit Department</h4>

      <form @submit.prevent="updateDepartment">
        <!-- Department Name -->
        <div class="mb-3">
          <label class="form-label">Department Name</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
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
          <button type="submit" class="btn btn-success">Update</button>
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
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();
const departmentId = route.params.id;

const form = ref({
  name: "",
});

const errors = ref({});

const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("bg-success");

function showToastMessage(message, type = "bg-success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

async function fetchDepartment() {
  try {
    const res = await axios.get(`${BASE_URL}/departments/${departmentId}`);
    if (res.data.success) {
      form.value = {
        name: res.data.data.name,
      };
    } else {
      showToastMessage("Failed to load department.", "bg-danger");
    }
  } catch (err) {
    console.error(err);
    showToastMessage("An error occurred while loading data.", "bg-danger");
  }
}

async function updateDepartment() {
  errors.value = {};
  try {
    const res = await axios.put(
      `${BASE_URL}/departments/${departmentId}`,
      form.value
    );
    if (res.data.success) {
      showToastMessage("Department updated successfully.", "bg-success");
      router.push("/departments");
    } else {
      showToastMessage("Update failed.", "bg-danger");
    }
  } catch (err) {
    if (err.response?.data?.errors) {
      errors.value = err.response.data.errors;
    } else {
      console.error(err);
      showToastMessage("An error occurred.", "bg-danger");
    }
  }
}

onMounted(() => {
  fetchDepartment();
});
</script>

<style scoped>
body.dark .bg-success {
  background-color: #28a745 !important;
}
body.dark .bg-danger {
  background-color: #dc3545 !important;
}
</style>
