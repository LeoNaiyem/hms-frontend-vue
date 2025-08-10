<template>
  <div class="container">
    <div style="max-width: 70vw" class="prescription-card my-5 position-relative card ps-wrapper">
      <!-- watermark -->
      <div class="ps-watermark">
        <img src="/assets/img/prescription/logo.png" alt="ps logo" />
      </div>

      <!-- top border -->
      <div class="ps-top">
        <img class="pe-none" src="/assets/img/prescription/border_top.png" alt="top graphics" />
      </div>

      <!-- body -->
      <div class="ps-body">
        <!-- head -->
        <div class="row ps-head">
          <div class="col-9 d-flex gap-4">
            <div style="min-width: 370px" class="doctor-section pe-5 border-end border-info-subtle">
              <p class="mb-1 fw-bold">Doctor:</p>
              <h4>{{ doctor.name }}</h4>
              <p class="text-danger fw-bold mb-1 text-uppercase">Health Psychologist</p>
              <p class="mb-1">MBBS, MD I Medicine, MCPS</p>
              <p class="mb-1">Specialist in Health Psychologist</p>
              <p class="text-uppercase text-info fw-bold">[Health care specialized hospital]</p>
            </div>
            <div class="patient-section">
              <div>
                <p class="mb-1 fw-bold">Patient:</p>
                <h4 class="mb-1">{{ patient.name }}</h4>
                <p class="text-danger fw-bold text-uppercase mb-1">
                  {{ patient.profession || "N/A" }}
                </p>
              </div>
              <div class="my-2 d-flex align-items-center gap-4">
                <p class="m-0">AGE:</p><strong>{{ age }} Years</strong>
              </div>
              <div class="mb-2 d-flex align-items-center gap-4">
                <p class="m-0">Sex:</p>
                <strong>{{ patient.gender === 0 ? "Male" : "Female" }}</strong>
              </div>
              <div class="mb-2 d-flex align-items-center gap-1">
                <p class="m-0">Mobile:</p>
                <strong>{{ patient.mobile }}</strong>
              </div>
            </div>
          </div>
          <div class="col-3 ps-logo d-flex justify-content-end">
            <img class="pe-none" src="/assets/img/prescription/logo.png" alt="logo" />
          </div>
        </div>

        <!-- main -->
        <div class="row ps-main my-5 px-5">
          <div class="col-8 border-end border-info-subtle pe-4">
            <div class="d-flex justify-content-between align-items-center">
              <img class="pe-none" src="/assets/img/prescription/rx_icon.png" alt="rx icon" height="40" />
              <p class="m-0">DATE: <strong>{{ today }}</strong></p>
            </div>

            <table class="table table-striped my-3">
              <thead class="table-info">
                <tr>
                  <th>Medicine</th>
                  <th>Dose</th>
                  <th>Course</th>
                  <th>Suggestion</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(med, idx) in medicines" :key="idx">
                  <td>{{ med.medicine_name }}</td>
                  <td>{{ med.dose }}</td>
                  <td>{{ med.days }} Days</td>
                  <td>{{ med.suggestion }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="col-4 ps-4">
            <p class="fw-bold mb-2">DIAGNOSIS:</p>
            <ol class="list-group list-group-numbered my-2">
              <li
                v-for="(item, index) in diagnosis"
                :key="index"
                class="list-group-item d-flex align-items-center p-2"
              >
                {{ item }}
              </li>
            </ol>

            <hr />
            <p style="letter-spacing: 2px" class="fw-bold text-info text-uppercase my-3">Clinical Notes</p>
            <div class="mb-3">
              <p class="mb-1 fw-semibold">Chief Complaint (CC):</p>
              <p class="m-0 fw-light">{{ prescription.cc }}</p>
            </div>
            <div class="mb-3">
              <p class="mb-1 fw-semibold">Relevant Findings (RF):</p>
              <p class="m-0 fw-light">{{ prescription.rf }}</p>
            </div>
            <div class="mb-3">
              <p class="mb-1 fw-semibold">Doctor's Advice:</p>
              <p class="m-0 fw-light">{{ prescription.advice }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- bottom -->
      <div class="ps-bottom position-relative">
        <div class="d-flex column-gap-5">
          <div class="ps-timestamp">
            <p>
              <i class="fa-solid fa-calendar-days"></i>&nbsp;
              <span class="fw-light"> Days</span>: Mon, Tue, Wed, Thu, Fri
            </p>
            <p>
              <i class="fa-solid fa-clock"></i>&nbsp;
              <span class="fw-light"> Timings</span>: 05:00 PM - 08:30 PM
            </p>
          </div>
          <div class="ps-address">
            <p>123-456-7890, 444-666-8899</p>
            <p>Street address here, City State, Zip Code</p>
          </div>
        </div>
        <button class="btn btn-print no-print btn-lg btn-info position-absolute top-25 start-50" @click="printPage">
          Print
        </button>
        <img class="pe-none" src="/assets/img/prescription/border_bottom.png" alt="bottom graphics" />
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const prescriptionId = route.params.id;

// reactive states
const doctor = ref({});
const patient = ref({});
const prescription = ref({});
const medicines = ref([]);
const diagnosis = ref([]);
const today = new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

// env + props
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const dob = ref('')

const age = computed(() => {
  if (!dob.value) return null
  const birthDate = new Date(dob.value)
  const today = new Date()
  let calculatedAge = today.getFullYear() - birthDate.getFullYear()
  const monthDiff = today.getMonth() - birthDate.getMonth()
  const dayDiff = today.getDate() - birthDate.getDate()
  
  // Adjust age if birth month/day not reached yet this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    calculatedAge--
  }
  return calculatedAge
})

// fetch data
const fetchPrescription = async () => {
  try {
    const { data } = await axios.get(`${BASE_URL}/prescriptions/${prescriptionId}`);
    const pres = data.prescription;
    prescription.value = pres[0] || {};
    doctor.value = data.doctor || {};
    patient.value = data.patient || {};
    dob.value=data.patient.dob||'';
    medicines.value = pres;
    diagnosis.value = pres[0]?.investigation?.split(",") || [];
  } catch (err) {
    console.error(err);
  }
};

const printPage = () => {
  window.print();
};

onMounted(fetchPrescription);
</script>
<style scoped>
@import "/assets/css/hms.css";
</style>