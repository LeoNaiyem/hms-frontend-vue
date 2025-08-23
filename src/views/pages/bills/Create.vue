<!-- AppointmentForm.vue -->
<template>
  <div>
    <div class="card bg-info mb-3 p-4">
      <div class="row">
        <div class="col-12 d-flex justify-content-between align-items-center">
          <h3 class="card-title text-white m-0">
            {{ mode === "edit" ? "Edit Appointment" : "Create Appointment" }}
          </h3>
          <router-link to="/appointments" class="btn btn-light btn-sm">
            <i class="fa fa-arrow-left me-1"></i> Back
          </router-link>
        </div>
      </div>
    </div>

    <div class="card p-4">
      <form @submit.prevent="handleSubmit">
        <!-- Patient -->
        <div class="mb-2">
          <label>Patient</label>
          <select v-model="form.patient_id" class="form-select" required>
            <option value="">--- Select Patient ---</option>
            <option
              v-for="patient in patients"
              :key="patient.id"
              :value="patient.id"
            >
              {{ patient.name ?? patient.id }}
            </option>
          </select>
        </div>

        <!-- Doctor -->
        <div class="mb-2">
          <label>Doctor</label>
          <select v-model="form.doctor_id" class="form-select" required>
            <option value="">--- Select Doctor ---</option>
            <option
              v-for="doctor in doctors"
              :key="doctor.id"
              :value="doctor.id"
            >
              {{ doctor.name ?? doctor.id }}
            </option>
          </select>
        </div>

        <!-- Appointment Date -->
        <div class="mb-2">
          <label>Appointment At</label>
          <input
            type="datetime-local"
            v-model="form.appointment_at"
            class="form-control"
            required
          />
        </div>

        <!-- CC -->
        <div class="mb-2">
          <label>Cc</label>
          <input type="text" v-model="form.cc" class="form-control" required />
        </div>

        <!-- Submit Button -->
        <button class="btn btn-info">
          {{ mode === "edit" ? "Update" : "Create" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Props
const props = defineProps({
  mode: { type: String, default: "create" }, // 'create' or 'edit'
  existingAppointment: { type: Object, default: () => ({}) },
});

const router = useRouter();

// Form state
const form = ref({
  patient_id: "",
  doctor_id: "",
  appointment_at: "",
  cc: "",
});

// Prefill if in edit mode
onMounted(() => {
  if (props.mode === "edit" && props.existingAppointment) {
    form.value = { ...props.existingAppointment };
  }
});

// Load patients & doctors
const patients = ref([]);
const doctors = ref([]);
const loadPatientsAndDoctors = async () => {
  try {
    const [patientsRes, doctorsRes] = await Promise.all([
      axios.get(`${BASE_URL}/patients`),
      axios.get(`${BASE_URL}/doctors`),
    ]);
    patients.value = patientsRes.data.data.data;
    doctors.value = doctorsRes.data.data.data;
  } catch (error) {
    console.error("Error loading dropdown data:", error);
  }
};

onMounted(loadPatientsAndDoctors);

// Submit
const handleSubmit = async () => {
  try {
    const url =
      props.mode === "edit"
        ? `/api/appointments/${form.value.id}`
        : "/api/appointments";
    const method = props.mode === "edit" ? "put" : "post";

    await axios[method](url, form.value);

    alert(
      `Appointment ${
        props.mode === "edit" ? "updated" : "created"
      } successfully`
    );
    router.push("/appointments");
  } catch (error) {
    console.error("Error submitting form:", error);
  }
};
</script>
