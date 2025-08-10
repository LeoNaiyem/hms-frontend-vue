<template>
  <div class="m-3 dark-mode-support">
    <div class="card p-4">
      <h4 class="mb-4">View Service</h4>

      <div v-if="loading" class="text-center my-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-else>
        <div class="mb-3">
          <label class="form-label fw-bold">Service Name:</label>
          <div>{{ service.name }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Category:</label>
          <div>{{ service.medicine_category?.name || 'N/A' }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Price:</label>
          <div>₹{{ service.price }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Discount:</label>
          <div>{{ service.discount }}%</div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">VAT:</label>
          <div>{{ service.vat }}%</div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Created At:</label>
          <div>{{ formatDate(service.created_at) }}</div>
        </div>

        <div class="mb-3">
          <label class="form-label fw-bold">Updated At:</label>
          <div>{{ formatDate(service.updated_at) }}</div>
        </div>

        <div class="d-flex justify-content-between mt-4">
          <router-link to="/services" class="btn btn-secondary">Back</router-link>
          <router-link
            :to="`/services/${service.id}/edit`"
            class="btn btn-warning"
          >
            Edit Service
          </router-link>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        class="toast align-items-center text-white"
        role="alert"
        :class="['toast', toastType, { show: showToast }]"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">
            {{ toastMessage }}
          </div>
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
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();

const service = ref({});
const loading = ref(true);

// Toast
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('bg-success');

function showToastMessage(message, type = 'bg-success') {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

function formatDate(datetime) {
  return datetime ? new Date(datetime).toLocaleString() : '-';
}

async function fetchService() {
  loading.value = true;
  try {
    const res = await axios.get(`${BASE_URL}/services/${route.params.id}`);
    if (res.data.success) {
      service.value = res.data.data;
    } else {
      showToastMessage('Failed to load service details', 'bg-danger');
      router.push('/services');
    }
  } catch (err) {
    console.error(err);
    showToastMessage('Error fetching service', 'bg-danger');
    router.push('/services');
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchService();
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
