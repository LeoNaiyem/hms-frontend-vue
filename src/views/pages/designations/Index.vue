<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Manage Designations</h4>
        <router-link to="/designations/create" class="btn btn-success">
          Add New Designation
        </router-link>
      </div>
    </div>

    <!-- Filter -->
    <div
      class="card p-3 my-3 d-flex align-items-center flex-row justify-content-between gap-3 flex-wrap">
      <div style="flex-grow: 2">
        <input
          v-model="filters.search"
          type="text"
          class="form-control"
          placeholder="Search by name..."
          @input="fetchDesignations(1)"
        />
      </div>
      <div class="flex-grow-1">
        <button class="btn btn-success w-100" @click="fetchDesignations(1)">
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
    <div v-if="loading" class="text-center my-3">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Table -->
    <div class="card table-responsive">
      <table class="table table-striped align-middle">
        <thead class="table-primary">
          <tr>
            <th>#ID</th>
            <th>Name</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in designations" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ item.name }}</td>
            <td class="text-end">
              <router-link
                :to="`/designations/${item.id}`"
                class="btn btn-sm btn-outline-primary me-1">
                View
              </router-link>
              <router-link
                :to="`/designations/${item.id}/edit`"
                class="btn btn-sm btn-outline-warning me-1">
                Edit
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(item)">
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="designations.length === 0 && !loading">
            <td colspan="3" class="text-center">No designations found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav v-if="totalPages > 1" class="mt-3">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button
            class="page-link"
            @click="fetchDesignations(currentPage - 1)"
            :disabled="currentPage === 1">
            Previous
          </button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }">
          <button class="page-link" @click="fetchDesignations(page)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button
            class="page-link"
            @click="fetchDesignations(currentPage + 1)"
            :disabled="currentPage === totalPages">
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
              Delete designation
              <strong>#{{ designationToDelete?.id }}</strong> –
              <strong>{{ designationToDelete?.name }}</strong>?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button class="btn btn-secondary" @click="showDeleteModal = false">
                Cancel
              </button>
              <button class="btn btn-danger" @click="deleteDesignation">
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

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
            @click="showToast = false">
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const designations = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const filters = ref({ search: '' });
const loading = ref(false);

const showDeleteModal = ref(false);
const designationToDelete = ref(null);

const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('bg-success');

function showToastMessage(message, type = 'bg-success') {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

async function fetchDesignations(page = 1) {
  loading.value = true;
  try {
    const params = {
      page,
      ...(filters.value.search && { search: filters.value.search }),
    };
    const res = await axios.get(`${BASE_URL}/designations`, { params });
    if (res.data.success) {
      const data = res.data.data;
      designations.value = data.data;
      currentPage.value = data.current_page;
      totalPages.value = data.last_page;
    }
  } catch (err) {
    console.error(err);
    showToastMessage('Failed to fetch designations.', 'bg-danger');
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = { search: '' };
  fetchDesignations(1);
}

function confirmDelete(item) {
  designationToDelete.value = item;
  showDeleteModal.value = true;
}

async function deleteDesignation() {
  const id = designationToDelete.value?.id;
  if (!id) return;
  try {
    const res = await axios.delete(`${BASE_URL}/designations/${id}`);
    if (res.data.success) {
      showToastMessage('Designation deleted.', 'bg-success');
      fetchDesignations(currentPage.value);
    } else {
      showToastMessage('Failed to delete designation.', 'bg-danger');
    }
  } catch (err) {
    console.error(err);
    showToastMessage('Error deleting designation.', 'bg-danger');
  } finally {
    showDeleteModal.value = false;
  }
}

onMounted(() => { fetchDesignations(); });
</script>

<style scoped>
.modal-backdrop {
  position: fixed; top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.4);
  display:flex; justify-content:center; align-items:center;
}
.fade-enter-active,
.fade-leave-active { transition: opacity .3s; }
.fade-enter-from,
.fade-leave-to { opacity: 0; }

body.dark .bg-success { background-color: #28a745 !important; }
body.dark .bg-danger { background-color: #dc3545 !important; }
</style>
