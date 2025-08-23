<template>
  <div class="container invoice-container">
    <div
      id="invoice-area"
      class="card shadow my-3 mx-auto"
      style="overflow: hidden; width: 100%; max-width: 950px"
    >
      <!-- Header -->
      <div class="invoice-header p-5 d-flex align-items-center">
        <img src="/assets/img/invoice/logo.png" alt="logo" />
        <div class="ms-2">
          <h2 class="mb-0 fw-bolder text-light">
            HEALTH <span class="text-info fw-lighter">CARE</span>
          </h2>
          <small class="slogan">SPECIALIZED HOSPITAL</small>
        </div>
        <div class="invoice-title ms-auto">
          <h1 class="mb-0 text-light">INVOICE</h1>
          <small class="fw-light">
            Invoice No : IV-00V3
            <strong>{{ newInvoiceNo }}</strong>
          </small>
        </div>
      </div>

      <!-- Info -->
      <div class="row py-4 px-5">
        <div class="col-6">
          <p class="mb-1 text-blue">Invoice To:</p>
          <select v-model="selectedPatientId" class="form-select mb-2">
            <option
              v-for="patient in patients"
              :key="patient.id"
              :value="patient.id"
            >
              {{ patient.name }}
            </option>
          </select>
          <div class="d-flex align-items-center gap-2">
            <div>
              <img src="/assets/img/invoice/icons.png" alt="icons" />
            </div>
            <div>
              <span>+880-1754896587<br /></span>
              <span>www.newpatient.com<br /></span>
              <span>123 Cantonment St, Dhaka City, ST 1206</span>
            </div>
          </div>
        </div>
        <div class="col-6 text-end">
          <p class="mb-1 text-blue">Total Due:</p>
          <h2 class="highlight">${{ total }}</h2>
          <div class="d-flex justify-content-end my-3">
            <div class="line-bar"></div>
          </div>
          <p class="text-blue mt-2">
            Invoice Date:
            <strong>{{ invoiceDate }}</strong>
          </p>
        </div>
      </div>

      <!-- Input -->
      <div class="row px-5 my-4 align-items-center">
        <div class="col-4">
          <label>Service</label>
          <select v-model="selectedServiceId" class="form-select">
            <option
              v-for="service in services"
              :key="service.id"
              :value="service.id"
            >
              {{ service.name }}
            </option>
          </select>
        </div>
        <div class="col-3">
          <label>Price</label>
          <input
            v-model.number="price"
            type="number"
            class="form-control"
            placeholder="Price"
          />
        </div>
        <div class="col-2">
          <label>Unit</label>
          <input
            v-model.number="unit"
            type="number"
            class="form-control"
            placeholder="Unit"
          />
        </div>
        <div class="col-2">
          <label>Discount</label>
          <input
            v-model.number="discount"
            type="number"
            class="form-control"
            placeholder="Discount"
          />
        </div>
        <div class="col-1 mt-4">
          <button @click="addService" class="btn btn-info">Add</button>
        </div>
      </div>

      <!-- Table -->
      <div class="table-responsive">
        <table class="table table-striped mb-0">
          <thead class="invoice-thead">
            <tr>
              <th class="text-left ps-5">Service Name</th>
              <th class="text-center">Price</th>
              <th class="text-center">Unit</th>
              <th class="text-center">Discount</th>
              <th class="text-center">Clear</th>
              <th class="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(srv, index) in selectedServices" :key="index">
              <td class="text-left ps-5 text-blue">{{ srv.name }}</td>
              <td class="text-center text-blue">${{ srv.price }}</td>
              <td class="text-center text-blue">{{ srv.unit }}</td>
              <td class="text-center text-blue">${{ srv.discount }}</td>
              <td class="text-center">
                <button
                  @click="removeService(index)"
                  class="btn btn-sm btn-danger"
                >
                  <i class="fa fa-trash"></i>
                </button>
              </td>
              <td class="text-center text-blue">${{ srv.lineTotal }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Total -->
      <div class="row p-4 align-items-center">
        <div class="col-6 ps-5">
          <p class="mb-1 text-blue">
            <strong>Payment Method: </strong><span></span>
          </p>
          <p>
            Bank Name: Francisco Andrade<br />
            Account Number: 0123 4567 8901
          </p>
        </div>
        <div class="col-6 text-end p-0">
          <div
            class="subtotal-box d-flex justify-content-end align-items-center"
          >
            <div>
              <p>Sub-total:</p>
              <p>Tax:</p>
            </div>
            <div>
              <p>${{ subtotal }}</p>
              <p>${{ tax }}</p>
            </div>
          </div>
          <div class="total-box">
            <h5 class="m-0 text-light">Total:</h5>
            <h5 class="m-0 text-light">${{ total }}</h5>
          </div>
        </div>
      </div>

      <!-- Signature & Terms -->
      <div class="row p-5 pt-0 align-items-center">
        <div class="col-6">
          <textarea
            v-model="remark"
            placeholder="Any special note..."
            rows="3"
            cols="50"
            class="py-2 px-3"
          ></textarea>
        </div>
        <div class="col-6 d-flex align-items-end text-blue flex-column">
          <button @click="createInvoice" class="btn btn-info">
            Create Invoice
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
const router = useRouter();

const patients = ref([]);
const services = ref([]);
const selectedPatientId = ref(null);
const selectedServiceId = ref(null);
const price = ref(0);
const unit = ref(1);
const discount = ref(0);
const remark = ref("");
const selectedServices = ref([]);
const newInvoiceNo = ref("");
const invoiceDate = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const tax = ref(10);

const subtotal = computed(() =>
  selectedServices.value.reduce((sum, s) => sum + s.lineTotal, 0)
);
const total = computed(() => subtotal.value + tax.value);

function addService() {
  if (!selectedServiceId.value) return;

  const srv = services.value.find((s) => s.id === selectedServiceId.value);
  selectedServices.value.push({
    id: srv.id,
    name: srv.name,
    price: price.value,
    unit: unit.value,
    discount: discount.value,
    vat: 0,
    lineTotal: price.value * unit.value - discount.value,
  });
}

function removeService(index) {
  selectedServices.value.splice(index, 1);
}

async function createInvoice() {
  const payload = {
    patient_id: selectedPatientId.value,
    invoice_total: total.value,
    paid_total: total.value,
    payment_term: "Cash",
    remark: remark.value,
    services: selectedServices.value,
  };

  try {
    await axios.post(`${BASE_URL}/invoices`, payload);
    alert("Invoice created successfully!");
    router.push("/invoices");
  } catch (err) {
    console.error(err);
    alert("Error creating invoice.");
  }
}

onMounted(async () => {
  try {
    const [patientsRes, servicesRes, invoiceNoRes] = await Promise.all([
      axios.get(`${BASE_URL}/patients`),
      axios.get(`${BASE_URL}/services`),
      // axios.get(`${BASE_URL}/invoices/new-number`),
    ]);

    patients.value = patientsRes.data.data.data;
    services.value = servicesRes.data.data.data;
    if (services.value.length) {
      selectedServiceId.value = services.value[0].id;
    }
    if (patients.value.length) {
      selectedPatientId.value = patients.value[0].id;
    }
    // newInvoiceNo.value = invoiceNoRes.data.invoice_no;
  } catch (err) {
    console.error(err);
  }
});
</script>

<style scoped>
@import "/assets/css/invoice.css";
</style>
