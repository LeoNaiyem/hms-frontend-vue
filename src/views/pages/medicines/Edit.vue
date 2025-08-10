<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Edit Medicine</h4>
        <router-link to="/medicines" class="btn btn-success">Back</router-link>
      </div>
    </div>

    <!-- Form -->
    <div class="card p-4">
      <form @submit.prevent="submitForm">
        <!-- Name -->
        <div class="mb-3">
          <label for="name" class="form-label">Medicine Name</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            class="form-control"
            required
          />
        </div>

        <!-- Generic Name -->
        <div class="mb-3">
          <label for="generic_name" class="form-label">Generic Name</label>
          <input
            v-model="form.generic_name"
            type="text"
            id="generic_name"
            class="form-control"
            required
          />
        </div>

        <!-- Category -->
        <div class="mb-3">
          <label for="medicine_category_id" class="form-label">Medicine Category</label>
          <select
            v-model="form.medicine_category_id"
            id="medicine_category_id"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Category --</option>
            <option
              v-for="category in medicineCategories"
              :key="category.id"
              :value="String(category.id)"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Type -->
        <div class="mb-3">
          <label for="medicine_type_id" class="form-label">Medicine Type</label>
          <select
            v-model="form.medicine_type_id"
            id="medicine_type_id"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Type --</option>
            <option
              v-for="type in medicineTypes"
              :key="type.id"
              :value="String(type.id)"
            >
              {{ type.name }}
            </option>
          </select>
        </div>

        <!-- Description -->
        <div class="mb-3">
          <label for="description" class="form-label">Description</label>
          <textarea
            v-model="form.description"
            id="description"
            class="form-control"
            rows="3"
            placeholder="Optional"
          ></textarea>
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-between">
          <router-link to="/medicines" class="btn btn-secondary">Cancel</router-link>
          <button type="submit" class="btn btn-success">Save Changes</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const route = useRoute();
const router = useRouter();

const form = ref({
  name: "",
  generic_name: "",
  medicine_category_id: "",
  medicine_type_id: "",
  description: "",
});

const medicineCategories = ref([]);
const medicineTypes = ref([]);

// Fetch category list
const fetchMedicineCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/medicine-categories`);
    if (res.data.success) {
      medicineCategories.value = res.data.data.data || res.data.data || [];
    }
  } catch (err) {
    console.error("Error loading categories", err);
  }
};

// Fetch type list
const fetchMedicineTypes = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/medicine-types`);
    if (res.data.success) {
      medicineTypes.value = res.data.data.data || res.data.data || [];
    }
  } catch (err) {
    console.error("Error loading types", err);
  }
};

// Fetch medicine details
const fetchMedicine = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/medicines/${route.params.id}`);
    if (res.data.success) {
      const med = res.data.data;
      form.value.name = med.name || "";
      form.value.generic_name = med.generic_name || "";
      form.value.medicine_category_id =
        med.medicine_category_id !== null ? String(med.medicine_category_id) : "";
      form.value.medicine_type_id =
        med.medicine_type_id !== null ? String(med.medicine_type_id) : "";
      form.value.description = med.description || "";
    } else {
      alert("Medicine not found.");
      router.push("/medicines");
    }
  } catch (err) {
    console.error("Error fetching medicine", err);
    alert("Error loading medicine.");
    router.push("/medicines");
  }
};

// Submit form
const submitForm = async () => {
  try {
    const res = await axios.put(
      `${BASE_URL}/medicines/${route.params.id}`,
      form.value
    );
    if (res.data.success) {
      alert("Medicine updated successfully.");
      router.push("/medicines");
    } else {
      alert("Failed to update medicine.");
    }
  } catch (err) {
    console.error("Error updating medicine", err);
    alert("An error occurred. Check console for details.");
  }
};

// Load on mount
onMounted(async () => {
  await Promise.all([fetchMedicineCategories(), fetchMedicineTypes()]);
  await fetchMedicine();
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
