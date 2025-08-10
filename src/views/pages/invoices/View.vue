<template>
  <div class="container invoice-container">
    <div
      id="invoice-area"
      class="card shadow my-3 mx-auto"
      style="overflow: hidden; width: 100%; max-width: 950px;"
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
            Invoice No :
            <strong>IV-00{{ invoiceId }}</strong>
          </small>
        </div>
      </div>

      <!-- Info -->
      <div class="row py-4 px-5">
        <div class="col-6">
          <p class="mb-1 text-blue">Invoice To:</p>
          <h2 class="highlight">{{ patient?.name }}</h2>
          <div class="d-flex align-items-center gap-2">
            <div>
              <img src="/assets/img/invoice/icons.png" alt="icons" />
            </div>
            <div>
              <span>{{ patient?.mobile }}<br /></span>
              <span>www.reallygreatsite.com<br /></span>
              <span>123 Anywhere St, Any City, ST 12345</span>
            </div>
          </div>
        </div>
        <div class="col-6 text-end">
          <p class="mb-1 text-blue">Previous Due:</p>
          <h2 class="highlight">$1,580</h2>
          <div class="d-flex justify-content-end my-3">
            <div class="line-bar"></div>
          </div>
          <p class="text-blue mt-2">
            Invoice Date: <strong>{{ formattedDate }}</strong>
          </p>
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
              <th class="text-center">Total</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(service, index) in services" :key="index">
              <td class="text-left ps-5 text-blue">{{ service.name }}</td>
              <td class="text-center text-blue">
                ${{ service.price.toFixed(2) }}
              </td>
              <td class="text-center text-blue">{{ service.unit }}</td>
              <td class="text-center text-blue">
                ${{ service.discount.toFixed(2) }}
              </td>
              <td class="text-center text-blue">
                ${{ lineTotal(service).toFixed(2) }}
              </td>
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
            Bank Name: Islami Bank PLC.<br />
            Account Number: 0123 4567 8901
          </p>
        </div>
        <div class="col-6 text-end p-0">
          <div class="subtotal-box d-flex justify-content-end align-items-center">
            <div>
              <p>Sub-total: </p>
              <p>Tax: </p>
            </div>
            <div>
              <p>$<span>{{ subtotal.toFixed(2) }}</span></p>
              <p>$<span>{{ tax.toFixed(2) }}</span></p>
            </div>
          </div>
          <div class="total-box">
            <h5 class="m-0 text-light">Total: </h5>
            <h5 class="m-0 text-light">
              $<span>{{ total.toFixed(1) }}</span>
            </h5>
          </div>
        </div>
      </div>

      <!-- Signature & Terms -->
      <div class="row p-5 pt-0">
        <div class="col-6">
          <p class="footer-note text-blue">
            <strong class="fw-bold fs-5">Term and Conditions</strong><br />
            Please send payment within 30 days of receiving this invoice. There
            will be 10% interest charge per month on late invoice.
          </p>
        </div>
        <div class="col-6 d-flex align-items-end text-blue flex-column">
          <div class="text-center">
            <div class="signature mb-2"></div>
            <h5 class="text-center fw-bolder m-0 text-blue">NAIYEM HOSSAIN</h5>
            <small class="text-center">Administrator</small>
          </div>
        </div>
      </div>
    </div>

    <div class="text-center my-4 no-print">
      <button class="btn btn-primary" @click="printPage">
        Print Invoice
      </button>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const invoiceId = route.params.id;

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const invoiceNumber = ref("");
const formattedDate = ref("");
const patient = ref(null);
const services = ref([]);
const subtotal = ref(0);
const tax = ref(10);
const total = computed(() => subtotal.value + tax.value);

const lineTotal = (service) => {
  return service.price * service.unit - service.discount;
};

const fetchData = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/invoices/${invoiceId}`, {
      headers: { Accept: "application/json" },
    });

    // Adjust structure based on actual API
    const data = res.data;
    services.value = data.invoice;
    patient.value = data.patient;
    invoiceNumber.value = `INV-${String(data.id).padStart(5, "0")}`;
    formattedDate.value = new Date(data.created_at).toLocaleDateString(
      "en-US",
      { year: "numeric", month: "long", day: "numeric" }
    );

    // calculate subtotal
    subtotal.value = services.value.reduce(
      (sum, s) => sum + lineTotal(s),
      0
    );
  } catch (err) {
    console.error("Error fetching invoice:", err);
  }
};

function printPage(){
    window.print();
}
onMounted(fetchData);
</script>

<style scoped>
@import "/assets/css/invoice.css";
</style>
