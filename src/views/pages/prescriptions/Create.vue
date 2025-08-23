<template>
  <div class="container">
    <div class="prescription-card my-5 position-relative card ps-wrapper">
      <!-- watermark -->
      <div class="ps-watermark">
        <img src="/assets/img/prescription/logo.png" alt="ps logo" />
      </div>

      <!-- top border -->
      <div class="ps-top">
        <img
          class="pe-none"
          src="/assets/img/prescription/border_top.png"
          alt="top graphics"
        />
      </div>

      <!-- body -->
      <div class="ps-body">
        <!-- head -->
        <div class="row ps-head">
          <div class="col-9 d-flex gap-4">
            <!-- Doctor -->
            <div
              style="min-width: 345px"
              class="doctor-section pe-5 border-end border-info-subtle"
            >
              <p class="m-0 fw-bold">Doctor:</p>
              <select v-model="form.consultant_id" class="my-1 form-select p-2">
                <option value="">---- Select Doctor ---</option>
                <option
                  v-for="doctor in doctors"
                  :key="doctor.id"
                  :value="doctor.id"
                >
                  {{ doctor.name }}
                </option>
              </select>
              <p class="text-danger fw-bold">Health Psychologist</p>
              <p>MBBS, MD I Medicine, MCPS</p>
              <p>Specialist in Health Psychologist</p>
              <p class="text-uppercase fw-bold">
                [Health care specialized hospital]
              </p>
            </div>

            <!-- Patient -->
            <div class="patient-section">
              <p class="m-0 fw-bold">Patient:</p>
              <select v-model="form.patient_id" class="form-select p-2 mt-1">
                <option value="">---- Select Patient ----</option>
                <option
                  v-for="patient in patients"
                  :key="patient.id"
                  :value="patient.id"
                >
                  {{ patient.name }}
                </option>
              </select>

              <div class="my-3 d-flex align-items-center gap-4">
                <label for="age">AGE:</label>
                <input
                  v-model="form.age"
                  class="form-control p-1"
                  type="number"
                  placeholder="Age"
                />
              </div>

              <div class="mb-3 d-flex align-items-center gap-4">
                <p class="m-0">Sex:</p>
                <div class="d-flex">
                  <label class="form-check d-flex align-items-center gap-1">
                    <input
                      v-model="form.sex"
                      class="form-check-input"
                      type="radio"
                      value="0"
                    />
                    Male
                  </label>
                  <label
                    class="form-check d-flex align-items-center gap-1 ms-1"
                  >
                    <input
                      v-model="form.sex"
                      class="form-check-input"
                      type="radio"
                      value="1"
                    />
                    Female
                  </label>
                  <label
                    class="form-check d-flex align-items-center gap-1 ms-1"
                  >
                    <input
                      v-model="form.sex"
                      class="form-check-input"
                      type="radio"
                      value="2"
                    />
                    Other
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div class="col-3 ps-logo d-flex justify-content-end">
            <img
              class="pe-none"
              src="/assets/img/prescription/logo.png"
              alt="logo"
            />
          </div>
        </div>

        <!-- main -->
        <div class="d-flex justify-content-between ps-main my-5 px-5">
          <!-- Medicines section -->
          <div class="w-75 border-end border-info-subtle pe-4">
            <div class="d-flex justify-content-between">
              <img
                class="pe-none"
                src="/assets/img/prescription/rx_icon.png"
                alt="rx icon"
                height="40"
              />
              <p>
                DATE: <strong>{{ currentDate }}</strong>
              </p>
            </div>

            <div class="d-flex my-4 align-items-center gap-2">
              <div>
                <label>Medicines</label>
                <select
                  v-model="medicineForm.medicine_id"
                  class="form-select py-1 px-2"
                >
                  <option value="">Select</option>
                  <option
                    v-for="med in medicines"
                    :key="med.id"
                    :value="med.id"
                  >
                    {{ med.name }}
                  </option>
                </select>
              </div>

              <div>
                <label>Dose</label>
                <select
                  v-model="medicineForm.dose"
                  class="form-select py-1 px-2"
                >
                  <option value="">Select</option>
                  <option v-for="dose in doseOptions" :key="dose" :value="dose">
                    {{ dose }}
                  </option>
                </select>
              </div>

              <div>
                <label>Course</label>
                <select
                  v-model="medicineForm.days"
                  style="min-width: 100px"
                  class="form-select py-1 px-2"
                >
                  <option value="">Select</option>
                  <option
                    v-for="course in courseOptions"
                    :key="course.value"
                    :value="course.value"
                  >
                    {{ course.label }}
                  </option>
                </select>
              </div>

              <div>
                <label>Suggestion</label>
                <select
                  v-model="medicineForm.suggestion"
                  style="min-width: 165px"
                  class="form-select py-1 px-2"
                >
                  <option value="">Select</option>
                  <option
                    v-for="sug in suggestionOptions"
                    :key="sug"
                    :value="sug"
                  >
                    {{ sug }}
                  </option>
                </select>
              </div>

              <div class="mt-4">
                <button @click="addMedicine" class="btn btn-info py-1 px-2">
                  Add
                </button>
              </div>
            </div>

            <!-- Medicines table -->
            <table class="table table-striped">
              <thead class="table-info">
                <tr>
                  <th>Medicine</th>
                  <th>Dose</th>
                  <th>Course</th>
                  <th>Suggestion</th>
                  <th class="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in items" :key="index">
                  <td>{{ item.medicine_name }}</td>
                  <td>{{ item.dose }}</td>
                  <td>{{ item.days_name }}</td>
                  <td>{{ item.suggestion }}</td>
                  <td class="text-center">
                    <button
                      @click="removeMedicine(index)"
                      class="btn px-2 btn-sm btn-danger"
                    >
                      <i class="fa fa-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Diagnosis & Notes -->
          <div class="w-25 ps-3">
            <p class="fw-bold m-0">DIAGNOSIS:</p>
            <div class="d-flex gap-2 align-items-center my-2">
              <select v-model="diagnosisValue" class="form-select px-2 py-1">
                <option value="">Select</option>
                <option v-for="srv in services" :key="srv.id" :value="srv.name">
                  {{ srv.name }}
                </option>
              </select>
              <button @click="addDiagnosis" class="btn mt-0 py-1 px-2 btn-info">
                Add
              </button>
            </div>

            <ol class="list-group list-group-numbered mt-1 mb-3">
              <li
                v-for="(diag, index) in diagnosisItems"
                :key="index"
                class="list-group-item d-flex justify-content-between align-items-center p-2"
              >
                {{ diag }}
                <span
                  style="cursor: pointer; height: 20px; width: 20px"
                  @click="removeDiagnosis(index)"
                  class="d-flex justify-content-center align-items-center rounded-pill bg-danger bg-opacity-25"
                >
                  <span style="margin-top: -3px">x</span>
                </span>
              </li>
            </ol>

            <hr />
            <p class="fw-bold text-info text-uppercase my-3">Clinical Notes</p>

            <div class="mb-3">
              <label class="form-label">Chief Complaint (CC):</label>
              <textarea
                v-model="form.cc"
                class="p-2 form-control"
                rows="2"
                placeholder="e.g., Fever, cough..."
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Relevant Findings (RF):</label>
              <textarea
                v-model="form.rf"
                class="p-2 form-control"
                rows="2"
                placeholder="e.g., Smoker, diabetic..."
              ></textarea>
            </div>

            <div class="mb-3">
              <label class="form-label">Doctor's Advice:</label>
              <textarea
                v-model="form.advice"
                class="p-2 form-control"
                rows="2"
                placeholder="e.g., Take rest, drink fluids..."
              ></textarea>
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
        <button
          @click="savePrescription"
          class="btn py-1 px-2 btn-lg btn-info position-absolute top-25 start-50"
        >
          <i class="fa fa-cart"></i> Save
        </button>
        <img
          class="pe-none"
          src="/assets/img/prescription/border_bottom.png"
          alt="bottom graphics"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Data lists
const doctors = ref([]);
const patients = ref([]);
const medicines = ref([]);
const services = ref([]);

// Form state
const form = ref({
  patient_id: "",
  consultant_id: "",
  age: "",
  sex: "",
  cc: "",
  rf: "",
  advice: "",
});

const medicineForm = ref({
  medicine_id: "",
  dose: "",
  days: "",
  suggestion: "",
});

const doseOptions = [
  "Morning only",
  "Afternoon only",
  "Night only",
  "Morning + Afternoon",
  "Morning + Night",
  "Afternoon + Night",
  "Morning + Afternoon + Night",
];

const courseOptions = [
  { value: "3", label: "3 Days" },
  { value: "7", label: "7 Days" },
  { value: "15", label: "15 Days" },
  { value: "30", label: "1 Month" },
  { value: "60", label: "2 Months" },
  { value: "180", label: "6 Months" },
];

const suggestionOptions = [
  "Before Meal 1Tab",
  "After Meal 1Tab",
  "Before Meal 2Tab",
  "After Meal 2Tab",
];

// Medicines list
const items = ref([]);

function addMedicine() {
  const med = medicines.value.find(
    (m) => m.id === medicineForm.value.medicine_id
  );
  if (!med) return;
  const course = courseOptions.find((c) => c.value === medicineForm.value.days);
  items.value.push({
    medicine_id: medicineForm.value.medicine_id,
    medicine_name: med.name,
    dose: medicineForm.value.dose,
    days: medicineForm.value.days,
    days_name: course ? course.label : "",
    suggestion: medicineForm.value.suggestion,
  });
}

// Remove medicine
function removeMedicine(index) {
  items.value.splice(index, 1);
}

// Diagnosis
const diagnosisValue = ref("");
const diagnosisItems = ref([]);

function addDiagnosis() {
  if (diagnosisValue.value) {
    diagnosisItems.value.push(diagnosisValue.value);
    diagnosisValue.value = "";
  }
}

function removeDiagnosis(index) {
  diagnosisItems.value.splice(index, 1);
}

const currentDate = computed(() => {
  return new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
    year: "numeric",
  });
});

// Fetch initial data
onMounted(async () => {
  try {
    console.log("url", BASE_URL);
    const [docRes, patRes, medRes, srvRes] = await Promise.all([
      axios.get(`${BASE_URL}/doctors`),
      axios.get(`${BASE_URL}/patients`),
      axios.get(`${BASE_URL}/medicines`),
      axios.get(`${BASE_URL}/services`),
    ]);
    doctors.value = docRes.data.data.data;
    patients.value = patRes.data.data.data;
    medicines.value = medRes.data.data.data;
    services.value = srvRes.data.data.data;
  } catch (err) {
    console.error("Error loading data", err);
  }
});

// Save prescription
async function savePrescription() {
  const payload = {
    patient_id: form.value.patient_id,
    consultant_id: form.value.consultant_id,
    cc: form.value.cc,
    rf: form.value.rf,
    investigation: diagnosisItems.value.join(", "),
    advice: form.value.advice,
    rx: items.value,
  };

  try {
    await axios.post(`${BASE_URL}/prescriptions`, payload);
    alert("Prescription created successfully");
    router.push("/prescriptions");
  } catch (err) {
    console.error("Error creating prescription", err);
    alert("Error Creating Prescription");
  }
}
</script>
<style scoped>
@import "/assets/css/hms.css";
</style>
