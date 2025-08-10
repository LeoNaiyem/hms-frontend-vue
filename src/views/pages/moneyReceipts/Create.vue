<template>
  <div class="page-inner fy-montserrat">
    <div class="mr-container rounded-2 shadow position-relative">
      <div class="p-5">
        <!-- Head -->
        <div class="mr-head d-flex justify-content-between align-items-end">
          <div class="head-left flex-fill">
            <h1 class="text-seagreen">
              <span>MONEY</span> <br />
              RECEIPT
            </h1>
            <p class="mt-2">{{ currentDate }}</p>
          </div>
          <div class="head-right flex-fill">
            <div class="d-flex justify-content-end">
              <img src="/assets/img/money_receipt/logo.png" height="110" alt="logo" />
            </div>
            <div class="mr-no d-flex align-items-center justify-content-end gap-2 mt-2">
              <p class="text-light py-2 pe-5 text-uppercase fw-bold">
                Money Receipt No: {{ newMrId }}
              </p>
            </div>
          </div>
        </div>

        <!-- Transaction Info -->
        <div class="row mt-5">
          <div class="col-7">
            <p class="fw-bold mb-1">PAYABLE TO:</p>
            <select v-model="patientId" class="form-select w-50 mb-1">
              <option value="">-----Select Patient-----</option>
              <option v-for="p in patients" :key="p.id" :value="p.id">
                {{ p.name }}
              </option>
            </select>
            <p style="line-height: 20px" class="text-capitalized">
              123 Anywhere St., Any City
            </p>
          </div>
          <div class="col-5">
            <p class="fw-bold mb-1">BANK DETAILS:</p>
            <p class="text-capitalized">Arowwai Industries</p>
            <p style="line-height: 20px" class="text-capitalized">+123-456-7890</p>
          </div>
        </div>

        <!-- Inputs -->
        <div class="d-flex justify-content-between align-items-center gap-2 mt-5">
          <div>
            <span>Service:</span>
            <select v-model="serviceId" style="min-width: 180px" class="form-select py-2">
              <option value="">Select Service</option>
              <option v-for="s in services" :key="s.id" :value="s.id">
                {{ s.name }}
              </option>
            </select>
          </div>
          <div>
            <label>Price:</label><br />
            <input v-model.number="price" type="number" class="form-control py-2" />
          </div>
          <div>
            <label>Quantity:</label><br />
            <input v-model.number="quantity" type="number" class="form-control py-2" />
          </div>
          <div>
            <label>Vat:</label><br />
            <input v-model.number="vat" type="number" class="form-control py-2" />
          </div>
          <div>
            <label>Discount:</label><br />
            <input v-model.number="discount" type="number" class="form-control py-2" />
          </div>
          <button @click="addItem" class="btn btn-info bg-seagreen mt-4 py-2">ADD</button>
        </div>

        <!-- Table -->
        <table class="table table-striped mt-4">
          <thead class="table-info">
            <tr>
              <th class="text-center">NO</th>
              <th>DESCRIPTION</th>
              <th class="text-center">QUANTITY</th>
              <th class="text-center">PRICE</th>
              <th class="text-center">VAT</th>
              <th class="text-center">DISCOUNT</th>
              <th class="text-center">
                <button @click="clearServices" class="btn-clear">CLR</button>
              </th>
              <th class="text-center">TOTAL</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, i) in items" :key="i">
              <th class="text-center">{{ i + 1 }}</th>
              <td>{{ item.service_name }}</td>
              <td class="text-center">{{ item.quantity }}</td>
              <td class="text-center">${{ item.price }}</td>
              <td class="text-center">${{ item.vat }}</td>
              <td class="text-center">${{ item.discount }}</td>
              <td class="text-center">
                <button @click="removeService(i)" class="btn-clear btn-remove">DEL</button>
              </td>
              <td class="text-center">${{ lineTotal(item).toFixed(2) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Calculations -->
        <div class="d-flex justify-content-end align-items-center pe-4 gap-5">
          <div class="d-flex flex-column">
            <p class="text-end fw-semibold">SUBTOTAL:</p>
            <p class="text-end fw-semibold">TAX:</p>
          </div>
          <div class="d-flex flex-column">
            <p>${{ subtotal.toFixed(2) }}</p>
            <p>5%</p>
          </div>
        </div>
        <div class="d-flex justify-content-between px-4 py-2 text-light mt-3 align-items-center bg-seagreen">
          <p class="fw-bold">GRAND TOTAL:</p>
          <p class="fw-bold">${{ total.toFixed(2) }}</p>
        </div>

        <!-- Notes & Signature -->
        <div class="row mt-5 px-4">
          <div class="col-6">
            <p class="fw-bold text-seagreen mb-1">ANY SPECIAL NOTES?</p>
            <textarea
              v-model="remark"
              class="form-control"
              cols="40"
              rows="2"
              placeholder="Special notes..."
            ></textarea>
          </div>
          <div class="col-6 d-flex flex-column align-items-end mt-1">
            <div class="d-flex align-items-center flex-column">
              <p class="fw-bold text-center">
                THANK YOU FOR YOUR <br />
                ATTENTION
              </p>
              <div class="signature-box d-flex justify-content-center align-items-center m-3">
                <button @click="createReceipt" class="btn btn-info my-4 bg-seagreen">Create</button>
              </div>
              <button class="btn btn-primary">OUR CONTACT INFORMATION</button>
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

      <!-- Footer Image -->
      <div class="position-absolute bottom-0 left-0 pe-none">
        <img height="250" src="/assets/img/money_receipt/footer-corner.png" alt="footer graphics" />
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

const currentDate = new Date().toLocaleDateString("en-US", {
  month: "long",
  day: "numeric",
  year: "numeric",
});
const newMrId = ref("00001"); // Replace with API fetched ID if needed

// form state
const patients = ref([]);
const services = ref([]);
const patientId = ref("");
const serviceId = ref("");
const price = ref(null);
const quantity = ref(null);
const vat = ref(null);
const discount = ref(null);
const remark = ref("");
const items = ref([]);

// computed
const subtotal = computed(() =>
  items.value.reduce((sum, item) => sum + lineTotal(item), 0)
);

const total = computed(() => subtotal.value + subtotal.value * 0.05);

// methods
function lineTotal(item) {
  return item.price * item.quantity + item.vat - item.discount;
}

function addItem() {
  if (!serviceId.value) return;
  const service = services.value.find((s) => s.id === serviceId.value);
  items.value.push({
    service_id: serviceId.value,
    service_name: service?.name || "",
    price: price.value || 0,
    quantity: quantity.value || 0,
    vat: vat.value || 0,
    discount: discount.value || 0,
  });
  clearInputs();
}

function clearInputs() {
  serviceId.value = "";
  price.value = null;
  quantity.value = null;
  vat.value = null;
  discount.value = null;
}

function clearServices() {
  items.value = [];
}

function removeService(index) {
  items.value.splice(index, 1);
}

async function createReceipt() {
  const payload = {
    patient_id: patientId.value,
    remark: remark.value,
    receipt_total: total.value.toFixed(2),
    vat: (subtotal.value * 0.05).toFixed(2),
    discount: 0,
    items: items.value,
  };

  try {
    const res = await axios.post(`${BASE_URL}/money-receipts`, payload);
    if (res.status === 200 || res.data.success) {
      alert("Successfully created!");
      router.push("/money-receipts");
    } else {
      alert("Error creating Money receipt!");
    }
  } catch (err) {
    console.error(err);
    alert("Error creating Money receipt!");
  }
}

// lifecycle
onMounted(async () => {
  try {
    const patientRes = await axios.get(`${BASE_URL}/patients`);
    patients.value = patientRes.data.data.data || patientRes.data;

    const serviceRes = await axios.get(`${BASE_URL}/services`);
    services.value = serviceRes.data.data.data || serviceRes.data;
  } catch (err) {
    console.error("Error loading initial data:", err);
  }
});
</script>



<style scoped>
@import "/assets/css/moneyreceipt.css";
label{
  margin: 0 !important;
}
</style>
