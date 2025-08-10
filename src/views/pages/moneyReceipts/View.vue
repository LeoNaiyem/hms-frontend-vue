<template>
  <div class="page-inner fy-montserrat">
    <div class="mr-container rounded-2 shadow position-relative">
      <div class="p-5">
        <!-- head -->
        <div class="mr-head d-flex justify-content-between align-items-end">
          <div class="head-left flex-fill">
            <h1 class="text-seagreen">
              <span>MONEY</span> <br />
              RECEIPT
            </h1>
            <p class="mt-2">{{ moneyReceiptDate }}</p>
          </div>
          <div class="head-right flex-fill">
            <div class="d-flex justify-content-end">
              <img
                :src="`${assetBase}/assets/img/money_receipt/logo.png`"
                height="110"
                alt="logo"
              />
            </div>
            <div
              class="mr-no d-flex align-items-center justify-content-end gap-2 mt-2"
            >
              <p class="text-light py-2 pe-5 text-uppercase fw-bold">
                Money Receipt No: MR-00{{ moneyReceipt.id }}
              </p>
            </div>
          </div>
        </div>

        <!-- transaction info -->
        <div class="row mt-5">
          <div class="col-7">
            <p class="fw-bold mb-1">PAYABLE TO:</p>
            <p class="text-capitalized">{{ patient.name }}</p>
            <p style="line-height: 20px" class="text-capitalized">
              370/Cha, Saudi colony, Dhaka Cant.
            </p>
          </div>
          <div class="col-5">
            <p class="fw-bold mb-1">BANK DETAILS:</p>
            <p class="text-capitalized">Islami Bank Bangladesh Ltd.</p>
            <p style="line-height: 20px" class="text-capitalized">
              +880-1525-327890
            </p>
          </div>
        </div>

        <!-- table -->
        <table class="table table-striped mt-5">
          <thead class="table-info">
            <tr>
              <th class="text-center">NO</th>
              <th>DESCRIPTION</th>
              <th class="text-center">QUANTITY</th>
              <th class="text-center">PRICE</th>
              <th class="text-center">VAT</th>
              <th class="text-center">DISCOUNT</th>
              <th class="text-center">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(detail, index) in details" :key="index">
              <th class="text-center">{{ index + 1 }}</th>
              <td>{{ detail.serviceName }}</td>
              <td class="text-center">{{ detail.qty }}</td>
              <td class="text-center">${{ formatNumber(detail.price) }}</td>
              <td class="text-center">${{ formatNumber(detail.vat) }}</td>
              <td class="text-center">${{ formatNumber(detail.discount) }}</td>
              <td class="text-center">${{ formatNumber(detail.lineTotal) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- calculations -->
        <div class="d-flex justify-content-end align-items-center pe-5 gap-5">
          <div class="d-flex flex-column">
            <p class="text-end fw-semibold">SUBTOTAL:</p>
            <p class="text-end fw-semibold">TAX (5%):</p>
          </div>
          <div class="d-flex flex-column">
            <p>${{ formatNumber(subtotal) }}</p>
            <p>${{ formatNumber(tax) }}</p>
          </div>
        </div>
        <div
          class="d-flex justify-content-between px-5 py-2 text-light mt-3 align-items-center bg-seagreen"
        >
          <p class="fw-bold">GRAND TOTAL:</p>
          <p class="fw-bold">${{ formatNumber(moneyReceipt.receipt_total) }}</p>
        </div>

        <!-- terms and conditions -->
        <div class="row mt-5 px-4">
          <div class="col-6">
            <p class="fw-bold text-seagreen mb-1">TERMS & CONDITIONS</p>
            <p style="font-size: 12px">
              Refunds are available for services or products that do not meet
              the agreed upon specifications or were delivered in an
              unsatisfactory condition & refund requests must be made within 30
              days from the date of service/product delivery.
            </p>
          </div>

          <!-- signature -->
          <div class="col-6 d-flex flex-column align-items-end mt-1">
            <div class="d-flex align-items-center flex-column">
              <p class="fw-bold text-center">
                THANK YOU FOR YOUR <br />
                ATTENTION
              </p>
              <div class="signature-box mt-3">
                <img
                  :src="`${assetBase}/assets/img/money_receipt/signature.png`"
                  alt="signature"
                />
              </div>
              <p class="text-center fw-bold mt-1 mb-3">NAIYEM HOSSAIN</p>
              <button class="btn btn-info">OUR CONTACT INFORMATION</button>
              <p class="my-2 d-flex align-items-center">
                <small class="d-flex align-items-center">
                  naiyemhossain@gmail.com
                  <i class="fa fa-envelope px-3 text-seagreen w-100"></i>
                </small>
                <small class="d-flex align-items-center">
                  +8801478569853
                  <i class="fa fa-phone ps-3 text-seagreen w-100"></i>
                </small>
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- footer image -->
      <div class="position-absolute bottom-0 left-0 pe-none">
        <img
          height="250"
          :src="`${assetBase}/assets/img/money_receipt/footer-corner.png`"
          alt="footer graphics"
        />
      </div>
    </div>

    <!-- print button -->
    <div
      @click="printPage"
      class="d-flex justify-content-center mt-3 no-print"
    >
      <button class="btn btn-info">PRINT</button>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const assetBase = ""; // Set to your Laravel public path if needed
const moneyReceipt = ref({});
const details = ref([]);
const patient = ref({});
const customMrId = ref("");
const subtotal = ref(0);
const tax = ref(0);
const moneyReceiptDate = ref("");

function printPage(){
    window.print();
}

function formatNumber(num) {
  return Number(num).toFixed(2);
}

onMounted(async () => {
  const res = await axios.get(`${BASE_URL}/money-receipts/${route.params.id}`);
  moneyReceipt.value = res.data.data.moneyReceipt;
  details.value = res.data.data.details;
  patient.value = res.data.data.moneyReceipt.patient;
  customMrId.value = res.data.data.customMrId;
  subtotal.value = res.data.data.subtotal;
  tax.value = res.data.data.tax;
  moneyReceiptDate.value = new Date(
    moneyReceipt.value.created_at
  ).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
});
</script>

<style scoped>
@import "/assets/css/moneyreceipt.css";
</style>
