<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Manage Beds</h4>
        <router-link to="/beds/create" class="btn btn-success">Add New Bed</router-link>
      </div>
    </div>

    <!-- Filters -->
    <div
      class="card p-3 my-3 d-flex align-items-center flex-row justify-content-between gap-3 flex-wrap"
    >
      <div style="flex-grow: 2">
        <input
          v-model="filters.search"
          type="text"
          class="form-control"
          placeholder="Search by bed number or ward name..."
          @input="fetchBeds(1)"
        />
      </div>
      <div class="flex-grow-1">
        <select v-model="filters.status" class="form-select" @change="fetchBeds(1)">
          <option value="">All Statuses</option>
          <option>Occupied</option>
          <option>Reserved</option>
          <option>Maintenance</option>
          <option>Available</option>
        </select>
      </div>
      <div class="flex-grow-1">
        <button class="btn btn-success w-100" @click="fetchBeds(1)">Apply</button>
      </div>
      <div class="flex-grow-1">
        <button class="btn btn-outline-danger w-100" @click="resetFilters">Reset</button>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div class="text-center my-3" v-if="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Beds Table -->
    <div class="card table-responsive">
      <table class="table table-striped align-middle">
        <thead class="table-primary">
          <tr>
            <th>#ID</th>
            <th>Bed Number</th>
            <th>Ward</th>
            <th>Bed Type</th>
            <th>Status</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bed in beds" :key="bed.id">
            <td>{{ bed.id }}</td>
            <td>{{ bed.bed_number }}</td>
            <td>
              {{ bed.ward?.name || "N/A" }}<br />
              <small>Code: {{ bed.ward?.ward_code || "-" }}</small>
            </td>
            <td>{{ bed.bed_type }}</td>
            <td>
              <span
                :class="{
                  'badge bg-success': bed.status === 'Available',
                  'badge bg-warning': bed.status === 'Reserved',
                  'badge bg-danger': bed.status === 'Occupied',
                  'badge bg-secondary': bed.status === 'Maintenance',
                }"
              >
                {{ bed.status }}
              </span>
            </td>
            <td class="text-end">
              <router-link
                :to="`/beds/${bed.id}`"
                class="btn btn-sm btn-outline-primary me-1"
              >
                View
              </router-link>
              <router-link
                :to="`/beds/${bed.id}/edit`"
                class="btn btn-sm btn-outline-warning me-1"
              >
                Edit
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(bed)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="beds.length === 0">
            <td colspan="6" class="text-center">No beds found.</td>
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
            @click="fetchBeds(currentPage - 1)"
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
          <button class="page-link" @click="fetchBeds(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button
            class="page-link"
            @click="fetchBeds(currentPage + 1)"
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
              Delete bed <strong>#{{ bedToDelete?.id }}</strong> (
              <strong>{{ bedToDelete?.bed_number }}</strong>) in ward
              <strong>{{ bedToDelete?.ward?.name || "N/A" }}</strong>?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button class="btn btn-secondary" @click="showDeleteModal = false">
                Cancel
              </button>
              <button class="btn btn-danger" @click="deleteBed">Delete</button>
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

const beds = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const filters = ref({ search: "", status: "" });
const loading = ref(false);

const showDeleteModal = ref(false);
const bedToDelete = ref(null);

// Toast state
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("bg-success"); // or 'bg-danger'
const toastRef = ref(null);

async function fetchBeds(page = 1) {
  loading.value = true;
  try {
    const params = {
      page,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.status && { status: filters.value.status }),
    };
    const res = await axios.get(`${BASE_URL}/beds`, { params });
    if (res.data.success) {
      const data = res.data.data;
      beds.value = data.data;
      currentPage.value = data.current_page;
      totalPages.value = data.last_page;
    }
  } catch (err) {
    console.error(err);
    showToastMessage("Failed to fetch beds.", "bg-danger");
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = { search: "", status: "" };
  fetchBeds(1);
}

function confirmDelete(bed) {
  bedToDelete.value = bed;
  showDeleteModal.value = true;
}

function showToastMessage(message, type = "bg-success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

async function deleteBed() {
  const id = bedToDelete.value?.id;
  if (!id) return;

  try {
    const res = await axios.delete(`${BASE_URL}/beds/${id}`);
    if (res.data.success) {
      showToastMessage("Bed deleted.", "bg-success");
      fetchBeds(currentPage.value);
    } else {
      showToastMessage("Failed to delete bed.", "bg-danger");
    }
  } catch (err) {
    console.error(err);
    showToastMessage("An error occurred.", "bg-danger");
  } finally {
    showDeleteModal.value = false;
  }
}

onMounted(() => {
  fetchBeds();
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

/* Badges colors for statuses */
.badge.bg-success {
  background-color: #28a745;
}
.badge.bg-warning {
  background-color: #ffc107;
  color: #212529;
}
.badge.bg-danger {
  background-color: #dc3545;
}
.badge.bg-secondary {
  background-color: #6c757d;
}

/* Optional dark mode adjustments */
body.dark .bg-success {
  background-color: #28a745 !important;
}
body.dark .bg-danger {
  background-color: #dc3545 !important;
}
</style>
