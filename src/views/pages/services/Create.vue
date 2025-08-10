<template>
  <div class="m-3 dark-mode-support">
    <div class="card mb-3">
      <h4 class="m-0 p-3">Add New Service</h4>
    </div>

    <div class="card p-4">
      <form @submit.prevent="submitForm">
        <!-- Service Name -->
        <div class="mb-3">
          <label for="name" class="form-label">Service Name</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.name }"
            placeholder="Enter service name"
          />
          <div v-if="errors.name" class="invalid-feedback">{{ errors.name[0] }}</div>
        </div>

        <!-- Category Dropdown -->
        <div class="mb-3">
          <label for="category" class="form-label">Category</label>
          <select
            id="category"
            v-model="form.medicine_category_id"
            class="form-select"
            :class="{ 'is-invalid': errors.medicine_category_id }"
            required
          >
            <option disabled value="">-- Select Category --</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <div v-if="errors.medicine_category_id" class="invalid-feedback">
            {{ errors.medicine_category_id[0] }}
          </div>
        </div>

        <!-- Price, Discount, VAT Fields -->
        <div class="mb-3">
          <label for="price" class="form-label">Price</label>
          <input
            id="price"
            v-model="form.price"
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors.price }"
            placeholder="Enter price"
            required
          />
          <div v-if="errors.price" class="invalid-feedback">{{ errors.price[0] }}</div>
        </div>

        <div class="mb-3">
          <label for="discount" class="form-label">Discount</label>
          <input
            id="discount"
            v-model="form.discount"
            type="number"
            class="form-control"
            placeholder="Enter discount (optional)"
          />
        </div>

        <div class="mb-3">
          <label for="vat" class="form-label">VAT</label>
          <input
            id="vat"
            v-model="form.vat"
            type="number"
            class="form-control"
            placeholder="Enter VAT (optional)"
          />
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-between">
          <router-link to="/services" class="btn btn-secondary">
            Cancel
          </router-link>
          <button type="submit" class="btn btn-success" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Save Service
          </button>
        </div>
      </form>
    </div>

    <!-- Toast for Feedback -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
      <div
        class="toast align-items-center text-white"
        role="alert"
        :class="['toast', toastType, { show: showToast }]"
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
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

const form = ref({
  name: '',
  medicine_category_id: '',
  price: '',
  discount: 0,
  vat: 0,
});

const categories = ref([]);
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

async function fetchCategories() {
  try {
    const res = await axios.get(`${BASE_URL}/medicine-categories`);
    if (res.data.success) {
      categories.value = res.data.data.data;
    }
  } catch (err) {
    console.error('Failed to load categories', err);
  }
}

async function submitForm() {
  loading.value = true;
  errors.value = {};
  try {
    const res = await axios.post(`${BASE_URL}/services`, form.value);
    if (res.data.success) {
      showToastMessage('Service created successfully.', 'bg-success');
      router.push('/services');
    } else {
      showToastMessage('Failed to create service.', 'bg-danger');
    }
  } catch (err) {
    if (err.response && err.response.status === 422) {
      errors.value = err.response.data.errors;
    } else {
      console.error(err);
      showToastMessage('An unexpected error occurred.', 'bg-danger');
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCategories();
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
