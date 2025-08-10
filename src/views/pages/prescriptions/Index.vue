<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Manage Prescriptions</h4>
        <router-link to="/prescriptions/create" class="btn btn-success">
          Add New Prescription
        </router-link>
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
          placeholder="Search by patient name..."
          @input="fetchPrescriptions(1)"
        />
      </div>
      <div class="flex-grow-1">
        <select
          v-model="filters.consultant_id"
          class="form-control"
          @change="fetchPrescriptions(1)"
        >
          <option value="">All Consultants</option>
          <option
            v-for="consultant in consultants"
            :key="consultant.id"
            :value="consultant.id"
          >
            {{ consultant.name }}
          </option>
        </select>
      </div>
      <div class="flex-grow-1">
        <button class="btn btn-success w-100" @click="fetchPrescriptions(1)">
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

    <!-- Prescriptions Table -->
    <div class="card table-responsive">
      <table class="table table-striped align-middle">
        <thead class="table-primary">
          <tr>
            <th>#ID</th>
            <th>Patient</th>
            <th>Consultant</th>
            <th>Notes</th>
            <th>CC</th>
            <th>Investigation</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pres in prescriptions" :key="pres.id">
            <td>{{ pres.id }}</td>
            <td>
              {{ pres.patient?.name || "N/A" }}<br />
              <small>{{ pres.patient?.mobile || "" }}</small>
            </td>
            <td>
              {{ pres.consultant?.name || "N/A" }}
            </td>
            <td>{{ pres.advice }}</td>
            <td>{{ pres.cc || "-" }}</td>
            <td>{{ pres.investigation || "N/A" }}</td>
            <td class="text-end">
              <router-link
                :to="`/prescriptions/${pres.id}`"
                class="btn btn-sm btn-outline-primary me-1"
                >View</router-link
              >
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(pres)"
              >
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="prescriptions.length === 0">
            <td colspan="6" class="text-center">No prescriptions found.</td>
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
            @click="fetchPrescriptions(currentPage - 1)"
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
          <button class="page-link" @click="fetchPrescriptions(page)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button
            class="page-link"
            @click="fetchPrescriptions(currentPage + 1)"
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
              <button
                class="btn-close"
                @click="showDeleteModal = false"
              ></button>
            </div>
            <div class="modal-body">
              Delete prescription
              <strong>#{{ prescriptionToDelete?.id }}</strong> for
              <strong>{{
                prescriptionToDelete?.patient?.name || "this patient"
              }}</strong
              >?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button
                class="btn btn-secondary"
                @click="showDeleteModal = false"
              >
                Cancel
              </button>
              <button class="btn btn-danger" @click="deletePrescription">
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
        role="alert"
        :class="['toast', toastType, { show: showToast }]"
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

const prescriptions = ref([]);
const consultants = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const filters = ref({ search: "", consultant_id: "" });
const loading = ref(false);

const showDeleteModal = ref(false);
const prescriptionToDelete = ref(null);

const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("bg-success");

function formatDate(dt) {
  return dt ? new Date(dt).toLocaleDateString() : "-";
}

async function fetchPrescriptions(page = 1) {
  loading.value = true;
  try {
    const params = {
      page,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.consultant_id && {
        consultant_id: filters.value.consultant_id,
      }),
    };
    const res = await axios.get(`${BASE_URL}/prescriptions`, { params });
    if (res.data.success) {
      console.log(res.data.data.data);
      prescriptions.value = res.data.data.data;
      currentPage.value = res.data.data.current_page;
      totalPages.value = res.data.data.last_page;
    }
  } catch (err) {
    console.error(err);
    showToastMessage("Failed to fetch prescriptions.", "bg-danger");
  } finally {
    loading.value = false;
  }
}

async function fetchConsultants() {
  try {
    const res = await axios.get(`${BASE_URL}/doctors`);
    if (res.data.success) {
      consultants.value = res.data.data.data;
    }
  } catch (err) {
    console.error(err);
  }
}

function resetFilters() {
  filters.value = { search: "", consultant_id: "" };
  fetchPrescriptions(1);
}

function confirmDelete(pres) {
  prescriptionToDelete.value = pres;
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

async function deletePrescription() {
  const id = prescriptionToDelete.value?.id;
  if (!id) return;
  try {
    const res = await axios.delete(`${BASE_URL}/prescriptions/${id}`);
    if (res.data.success) {
      showToastMessage("Prescription deleted.");
      fetchPrescriptions(currentPage.value);
    } else {
      showToastMessage("Failed to delete prescription.", "bg-danger");
    }
  } catch (err) {
    console.error(err);
    showToastMessage("An error occurred.", "bg-danger");
  } finally {
    showDeleteModal.value = false;
  }
}

onMounted(() => {
  fetchPrescriptions();
  fetchConsultants();
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
</style>
