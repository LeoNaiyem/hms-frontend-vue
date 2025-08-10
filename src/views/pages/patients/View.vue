<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Patient Details</h4>
        <router-link to="/patients" class="btn btn-success">Back</router-link>
      </div>
    </div>

    <!-- Details Table -->
    <div class="card p-4 table-responsive">
      <table class="table table-bordered mb-0">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{{ patient.id }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{{ patient.name || '-' }}</td>
          </tr>
          <tr>
            <th>Mobile</th>
            <td>{{ patient.mobile || '-' }}</td>
          </tr>
          <tr>
            <th>Mobile Extension</th>
            <td>{{ patient.mob_ext || '-' }}</td>
          </tr>
          <tr>
            <th>Date of Birth</th>
            <td>{{ formatDate(patient.dob) }}</td>
          </tr>
          <tr>
            <th>Gender</th>
            <td>{{ genderText(patient.gender) }}</td>
          </tr>
          <tr>
            <th>Profession</th>
            <td>{{ patient.profession || '-' }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <router-link :to="`/patients/${patient.id}/edit`" class="btn btn-warning">
          Edit
        </router-link>
        <button class="btn btn-danger" @click="showDeleteModal = true">
          Delete
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <transition name="fade">
      <div class="modal-backdrop" v-if="showDeleteModal" @click.self="showDeleteModal = false">
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-content bg-light p-4 rounded gap-3 d-flex flex-column">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Deletion</h5>
              <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this patient?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
              <button class="btn btn-danger" @click="deletePatient">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast Notification -->
    <transition name="fade">
      <div v-if="showToast" class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1080">
        <div class="toast align-items-center text-white" :class="toastType" role="alert" aria-live="assertive" aria-atomic="true" style="display: flex">
          <div class="d-flex">
            <div class="toast-body">{{ toastMessage }}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" @click="showToast = false"></button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const router = useRouter();

const patient = ref({});
const showDeleteModal = ref(false);

// Toast
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("bg-success");

function showToastMessage(message, type = "bg-success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
}

const fetchPatient = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/patients/${route.params.id}`);
    if (res.data.success) {
      patient.value = res.data.data;
    } else {
      showToastMessage("Failed to load patient.", "bg-danger");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    showToastMessage("Could not load patient data.", "bg-danger");
  }
};

const formatDate = (date) => {
  return date ? new Date(date).toLocaleDateString() : "-";
};

const genderText = (gender) => {
  switch (gender) {
    case 0: return "Male";
    case 1: return "Female";
    case 2: return "Other";
    default: return "-";
  }
};

const deletePatient = async () => {
  try {
    const res = await axios.delete(`${BASE_URL}/patients/${patient.value.id}`);
    if (res.data.success) {
      showToastMessage("Patient deleted successfully!", "bg-success");
      showDeleteModal.value = false;
      setTimeout(() => {
        router.push("/patients");
      }, 1500);
    } else {
      showToastMessage("Failed to delete patient.", "bg-danger");
    }
  } catch (err) {
    console.error("Delete error:", err);
    showToastMessage("An error occurred. Check console.", "bg-danger");
  }
};

onMounted(fetchPatient);
</script>

<style scoped>
.dark-mode-support {
  background-color: transparent;
  color: #000;
}
body.dark .dark-mode-support {
  background-color: #121212;
  color: #f1f1f1;
}
body.dark .card,
body.dark .modal-content {
  background-color: #1e1e1e;
  color: #fff;
}
body.dark .table {
  color: #ddd;
}
</style>

<style>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}
</style>
