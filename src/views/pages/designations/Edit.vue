<template>
  <div class="m-3 dark-mode-support">
    <div class="card p-3">
      <h4 class="mb-3">Edit Designation</h4>

      <form @submit.prevent="submitForm">
        <div class="mb-3">
          <label for="name" class="form-label">Designation Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            placeholder="Enter designation name"
          />
          <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
        </div>

        <button class="btn btn-primary" type="submit" :disabled="loading">
          <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
          Update
        </button>
        <router-link to="/designations" class="btn btn-secondary ms-2">Cancel</router-link>
      </form>
    </div>

    <!-- Toast Notification -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
      <div
        class="toast align-items-center text-white"
        role="alert"
        :class="['toast', toastType, { show: showToast }]"
        aria-live="assertive"
        aria-atomic="true">
        <div class="d-flex">
          <div class="toast-body">{{ toastMessage }}</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="showToast = false"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();

const form = ref({
  name: '',
});
const errors = ref({});
const loading = ref(false);

const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('bg-success');

function showToastMessage(message, type = 'bg-success') {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

async function fetchDesignation() {
  loading.value = true;
  try {
    const res = await axios.get(`${BASE_URL}/designations/${route.params.id}`);
    if (res.data.success) {
      form.value.name = res.data.data.name;
    } else {
      showToastMessage('Failed to load designation.', 'bg-danger');
      router.push('/designations');
    }
  } catch (error) {
    showToastMessage('An error occurred.', 'bg-danger');
    router.push('/designations');
  } finally {
    loading.value = false;
  }
}

async function submitForm() {
  loading.value = true;
  errors.value = {};
  try {
    const res = await axios.put(`${BASE_URL}/designations/${route.params.id}`, form.value);
    if (res.data.success) {
      showToastMessage('Designation updated successfully.', 'bg-success');
      router.push('/designations');
    } else {
      showToastMessage('Failed to update designation.', 'bg-danger');
    }
  } catch (error) {
    if (error.response && error.response.status === 422) {
      errors.value = error.response.data.errors || {};
    } else {
      showToastMessage('An error occurred.', 'bg-danger');
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchDesignation();
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
