<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Create Medicine</h4>
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
            placeholder="Enter medicine name"
            required
          />
        </div>

        <!-- Category Dropdown -->
        <div class="mb-3">
          <label for="medicine_category_id" class="form-label">Category</label>
          <select
            v-model="form.medicine_category_id"
            id="medicine_category_id"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Category --</option>
            <option
              v-for="category in categories"
              :key="category.id"
              :value="category.id"
            >
              {{ category.name }}
            </option>
          </select>
        </div>

        <!-- Type Dropdown -->
        <div class="mb-3">
          <label for="medicine_type_id" class="form-label">Type</label>
          <select
            v-model="form.medicine_type_id"
            id="medicine_type_id"
            class="form-select"
            required
          >
            <option disabled value="">-- Select Type --</option>
            <option
              v-for="type in types"
              :key="type.id"
              :value="type.id"
            >
              {{ type.name }}
            </option>
          </select>
        </div>

        <!-- Generic Name -->
        <div class="mb-3">
          <label for="generic_name" class="form-label">Generic Name</label>
          <input
            v-model="form.generic_name"
            type="text"
            id="generic_name"
            class="form-control"
            placeholder="Enter generic name"
            required
          />
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
          <router-link to="/medicines" class="btn btn-secondary">
            Cancel
          </router-link>
          <button type="submit" class="btn btn-success">
            Save Medicine
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
  name: "",
  medicine_category_id: "",
  medicine_type_id: "",
  generic_name: "",
  description: "",
});

const categories = ref([]);
const types = ref([]);

const fetchCategories = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/medicine-categories`);
    if (res.data.success) {
      categories.value = res.data.data.data || res.data.data;
    }
  } catch (err) {
    console.error("Failed to load categories:", err);
  }
};

const fetchTypes = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/medicine-types`);
    if (res.data.success) {
      types.value = res.data.data.data || res.data.data;
    }
  } catch (err) {
    console.error("Failed to load types:", err);
  }
};

const submitForm = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/medicines`, form.value);
    if (res.data.success) {
      alert("Medicine created successfully!");
      router.push("/medicines");
    } else {
      alert("Failed to create medicine.");
    }
  } catch (err) {
    console.error("Error creating medicine:", err);
    alert("An error occurred. Check console for details.");
  }
};

onMounted(() => {
  fetchCategories();
  fetchTypes();
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
