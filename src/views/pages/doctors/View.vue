<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Doctor Details</h4>
        <router-link to="/doctors" class="btn btn-success">Back</router-link>
      </div>
    </div>

    <!-- Details Table -->
    <div class="card p-4 table-responsive">
      <table class="table table-bordered mb-0">
        <tbody>
          <tr>
            <th>ID</th>
            <td>{{ doctor.id }}</td>
          </tr>
          <tr>
            <th>Name</th>
            <td>{{ doctor.name || "N/A" }}</td>
          </tr>
          <tr>
            <th>Phone</th>
            <td>{{ doctor.phone || "N/A" }}</td>
          </tr>
          <tr>
            <th>Designation</th>
            <td>{{ doctor.designation?.name || "-" }}</td>
          </tr>
          <tr>
            <th>Department</th>
            <td>{{ doctor.department?.name || "-" }}</td>
          </tr>
          <tr v-if="doctor.photo_url">
            <th>Photo</th>
            <td>
              <img :src="doctor.photo_url" alt="Doctor Photo" style="max-height: 120px;" />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Action Buttons -->
      <div class="d-flex justify-content-end gap-2 mt-4">
        <router-link :to="`/doctors/${doctor.id}/edit`" class="btn btn-warning">
          Edit
        </router-link>
        <button class="btn btn-danger" @click="showDeleteModal = true">
          Delete
        </button>
      </div>
    </div>

    <!-- Delete Confirmation Modal with transition -->
    <transition name="fade">
      <div class="modal-backdrop" v-if="showDeleteModal" @click.self="showDeleteModal = false">
        <div class="modal-dialog" role="dialog" aria-modal="true">
          <div class="modal-content bg-light p-4 rounded gap-3 d-flex flex-column">
            <div class="modal-header">
              <h5 class="modal-title">Confirm Deletion</h5>
              <button type="button" class="btn-close" @click="showDeleteModal = false"></button>
            </div>
            <div class="modal-body">
              Are you sure you want to delete this doctor?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button class="btn btn-secondary" @click="showDeleteModal = false">Cancel</button>
              <button class="btn btn-danger" @click="deleteDoctor">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Toast Notification with transition -->
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

const doctor = ref({});
const showDeleteModal = ref(false);

// Toast states
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

const fetchDoctor = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/doctors/${route.params.id}`);
    if (res.data.success) {
      doctor.value = res.data.data;
    } else {
      showToastMessage("Failed to load doctor.", "bg-danger");
    }
  } catch (err) {
    console.error("Failed to fetch doctor:", err);
    showToastMessage("Could not load doctor data.", "bg-danger");
  }
};

const deleteDoctor = async () => {
  try {
    const res = await axios.delete(`${BASE_URL}/doctors/${doctor.value.id}`);
    if (res.data.success) {
      showToastMessage("Doctor deleted successfully!", "bg-success");
      showDeleteModal.value = false;
      setTimeout(() => {
        router.push("/doctors");
      }, 1500); // wait for toast to finish
    } else {
      showToastMessage("Failed to delete doctor.", "bg-danger");
    }
  } catch (err) {
    console.error("Delete error:", err);
    showToastMessage("An error occurred. Check console for details.", "bg-danger");
  }
};

onMounted(fetchDoctor);
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

<!-- Put transition and modal backdrop styles *outside* scoped so they work -->
<style>
/* Modal backdrop */
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

/* Fade transition */
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
