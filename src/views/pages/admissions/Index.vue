<template>
  <div class="container mt-4">
    <div class="card">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4>Manage Admissions</h4>
        <router-link to="/admissions/create" class="btn btn-success">Add New Admission</router-link>
      </div>
    </div>

    <!-- Filters -->
    <div class="card p-3 my-3 d-flex align-items-center flex-row justify-content-between gap-3">
      <div style="flex-grow: 2;">
        <input
          v-model="filters.search"
          type="text"
          class="form-control"
          placeholder="Search by patient name..."
          @input="fetchAdmissions(1)"
        />
      </div>
      <div class="flex-grow-1">
        <input
          v-model="filters.date"
          type="date"
          class="form-control"
          @change="fetchAdmissions(1)"
        />
      </div>
      <div class="flex-grow-1">
        <button class="btn btn-success w-100" @click="fetchAdmissions(1)">Apply</button>
      </div>
      <div class="flex-grow-1">
        <button class="btn btn-outline-danger w-100" @click="resetFilters">Reset</button>
      </div>
    </div>

    <!-- Table -->
    <div class="card table-responsive">
      <table class="table table-striped align-middle">
        <thead class="table-primary">
          <tr>
            <th>#ID</th>
            <th>Patient</th>
            <th>Department</th>
            <th>Under Doctor</th>
            <th>Bed</th>
            <th>Admission Date</th>
            <th>Advance</th>
            <th>Problem</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="adm in admissions" :key="adm.id">
            <td>{{ adm.id }}</td>
            <td>
              {{ adm.patient?.name || 'N/A' }}<br />
              <small>{{ adm.patient?.mobile || '' }}</small>
            </td>
            <td>{{ adm.department?.name || '-' }}</td>
            <td>
              <div v-if="adm.under_doctor">
                {{ adm.under_doctor.name }}<br />
                <small>{{ adm.under_doctor.phone }}</small>
              </div>
              <div v-else>N/A</div>
            </td>
            <td>
              {{ adm.bed?.bed_number || '-' }}<br />
              <small>{{ adm.bed?.bed_type || '' }}</small>
            </td>
            <td>{{ formatDate(adm.admission_date) }}</td>
            <td>{{ adm.advance || 0 }}</td>
            <td>{{ adm.problem || '-' }}</td>
            <td class="text-end">
              <router-link
                :to="`/admissions/${adm.id}`"
                class="btn btn-sm btn-outline-primary me-1"
              >
                View
              </router-link>
              <router-link
                :to="`/admissions/${adm.id}/edit`"
                class="btn btn-sm btn-outline-warning me-1"
              >
                Edit
              </router-link>
              <button class="btn btn-sm btn-outline-danger" @click="confirmDelete(adm)">Delete</button>
            </td>
          </tr>
          <tr v-if="admissions.length === 0">
            <td colspan="9" class="text-center">No admissions found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav class="mt-3" v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="fetchAdmissions(currentPage - 1)">Previous</button>
        </li>
        <li v-for="page in totalPages" :key="page" class="page-item" :class="{ active: currentPage === page }">
          <button class="page-link" @click="fetchAdmissions(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="fetchAdmissions(currentPage + 1)">Next</button>
        </li>
      </ul>
    </nav>

    <!-- Delete Modal -->
    <div class="modal fade" ref="deleteModal" tabindex="-1">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Confirm Deletion</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body">
            Are you sure you want to delete admission <strong>#{{ admissionToDelete?.id }}</strong>?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="button" class="btn btn-danger" @click="deleteAdmission">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div
        class="toast align-items-center text-white"
        role="alert"
        ref="toastRef"
        :class="['bg-success', { show: showToast }]"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toastMessage }}</div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="showToast = false"></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

const admissions = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const filters = ref({ search: '', date: '' });
const admissionToDelete = ref(null);
const deleteModal = ref(null);
const toastRef = ref(null);
const toastMessage = ref('');
const showToast = ref(false);

function formatDate(dateStr) {
  return dateStr ? new Date(dateStr).toLocaleString() : '-';
}

async function fetchAdmissions(page = 1) {
  try {
    const params = {
      page,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.date && { date: filters.value.date }),
    };
    const res = await axios.get(`${BASE_URL}/admissions`, { params });
    if (res.data.success) {
      const data = res.data.data;
      admissions.value = data.data;
      currentPage.value = data.current_page;
      totalPages.value = data.last_page;
    }
  } catch (err) {
    console.error('Failed to fetch admissions:', err);
    showToastMessage('Error fetching admissions', 'bg-danger');
  }
}

function resetFilters() {
  filters.value = { search: '', date: '' };
  fetchAdmissions(1);
}

function confirmDelete(adm) {
  admissionToDelete.value = adm;
  const modal = new bootstrap.Modal(deleteModal.value);
  modal.show();
}

async function deleteAdmission() {
  try {
    const id = admissionToDelete.value?.id;
    const res = await axios.delete(`${BASE_URL}/admissions/${id}`);
    if (res.data.success) {
      showToastMessage('Admission deleted');
      fetchAdmissions(currentPage.value);
    } else {
      showToastMessage('Deletion failed', 'bg-danger');
    }
  } catch (err) {
    console.error(err);
    showToastMessage('Error deleting admission', 'bg-danger');
  }

  const modal = bootstrap.Modal.getInstance(deleteModal.value);
  modal.hide();
}

function showToastMessage(message, type = 'bg-success') {
  toastMessage.value = message;
  showToast.value = true;
  toastRef.value.classList.remove('bg-success', 'bg-danger');
  toastRef.value.classList.add(type);

  nextTick(() => {
    const toast = new bootstrap.Toast(toastRef.value);
    toast.show();
  });
}

onMounted(() => {
  fetchAdmissions();
});
</script>
