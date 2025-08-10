<template>
  <div class="m-3 dark-mode-support">
    <div class="card p-4">
      <h4 class="mb-4">Edit Service</h4>
      <form @submit.prevent="submitForm">
        <!-- Name -->
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
          <div class="invalid-feedback" v-if="errors.name">{{ errors.name[0] }}</div>
        </div>

        <!-- Category -->
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
          <div class="invalid-feedback" v-if="errors.medicine_category_id">
            {{ errors.medicine_category_id[0] }}
          </div>
        </div>

        <!-- Price, Discount, VAT -->
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
          <div class="invalid-feedback" v-if="errors.price">{{ errors.price[0] }}</div>
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

        <!-- Action Buttons -->
        <div class="d-flex justify-content-between">
          <router-link to="/services" class="btn btn-secondary">Cancel</router-link>
          <button type="submit" class="btn btn-success" :disabled="loading">
            <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
            Update Service
          </button>
        </div>
      </form>
    </div>

    <!-- Toast Notifications -->
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
import { useRoute, useRouter } from 'vue-router';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
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

function showToastMessage(msg, type = 'bg-success') {
  toastMessage.value = msg;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

async function fetchCategories() {
  try {
    const res = await axios.get(`${BASE_URL}/medicine-categories`);
    if (res.data.success) categories.value = res.data.data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
}

async function fetchService() {
  loading.value = true;
  try {
    const res = await axios.get(`${BASE_URL}/services/${route.params.id}`);
    if (res.data.success) {
      Object.assign(form.value, {
        name: res.data.data.name,
        medicine_category_id: res.data.data.medicine_category_id,
        price: res.data.data.price,
        discount: res.data.data.discount,
        vat: res.data.data.vat,
      });
    } else {
      showToastMessage('Failed to load service.', 'bg-danger');
      router.push('/services');
    }
  } catch (err) {
    console.error(err);
    showToastMessage('Error loading service.', 'bg-danger');
    router.push('/services');
  } finally {
    loading.value = false;
  }
}

async function submitForm() {
  loading.value = true;
  errors.value = {};
  try {
    const res = await axios.put(`${BASE_URL}/services/${route.params.id}`, form.value);
    if (res.data.success) {
      showToastMessage('Service updated successfully.', 'bg-success');
      router.push('/services');
    } else {
      showToastMessage('Failed to update service.', 'bg-danger');
    }
  } catch (err) {
    if (err.response?.status === 422) {
      errors.value = err.response.data.errors;
    } else {
      console.error(err);
      showToastMessage('An error occurred during update.', 'bg-danger');
    }
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchCategories();
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
