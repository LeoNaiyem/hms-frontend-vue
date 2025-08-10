<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Doctors</h4>
        <router-link to="/doctors/create" class="btn btn-primary">Add Doctor</router-link>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div class="text-center my-3" v-if="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Table -->
    <div class="card p-3 table-responsive">
      <table class="table table-hover table-bordered align-middle">
        <thead class="table-light">
          <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Designation</th>
            <th>Department</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="doctor in doctors" :key="doctor.id">
            <td>{{ doctor.id }}</td>
            <td>
              <img
                v-if="doctor.photo"
                :src="`${BASE_URL}/storage/${doctor.photo}`"
                alt="Photo"
                class="img-thumbnail"
                style="width: 50px; height: 50px; object-fit: cover"
              />
              <span v-else class="text-muted">N/A</span>
            </td>
            <td>{{ doctor.name }}</td>
            <td>{{ doctor.phone }}</td>
            <td>{{ doctor.designation?.name || '-' }}</td>
            <td>{{ doctor.department?.name || '-' }}</td>
            <td class="text-end">
              <router-link
                :to="`/doctors/${doctor.id}`"
                class="btn btn-sm btn-outline-primary me-1"
              >
                View
              </router-link>
              <router-link
                :to="`/doctors/${doctor.id}/edit`"
                class="btn btn-sm btn-outline-warning me-1"
              >
                Edit
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(doctor)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="doctors.length === 0 && !loading">
            <td colspan="7" class="text-center">No doctors found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav v-if="pagination.total > pagination.per_page">
      <ul class="pagination justify-content-center mt-3">
        <li class="page-item" :class="{ disabled: !pagination.prev_page_url }">
          <button class="page-link" @click="fetchDoctors(pagination.current_page - 1)">«</button>
        </li>
        <li
          v-for="link in paginationLinks"
          :key="link.label"
          class="page-item"
          :class="{ active: link.active, disabled: !link.url }"
        >
          <button
            class="page-link"
            v-html="link.label"
            @click="link.url && fetchDoctors(getPageNumber(link.url))"
          ></button>
        </li>
        <li class="page-item" :class="{ disabled: !pagination.next_page_url }">
          <button class="page-link" @click="fetchDoctors(pagination.current_page + 1)">»</button>
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
              Delete doctor
              <strong>#{{ doctorToDelete?.id }}</strong> —
              <strong>{{ doctorToDelete?.name }}</strong>?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button class="btn btn-secondary" @click="showDeleteModal = false">
                Cancel
              </button>
              <button class="btn btn-danger" @click="deleteDoctor">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1055">
      <div
        class="toast align-items-center text-white"
        role="alert"
        :class="[toastType, { show: showToast }]"
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
import axios from 'axios';
import { onMounted, ref } from 'vue';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const doctors = ref([]);
const pagination = ref({});
const paginationLinks = ref([]);
const loading = ref(false);

// Modal state
const showDeleteModal = ref(false);
const doctorToDelete = ref(null);

// Toast state
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('bg-success');
const toastRef = ref(null);

const fetchDoctors = async (page = 1) => {
  loading.value = true;
  try {
    const res = await axios.get(`${BASE_URL}/doctors?page=${page}`);
    if (res.data.success) {
      doctors.value = res.data.data.data;
      pagination.value = res.data.data;
      paginationLinks.value = res.data.data.links;
    }
  } catch (err) {
    console.error('Failed to fetch doctors:', err);
    showToastMessage('Failed to fetch doctors.', 'bg-danger');
  } finally {
    loading.value = false;
  }
};

const getPageNumber = (url) => {
  const params = new URL(url).searchParams;
  return params.get('page');
};

const confirmDelete = (doctor) => {
  doctorToDelete.value = doctor;
  showDeleteModal.value = true;
};

const deleteDoctor = async () => {
  const id = doctorToDelete.value?.id;
  if (!id) return;

  try {
    const res = await axios.delete(`${BASE_URL}/doctors/${id}`);
    if (res.data.success) {
      showToastMessage('Doctor deleted successfully.');
      fetchDoctors(pagination.value.current_page);
    } else {
      showToastMessage('Failed to delete doctor.', 'bg-danger');
    }
  } catch (err) {
    console.error(err);
    showToastMessage('Error deleting doctor.', 'bg-danger');
  } finally {
    showDeleteModal.value = false;
  }
};

const showToastMessage = (message, type = 'bg-success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

onMounted(() => {
  fetchDoctors();
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

body.dark .bg-success {
  background-color: #28a745 !important;
}
body.dark .bg-danger {
  background-color: #dc3545 !important;
}
</style>
