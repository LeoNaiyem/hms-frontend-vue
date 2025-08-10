<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Manage Services</h4>
        <router-link to="/services/create" class="btn btn-success">
          Add New Service
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-3 my-3 d-flex align-items-center flex-row justify-content-between gap-3 flex-wrap">
      <div style="flex-grow: 2">
        <input
          v-model="filters.search"
          type="text"
          class="form-control"
          placeholder="Search by service name..."
          @input="fetchServices(1)"
        />
      </div>
      <div class="flex-grow-1">
        <select v-model="filters.category" class="form-select" @change="fetchServices(1)">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.name }}
          </option>
        </select>
      </div>
      <div class="flex-grow-1">
        <button class="btn btn-success w-100" @click="fetchServices(1)">
          Apply
        </button>
      </div>
      <div class="flex-grow-1">
        <button class="btn btn-outline-danger w-100" @click="resetFilters">
          Reset
        </button>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div class="text-center my-3" v-if="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Services Table -->
    <div class="card table-responsive">
      <table class="table table-striped align-middle">
        <thead class="table-primary">
          <tr>
            <th>#ID</th>
            <th>Service Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Discount</th>
            <th>VAT</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="service in services" :key="service.id">
            <td>{{ service.id }}</td>
            <td>{{ service.name }}</td>
            <td>{{ service.medicine_category?.name || "N/A" }}</td>
            <td>{{ service.price }}</td>
            <td>{{ service.discount || 0 }}</td>
            <td>{{ service.vat || 0 }}</td>
            <td class="text-end">
              <router-link
                :to="`/services/${service.id}`"
                class="btn btn-sm btn-outline-primary me-1"
              >
                View
              </router-link>
              <router-link
                :to="`/services/${service.id}/edit`"
                class="btn btn-sm btn-outline-warning me-1"
              >
                Edit
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(service)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="services.length === 0">
            <td colspan="7" class="text-center">No services found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav class="mt-3" v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button
            class="page-link"
            @click="fetchServices(currentPage - 1)"
            :disabled="currentPage === 1"
          >
            Previous
          </button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="fetchServices(page)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button
            class="page-link"
            @click="fetchServices(currentPage + 1)"
            :disabled="currentPage === totalPages"
          >
            Next
          </button>
        </li>
      </ul>
    </nav>

    <!-- Delete Modal -->
    <transition name="fade">
      <div class="modal-backdrop" v-if="showDeleteModal">
        <div class="modal-dialog">
          <div class="modal-content p-4 rounded gap-3 d-flex bg-light">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Deletion</h5>
              <button class="btn-close" @click="showDeleteModal = false"></button>
            </div>
            <div class="modal-body">
              Delete service <strong>#{{ serviceToDelete?.id }}</strong> -
              <strong>{{ serviceToDelete?.name }}</strong>?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button class="btn btn-secondary" @click="showDeleteModal = false">
                Cancel
              </button>
              <button class="btn btn-danger" @click="deleteService">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Bootstrap Toast -->
    <div
      class="toast-container position-fixed bottom-0 end-0 p-3"
      style="z-index: 1055"
    >
      <div
        class="toast align-items-center text-white"
        role="alert"
        :class="['toast', toastType, { show: showToast }]"
        aria-live="assertive"
        aria-atomic="true"
        ref="toastRef"
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

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const services = ref([]);
const categories = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const filters = ref({ search: '', category: '' });
const loading = ref(false);

const showDeleteModal = ref(false);
const serviceToDelete = ref(null);

// Toast state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('bg-success');
const toastRef = ref(null);

async function fetchCategories() {
  try {
    const res = await axios.get(`${BASE_URL}/medicine-categories`);
    if (res.data.success) {
      categories.value = res.data.data.data;
    }
  } catch (error) {
    console.error('Failed to fetch categories:', error);
  }
}

async function fetchServices(page = 1) {
  loading.value = true;
  try {
    const params = {
      page,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.category && { medicine_category_id: filters.value.category }),
    };
    const res = await axios.get(`${BASE_URL}/services`, { params });
    if (res.data.success) {
      const data = res.data.data;
      services.value = data.data;
      currentPage.value = data.current_page;
      totalPages.value = data.last_page;
    }
  } catch (error) {
    console.error(error);
    showToastMessage('Failed to fetch services.', 'bg-danger');
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = { search: '', category: '' };
  fetchServices(1);
}

function confirmDelete(service) {
  serviceToDelete.value = service;
  showDeleteModal.value = true;
}

async function deleteService() {
  if (!serviceToDelete.value) return;

  try {
    const res = await axios.delete(`${BASE_URL}/services/${serviceToDelete.value.id}`);
    if (res.data.success) {
      showToastMessage('Service deleted.', 'bg-success');
      fetchServices(currentPage.value);
    } else {
      showToastMessage('Failed to delete service.', 'bg-danger');
    }
  } catch (error) {
    console.error(error);
    showToastMessage('An error occurred.', 'bg-danger');
  } finally {
    showDeleteModal.value = false;
  }
}

function showToastMessage(message, type = 'bg-success') {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

onMounted(() => {
  fetchCategories();
  fetchServices();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Optional dark mode adjustments */
body.dark .bg-success {
  background-color: #28a745 !important;
}
body.dark .bg-danger {
  background-color: #dc3545 !important;
}
</style>
