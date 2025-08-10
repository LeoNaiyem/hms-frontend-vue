<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Manage Money Receipt</h4>
        <router-link to="/money-receipts/create" class="btn btn-success">
          Add New Invoice
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
          @input="fetchReceipts(1)"
        />
      </div>
      <div class="flex-grow-1">
        <input
          v-model="filters.date"
          type="date"
          class="form-control"
          @change="fetchReceipts(1)"
        />
      </div>
      <div class="flex-grow-1">
        <button class="btn btn-success w-100" @click="fetchReceipts(1)">
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

    <!-- Invoices Table -->
    <div class="card table-responsive">
      <table class="table table-striped align-middle">
        <thead class="table-primary">
          <tr>
            <th>#ID</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Total</th>
            <th>VAT</th>
            <th>Discount</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="r in receipts" :key="r.id">
            <td>{{ r.id }}</td>
            <td>
              {{ r.patient?.name || "N/A" }}<br />
              <small>{{ r.patient?.mobile || "" }}</small>
            </td>
            <td>{{ formatDateTime(r.created_at) }}</td>
            <td>{{ formatMoney(r.receipt_total) }}</td>
            <td>{{ formatMoney(r.vat) }}</td>
            <td>{{ formatMoney(r.discount) }}</td>
            <td class="text-end">
              <router-link
                :to="`/money-receipts/${r.id}`"
                class="btn btn-sm btn-outline-primary me-1"
              >
                View
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(r)"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="receipts.length === 0">
            <td colspan="7" class="text-center">No invoices found.</td>
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
            @click="fetchReceipts(currentPage - 1)"
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
          <button class="page-link" @click="fetchReceipts(page)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button
            class="page-link"
            @click="fetchReceipts(currentPage + 1)"
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
              Delete invoice
              <strong>#{{ receiptToDelete?.id }}</strong> for
              <strong>{{ receiptToDelete?.patient?.name || "this patient" }}</strong
              >?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button class="btn btn-secondary" @click="showDeleteModal = false">
                Cancel
              </button>
              <button class="btn btn-danger" @click="deleteReceipt">
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

// data
const receipts = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const filters = ref({ search: "", date: "" });
const loading = ref(false);

// delete modal state
const showDeleteModal = ref(false);
const receiptToDelete = ref(null);

// toast
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("bg-success");
const toastRef = ref(null);

function formatDateTime(dt) {
  return dt ? new Date(dt).toLocaleString() : "-";
}

function formatMoney(val) {
  if (val === null || val === undefined) return "-";
  // keep two decimal places and thousands separators
  return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function fetchReceipts(page = 1) {
  loading.value = true;
  try {
    const params = {
      page,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.date && { date: filters.value.date }),
    };
    const res = await axios.get(`${BASE_URL}/money-receipts`, { params });
    if (res.data.success) {
      const data = res.data.data;
      receipts.value = data.data;
      currentPage.value = data.current_page;
      totalPages.value = data.last_page;
    } else {
      showToastMessage("Failed to fetch invoices.", "bg-danger");
    }
  } catch (err) {
    console.error(err);
    showToastMessage("Failed to fetch invoices.", "bg-danger");
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  filters.value = { search: "", date: "" };
  fetchReceipts(1);
}

function confirmDelete(r) {
  receiptToDelete.value = r;
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

async function deleteReceipt() {
  const id = receiptToDelete.value?.id;
  if (!id) return;

  try {
    const res = await axios.delete(`${BASE_URL}/money-receipts/${id}`);
    if (res.data && (res.data.success === true || res.status === 200)) {
      showToastMessage("Invoice deleted.", "bg-success");
      // refetch current page
      fetchReceipts(currentPage.value);
    } else {
      showToastMessage("Failed to delete invoice.", "bg-danger");
    }
  } catch (err) {
    console.error(err);
    showToastMessage("An error occurred.", "bg-danger");
  } finally {
    showDeleteModal.value = false;
  }
}

onMounted(() => {
  fetchReceipts();
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
