<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Create Doctor</h4>
        <router-link to="/doctors" class="btn btn-success">Back</router-link>
      </div>
    </div>
    <div class="card p-4">
      <form @submit.prevent="submitForm">
        <!-- Name -->
        <div class="mb-3">
          <label for="name" class="form-label">Name</label>
          <input
            v-model="form.name"
            id="name"
            type="text"
            class="form-control"
            required
            placeholder="Doctor's full name"
          />
        </div>

        <!-- Phone -->
        <div class="mb-3">
          <label for="phone" class="form-label">Phone</label>
          <input
            v-model="form.phone"
            id="phone"
            type="tel"
            class="form-control"
            required
            placeholder="Phone number"
          />
        </div>

        <!-- Designation Dropdown -->
        <div class="mb-3">
          <label for="designation_id" class="form-label">Designation</label>
          <select
            v-model="form.designation_id"
            id="designation_id"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Designation --</option>
            <option
              v-for="designation in designations"
              :key="designation.id"
              :value="designation.id"
            >
              {{ designation.name }}
            </option>
          </select>
        </div>

        <!-- Department Dropdown -->
        <div class="mb-3">
          <label for="department_id" class="form-label">Department</label>
          <select
            v-model="form.department_id"
            id="department_id"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Department --</option>
            <option
              v-for="department in departments"
              :key="department.id"
              :value="department.id"
            >
              {{ department.name }}
            </option>
          </select>
        </div>

        <!-- Photo Upload -->
        <div class="mb-3">
          <label for="photo" class="form-label">Photo (optional)</label>
          <input
            id="photo"
            type="file"
            class="form-control"
            @change="handlePhotoUpload"
            accept="image/*"
          />
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-between">
          <router-link to="/doctors" class="btn btn-secondary">Cancel</router-link>
          <button type="submit" class="btn btn-success">Save Doctor</button>
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
  name: "",
  phone: "",
  designation_id: "",
  department_id: "",
  photo: null, // store file
});

const designations = ref([]);
const departments = ref([]);

// Fetch designations
const fetchDesignations = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/designations`);
    if (res.data.success) {
      designations.value = res.data.data.data || res.data;
    }
  } catch (err) {
    console.error("Failed to load designations:", err);
  }
};

// Fetch departments
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

// Handle photo file input
const handlePhotoUpload = (event) => {
  const file = event.target.files[0];
  form.value.photo = file || null;
};

const submitForm = async () => {
  try {
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("phone", form.value.phone);
    formData.append("designation_id", form.value.designation_id);
    formData.append("department_id", form.value.department_id);
    if (form.value.photo) {
      formData.append("photo", form.value.photo);
    }

    const res = await axios.post(`${BASE_URL}/doctors`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      alert("Doctor created successfully!");
      router.push("/doctors");
    } else {
      alert("Failed to create doctor.");
    }
  } catch (err) {
    console.error("Error creating doctor:", err);
    alert("An error occurred. Check console for details.");
  }
};

onMounted(() => {
  fetchDesignations();
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
