<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Create Bed</h4>
        <router-link to="/beds" class="btn btn-success">Back</router-link>
      </div>
    </div>

    <div class="card p-4">
      <form @submit.prevent="submitForm">
        <!-- Bed Number -->
        <div class="mb-3">
          <label for="bed_number" class="form-label">Bed Number</label>
          <input
            v-model="form.bed_number"
            type="text"
            id="bed_number"
            class="form-control"
            required
            placeholder="Enter bed number"
          />
        </div>

        <!-- Ward Dropdown -->
        <div class="mb-3">
          <label for="ward_id" class="form-label">Ward</label>
          <select
            v-model="form.ward_id"
            id="ward_id"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Ward --</option>
            <option
              v-for="ward in wards"
              :key="ward.id"
              :value="ward.id"
            >
              {{ ward.name }} ({{ ward.ward_code }})
            </option>
          </select>
        </div>

        <!-- Bed Type -->
        <div class="mb-3">
          <label for="bed_type" class="form-label">Bed Type</label>
          <select
            v-model="form.bed_type"
            id="bed_type"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Bed Type --</option>
            <option value="General">General</option>
            <option value="CCU">CCU</option>
            <option value="ICU">ICU</option>
            <option value="Cabin">Cabin</option>
          </select>
        </div>

        <!-- Status -->
        <div class="mb-3">
          <label for="status" class="form-label">Status</label>
          <select
            v-model="form.status"
            id="status"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Status --</option>
            <option value="Occupied">Occupied</option>
            <option value="Available">Available</option>
            <option value="Reserved">Reserved</option>
            <option value="Maintenance">Maintenance</option>
          </select>
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-between">
          <router-link to="/beds" class="btn btn-secondary">Cancel</router-link>
          <button type="submit" class="btn btn-success">Save Bed</button>
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
  bed_number: "",
  ward_id: "",
  bed_type: "",
  status: "",
});

const wards = ref([]);

const fetchWards = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/wards`);
    if (res.data.success) {
      wards.value = res.data.data.data || res.data;
    }
  } catch (err) {
    console.error("Failed to load wards:", err);
  }
};

const submitForm = async () => {
  try {
    const payload = { ...form.value };
    const res = await axios.post(`${BASE_URL}/beds`, payload);

    if (res.data.success) {
      alert("Bed created successfully!");
      router.push("/beds");
    } else {
      alert("Failed to create bed.");
    }
  } catch (err) {
    console.error("Error creating bed:", err);
    alert("An error occurred. Check console for details.");
  }
};

onMounted(() => {
  fetchWards();
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
