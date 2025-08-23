<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Edit Admission</h4>
        <router-link to="/admissions" class="btn btn-success">Back</router-link>
      </div>
    </div>

    <!-- Form -->
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
            <option v-for="dept in departments" :key="dept.id" :value="dept.id">
              {{ dept.name }}
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
          <button type="submit" class="btn btn-success">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
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
const departments = ref([]);

const loadDropdowns = async () => {
  const endpoints = [
    axios.get(`${BASE_URL}/patients`),
    axios.get(`${BASE_URL}/doctors`),
    axios.get(`${BASE_URL}/beds/available`),
    axios.get(`${BASE_URL}/departments`)
  ];
  try {
    const [pRes, dRes, bRes, deptRes] = await Promise.all(endpoints);

    if (pRes.data.success) patients.value = pRes.data.data.data || [];
    if (dRes.data.success) doctors.value = dRes.data.data.data || [];
    if (bRes.data.success) availableBeds.value = bRes.data.data || [];
    if (deptRes.data.success) departments.value = deptRes.data.data.data || [];
  } catch (err) {
    console.error('Error loading dropdown data:', err);
  }
};

const loadAdmission = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/admissions/${route.params.id}`);
    if (res.data.success) {
      const adm = res.data.data;

      form.value.patient_id = adm.patient_id;
      form.value.ref_doctor_id = adm.ref_doctor_id;
      form.value.under_doctor_id = adm.under_doctor_id;
      form.value.bed_id = adm.bed_id;
      form.value.advance = adm.advance;
      form.value.department_id = adm.department_id;
      form.value.problem = adm.problem || "";
      form.value.remark = adm.remark || "";

      form.value.admission_date = adm.admission_date
        ? adm.admission_date.slice(0, 16).replace(' ', 'T')
        : "";

      // 🛠 Ensure assigned bed is included in dropdown
      if (adm.bed && !availableBeds.value.some(b => b.id === adm.bed.id)) {
        availableBeds.value.push(adm.bed);
      }

    } else {
      alert('Admission not found.');
      router.push('/admissions');
    }
  } catch (err) {
    console.error('Error loading admission:', err);
    alert('Failed to load admission.');
    router.push('/admissions');
  }
};


const submitForm = async () => {
  try {
    const formattedDate = new Date(form.value.admission_date)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' ');

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

    const res = await axios.put(`${BASE_URL}/admissions/${route.params.id}`, payload);

    if (res.data.success) {
      alert('Admission updated successfully.');
      router.push('/admissions');
    } else {
      alert('Update failed.');
    }
  } catch (err) {
    console.error('Error updating admission:', err);
    alert('An error occurred. Check console.');
  }
};

onMounted(async () => {
  await loadDropdowns();
  await loadAdmission();
});
</script>

<style scoped>
.dark-mode-support {
  background-color: transparent;
  color: #000;
}
body.dark .dark-mode-support { background-color: #121212; color: #f1f1f1; }
body.dark .card { background-color: #1e1e1e; color: #fff; }
body.dark .form-control, body.dark .form-select, body.dark textarea {
  background-color: #2c2c2c; color: #fff; border-color: #444;
}
</style>
