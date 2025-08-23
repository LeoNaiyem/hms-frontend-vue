<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Admission Details</h4>
        <router-link to="/admissions" class="btn btn-success">Back</router-link>
      </div>
    </div>

    <!-- Details Table -->
    <div class="card p-4 table-responsive">
      <table class="table table-bordered mb-0">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{{ admission.id }}</td>
          </tr>
          <tr>
            <th>Patient</th>
            <td>
              <div>{{ admission.patient?.name || "N/A" }}</div>
              <small>{{ admission.patient?.mobile || "-" }}</small>
            </td>
          </tr>
          <tr>
            <th>Department</th>
            <td>{{ admission.department?.name || "N/A" }}</td>
          </tr>
          <tr>
            <th>Under Doctor</th>
            <td>
              <div>{{ admission.under_doctor?.name || "N/A" }}</div>
              <small>{{ admission.under_doctor?.phone || "-" }}</small>
            </td>
          </tr>
          <tr>
            <th>Bed</th>
            <td>
              {{ admission.bed?.bed_number || "-" }}
              <small>({{ admission.bed?.bed_type || "" }})</small>
            </td>
          </tr>
          <tr>
            <th>Admission Date</th>
            <td>{{ formatDateTime(admission.admission_date) }}</td>
          </tr>
          <tr>
            <th>Advance</th>
            <td>{{ admission.advance || 0 }}</td>
          </tr>
          <tr>
            <th>Problem</th>
            <td>{{ admission.problem || "-" }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <router-link :to="`/admissions/${admission.id}/edit`" class="btn btn-warning">
          Edit
        </router-link>
        <button class="btn btn-danger" @click="showDeleteModal = true">Delete</button>
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
              Are you sure you want to delete this admission?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
              <button class="btn btn-danger" @click="deleteAdmission">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast -->
    <transition name="fade">
      <div
        v-if="showToast"
        class="toast-container position-fixed bottom-0 end-0 p-3"
        style="z-index: 1080"
      >
        <div
          class="toast align-items-center text-white"
          :class="toastType"
          role="alert"
          aria-live="assertive"
          aria-atomic="true"
          style="display: flex"
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

const admission = ref({});
const showDeleteModal = ref(false);

// Toast
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("bg-success");

function showToastMessage(message, type = "bg-success") {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
}

function formatDateTime(dt) {
  return dt ? new Date(dt).toLocaleString() : "-";
}

const fetchAdmission = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/admissions/${route.params.id}`);
    if (res.data.success) {
      admission.value = res.data.data;
    } else {
      showToastMessage("Failed to load admission.", "bg-danger");
    }
  } catch (err) {
    console.error("Fetch error:", err);
    showToastMessage("Could not load admission data.", "bg-danger");
  }
};

const deleteAdmission = async () => {
  try {
    const res = await axios.delete(`${BASE_URL}/admissions/${admission.value.id}`);
    if (res.data.success) {
      showToastMessage("Admission deleted successfully!");
      showDeleteModal.value = false;
      setTimeout(() => router.push("/admissions"), 1500);
    } else {
      showToastMessage("Failed to delete admission.", "bg-danger");
    }
  } catch (err) {
    console.error("Delete error:", err);
    showToastMessage("Error occurred while deleting.", "bg-danger");
  }
};

onMounted(fetchAdmission);
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
