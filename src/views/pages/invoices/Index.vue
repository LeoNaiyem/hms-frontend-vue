<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Manage Invoices</h4>
        <router-link to="/invoices/create" class="btn btn-success">
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
          @input="fetchInvoices(1)"
        />
      </div>
      <div class="flex-grow-1">
        <input
          v-model="filters.date"
          type="date"
          class="form-control"
          @change="fetchInvoices(1)"
        />
      </div>
      <div class="flex-grow-1">
        <button class="btn btn-success w-100" @click="fetchInvoices(1)">
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
            <th>Paid</th>
            <th>VAT</th>
            <th>Discount</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td>{{ invoice.id }}</td>
            <td>
              {{ invoice.patient?.name || "N/A" }}<br />
              <small>{{ invoice.patient?.mobile || "" }}</small>
            </td>
            <td>{{ formatDateTime(invoice.created_at) }}</td>
            <td>{{ formatMoney(invoice.invoice_total) }}</td>
            <td>{{ formatMoney(invoice.paid_total) }}</td>
            <td>{{ formatMoney(invoice.vat) }}</td>
            <td>{{ formatMoney(invoice.discount) }}</td>
            <td class="text-end">
              <router-link
                :to="`/invoices/${invoice.id}`"
                class="btn btn-sm btn-outline-primary me-1"
              >
                View
              </router-link>
              <button
                class="btn btn-sm btn-outline-danger"
                @click="confirmDelete(invoice)"
              >
                Delete
              </button>
            </td>
          </tr>

          <tr v-if="invoices.length === 0">
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
            @click="fetchInvoices(currentPage - 1)"
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
          <button class="page-link" @click="fetchInvoices(page)">
            {{ page }}
          </button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button
            class="page-link"
            @click="fetchInvoices(currentPage + 1)"
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
              <strong>#{{ invoiceToDelete?.id }}</strong> for
              <strong>{{ invoiceToDelete?.patient?.name || "this patient" }}</strong
              >?
            </div>
            <div class="modal-footer d-flex justify-content-between mt-1">
              <button class="btn btn-secondary" @click="showDeleteModal = false">
                Cancel
              </button>
              <button class="btn btn-danger" @click="deleteInvoice">
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

const invoices = ref([]);
const currentPage = ref(1);
const totalPages = ref(1);
const filters = ref({ search: "", date: "" });
const loading = ref(false);

const showDeleteModal = ref(false);
const invoiceToDelete = ref(null);

const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("bg-success");

function formatDateTime(dt) {
  return dt ? new Date(dt).toLocaleString() : "-";
}

function formatMoney(val) {
  if (val === null || val === undefined) return "-";
  return Number(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

async function fetchInvoices(page = 1) {
  loading.value = true;
  try {
    const params = {
      page,
      ...(filters.value.search && { search: filters.value.search }),
      ...(filters.value.date && { date: filters.value.date }),
    };
    const res = await axios.get(`${BASE_URL}/invoices`, { params });
    if (res.data.success) {
      const data = res.data.data;
      invoices.value = data.data;
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
  fetchInvoices(1);
}

function confirmDelete(invoice) {
  invoiceToDelete.value = invoice;
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

async function deleteInvoice() {
  const id = invoiceToDelete.value?.id;
  if (!id) return;

  try {
    const res = await axios.delete(`${BASE_URL}/invoices/${id}`);
    if (res.data && (res.data.success === true || res.status === 200)) {
      showToastMessage("Invoice deleted.", "bg-success");
      fetchInvoices(currentPage.value);
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
  fetchInvoices();
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
