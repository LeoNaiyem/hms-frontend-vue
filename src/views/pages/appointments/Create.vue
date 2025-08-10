<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Create Appointment</h4>
        <router-link to="/appointments" class="btn btn-success"
          >Back</router-link
        >
      </div>
    </div>
    <div class="card p-4">
      <form @submit.prevent="submitForm">
        <!-- Patient Dropdown -->
        <div class="mb-3">
          <label for="patient_id" class="form-label">Patient</label>
          <select
            v-model="form.patient_id"
            id="patient_id"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Patient --</option>
            <option
              v-for="patient in patients"
              :key="patient.id"
              :value="patient.id"
            >
              {{ patient.name }} ({{ patient.mobile }})
            </option>
          </select>
        </div>

        <!-- Doctor Dropdown -->
        <div class="mb-3">
          <label for="doctor_id" class="form-label">Doctor</label>
          <select
            v-model="form.doctor_id"
            id="doctor_id"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Doctor --</option>
            <option
              v-for="doctor in doctors"
              :key="doctor.id"
              :value="doctor.id"
            >
              {{ doctor.name }} ({{ doctor.phone }})
            </option>
          </select>
        </div>

        <!-- Appointment Date & Time -->
        <div class="mb-3">
          <label for="appointment_at" class="form-label"
            >Appointment Date & Time</label
          >
          <input
            v-model="form.appointment_at"
            type="datetime-local"
            id="appointment_at"
            class="form-control"
            required
          />
        </div>

        <!-- CC -->
        <div class="mb-3">
          <label for="cc" class="form-label">Chief Complaint (CC)</label>
          <textarea
            v-model="form.cc"
            id="cc"
            class="form-control"
            rows="3"
            placeholder="Optional"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-between">
          <router-link to="/appointments" class="btn btn-secondary"
            >Cancel</router-link
          >
          <button type="submit" class="btn btn-success">
            Save Appointment
          </button>
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
  doctor_id: "",
  appointment_at: "",
  cc: "",
});

const doctors = ref([]);
const patients = ref([]);

const fetchDoctors = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/doctors`);
    if (res.data.success) {
      doctors.value = res.data.data.data || res.data; // depends on your API structure
      console.log(res.data.data.data);
    }
  } catch (err) {
    console.error("Failed to load doctors:", err);
  }
};

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

const submitForm = async () => {
  try {
    // Format datetime to MySQL format if needed
    const formattedDate = new Date(form.value.appointment_at)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    const payload = {
      ...form.value,
      appointment_at: formattedDate,
    };

    const res = await axios.post(`${BASE_URL}/appointments`, payload);

    if (res.data.success) {
      alert("Appointment created successfully!");
      router.push("/appointments");
    } else {
      alert("Failed to create appointment.");
    }
  } catch (err) {
    console.error("Error creating appointment:", err);
    alert("An error occurred. Check console for details.");
  }
};

onMounted(() => {
  fetchDoctors();
  fetchPatients();
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
