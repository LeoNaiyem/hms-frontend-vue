<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Manage Medicines</h4>
        <router-link to="/medicines/create" class="btn btn-success">
          Add New Medicine
        </router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-3 my-3 d-flex align-items-center flex-row justify-content-between gap-3 flex-wrap">
      <!-- Search -->
      <div style="flex-grow: 2">
        <input
          v-model="filters.search"
          type="text"
          class="form-control"
          placeholder="Search by medicine name..."
          @input="fetchMedicines(1)"
        />
      </div>

      <!-- Category -->
      <div class="flex-grow-1">
        <select
          v-model="filters.medicine_category_id"
          class="form-control"
          @change="fetchMedicines(1)"
        >
          <option value="">All Categories</option>
          <option
            v-for="cat in categories"
            :key="cat.id"
            :value="cat.id"
          >
            {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- Type -->
      <div class="flex-grow-1">
        <select
          v-model="filters.medicine_type_id"
          class="form-control"
          @change="fetchMedicines(1)"
        >
          <option value="">All Types</option>
          <option
            v-for="type in types"
            :key="type.id"
            :value="type.id"
          >
            {{ type.name }}
          </option>
        </select>
      </div>

      <!-- Apply / Reset -->
      <div class="flex-grow-1">
        <button class="btn btn-success w-100" @click="fetchMedicines(1)">
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

    <!-- Medicines Table -->
    <div class="card table-responsive">
      <table class="table table-striped align-middle">
        <thead class="table-primary">
          <tr>
            <th>#ID</th>
            <th>Name</th>
            <th>Generic Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Type</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="med in medicines" :key="med.id">
            <td>{{ med.id }}</td>
            <td>{{ med.name }}</td>
            <td>{{ med.generic_name }}</td>
            <td>{{ med.description || "-" }}</td>
            <td>{{ med?.medicine_category?.name || "-" }}</td>
            <td>{{ med?.medicine_type?.name || "-" }}</td>
            <td class="text-end">
              <router-link
                :to="`/medicines/${med.id}`"
                class="btn btn-sm btn-outline-primary me-1"
              >
                View
              </router-link>
              <router-link
                :to="`/medicines/${med.id}/edit`"
                class="btn btn-sm btn-outline-warning me-1"
              >
                Edit
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(med)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="medicines.length === 0">
            <td colspan="7" class="text-center">No medicines found.</td>
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
            @click="fetchMedicines(currentPage - 1)"
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
          <button class="page-link" @click="fetchMedicines(page)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button
            class="page-link"
            @click="fetchMedicines(currentPage + 1)"
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
              Delete medicine
              <strong>#{{ medicineToDelete?.id }}</strong> -
              <strong>{{ medicineToDelete?.name }}</strong>?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button class="btn btn-secondary" @click="showDeleteModal = false">
                Cancel
              </button>
              <button class="btn btn-danger" @click="deleteMedicine">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <div
      class="toast-container position-fixed bottom-0 end-0 p-3"
      style="z-index: 1055"
    >
      <div
        class="toast align-items-center text-white"
        :class="[toastType, { show: showToast }]"
        role="alert"
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

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Data
const medicines = ref([]);
const categories = ref([]);
const types = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);

const filters = ref({
  search: "",
  medicine_category_id: "",
  medicine_type_id: ""
});

// Modal state
const showDeleteModal = ref(false);
const medicineToDelete = ref(null);

// Toast state
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("bg-success");

// Toast helper
function showToastMessage(message, type = "bg-success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

// Fetch Medicines
async function fetchMedicines(page = 1) {
  loading.value = true;
  try {
    const params = { page, ...filters.value };
    const res = await axios.get(`${BASE_URL}/medicines`, { params });
    if (res.data.success) {
      medicines.value = res.data.data.data;
      currentPage.value = res.data.data.current_page;
      totalPages.value = res.data.data.last_page;
    }
  } catch (err) {
    console.error(err);
    showToastMessage("Failed to fetch medicines.", "bg-danger");
  } finally {
    loading.value = false;
  }
}

// Fetch Categories
async function fetchCategories() {
  try {
    const res = await axios.get(`${BASE_URL}/medicine-categories`);
    categories.value = res.data.data.data || [];
  } catch (err) {
    console.error(err);
  }
}

// Fetch Types
async function fetchTypes() {
  try {
    const res = await axios.get(`${BASE_URL}/medicine-types`);
    types.value = res.data.data.data || [];
  } catch (err) {
    console.error(err);
  }
}

// Reset filters
function resetFilters() {
  filters.value = {
    search: "",
    medicine_category_id: "",
    medicine_type_id: ""
  };
  fetchMedicines(1);
}

// Delete actions
function confirmDelete(medicine) {
  medicineToDelete.value = medicine;
  showDeleteModal.value = true;
}

async function deleteMedicine() {
  if (!medicineToDelete.value) return;
  try {
    await axios.delete(`${BASE_URL}/medicines/${medicineToDelete.value.id}`);
    showToastMessage("Medicine deleted successfully");
    fetchMedicines(currentPage.value);
  } catch (err) {
    console.error(err);
    showToastMessage("Failed to delete medicine", "bg-danger");
  } finally {
    showDeleteModal.value = false;
  }
}

// Init
onMounted(() => {
  fetchCategories();
  fetchTypes();
  fetchMedicines();
});
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}
.toast {
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
}
.toast.show {
  opacity: 1;
}
</style>
