<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Create Admission</h4>
        <router-link to="/admissions" class="btn btn-success">Back</router-link>
      </div>
    </div>

    <div class="card p-4">
      <form @submit.prevent="submitForm">
        <!-- Patient -->
        <div class="mb-3">
          <label for="patient_id" class="form-label">Patient</label>
          <select v-model="form.patient_id" id="patient_id" class="form-select" required>
            <option disabled value="">-- Select Patient --</option>
            <option v-for="patient in patients" :key="patient.id" :value="patient.id">
              {{ patient.name }} ({{ patient.mobile }})
            </option>
          </select>
        </div>

        <!-- Referring Doctor -->
        <div class="mb-3">
          <label for="ref_doctor_id" class="form-label">Referring Doctor</label>
          <select v-model="form.ref_doctor_id" id="ref_doctor_id" class="form-select" required>
            <option disabled value="">-- Select Doctor --</option>
            <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
              {{ doctor.name }} ({{ doctor.phone }})
            </option>
          </select>
        </div>

        <!-- Under Doctor -->
        <div class="mb-3">
          <label for="under_doctor_id" class="form-label">Under Doctor</label>
          <select v-model="form.under_doctor_id" id="under_doctor_id" class="form-select" required>
            <option disabled value="">-- Select Doctor --</option>
            <option v-for="doctor in doctors" :key="doctor.id" :value="doctor.id">
              {{ doctor.name }} ({{ doctor.phone }})
            </option>
          </select>
        </div>

        <!-- Bed -->
        <div class="mb-3">
          <label for="bed_id" class="form-label">Bed</label>
          <select v-model="form.bed_id" id="bed_id" class="form-select" required>
            <option disabled value="">-- Select Available Bed --</option>
            <option v-for="bed in availableBeds" :key="bed.id" :value="bed.id">
              {{ bed.bed_number }} ({{ bed.bed_type }})
            </option>
          </select>
        </div>

        <!-- Admission Date -->
        <div class="mb-3">
          <label for="admission_date" class="form-label">Admission Date & Time</label>
          <input
            v-model="form.admission_date"
            type="datetime-local"
            id="admission_date"
            class="form-control"
            required
          />
        </div>

        <!-- Advance Payment -->
        <div class="mb-3">
          <label for="advance" class="form-label">Advance Payment</label>
          <input
            v-model.number="form.advance"
            type="number"
            id="advance"
            class="form-control"
            min="0"
            step="0.01"
            required
          />
        </div>

        <!-- Department -->
        <div class="mb-3">
          <label for="department_id" class="form-label">Department</label>
          <select v-model="form.department_id" id="department_id" class="form-select" required>
            <option disabled value="">-- Select Department --</option>
            <option v-for="department in departments" :key="department.id" :value="department.id">
              {{ department.name }}
            </option>
          </select>
        </div>

        <!-- Problem -->
        <div class="mb-3">
          <label for="problem" class="form-label">Problem</label>
          <textarea
            v-model="form.problem"
            id="problem"
            class="form-control"
            rows="3"
            placeholder="Optional"
          ></textarea>
        </div>

        <!-- Remark -->
        <div class="mb-3">
          <label for="remark" class="form-label">Remark</label>
          <textarea
            v-model="form.remark"
            id="remark"
            class="form-control"
            rows="3"
            placeholder="Optional"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-between">
          <router-link to="/admissions" class="btn btn-secondary">Cancel</router-link>
          <button type="submit" class="btn btn-success">Save Admission</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

const form = ref({
  patient_id: "",
  ref_doctor_id: "",
  under_doctor_id: "",
  bed_id: "",
  admission_date: "",
  advance: 0,
  department_id: "",
  problem: "",
  remark: "",
});

const patients = ref([]);
const doctors = ref([]);
const availableBeds = ref([]);
const departments = ref([]); // you should fetch this as well

const fetchPatients = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/patients`);
    if (res.data.success) {
      patients.value = res.data.data.data || res.data;
    }
  } catch (err) {
    console.error("Failed to load patients:", err);
  }
};

const fetchDoctors = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/doctors`);
    if (res.data.success) {
      doctors.value = res.data.data.data || res.data;
    }
  } catch (err) {
    console.error("Failed to load doctors:", err);
  }
};

const fetchBeds = async () => {
  try {
    // Ensure your backend returns ONLY available beds here
    const res = await axios.get(`${BASE_URL}/beds/available`);
    if (res.data.success) {
      availableBeds.value = res.data.data || res.data;
    }
  } catch (err) {
    console.error("Failed to load beds:", err);
  }
};

const fetchDepartments = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/departments`);
    if (res.data.success) {
      departments.value = res.data.data.data || res.data;
    }
  } catch (err) {
    console.error("Failed to load departments:", err);
  }
};

const submitForm = async () => {
  try {
    const formattedDate = new Date(form.value.admission_date)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const payload = {
      patient_id: form.value.patient_id,
      ref_doctor_id: form.value.ref_doctor_id,
      under_doctor_id: form.value.under_doctor_id,
      bed_id: form.value.bed_id,
      admission_date: formattedDate,
      advance: form.value.advance,
      department_id: form.value.department_id,
      problem: form.value.problem,
      remark: form.value.remark,
    };

    const res = await axios.post(`${BASE_URL}/admissions`, payload);

    if (res.data.success) {
      alert("Admission created successfully!");
      router.push("/admissions");
    } else {
      alert("Failed to create admission.");
    }
  } catch (err) {
    console.error("Error creating admission:", err);
    alert("An error occurred. Check console for details.");
  }
};

onMounted(() => {
  fetchPatients();
  fetchDoctors();
  fetchBeds();
  fetchDepartments();
});
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

body.dark .card {
  background-color: #1e1e1e;
  color: #fff;
}

body.dark .form-control,
body.dark .form-select,
body.dark textarea {
  background-color: #2c2c2c;
  color: #fff;
  border-color: #444;
}
</style>
