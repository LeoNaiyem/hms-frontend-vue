<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Department Details</h4>
        <router-link to="/departments" class="btn btn-success">Back</router-link>
      </div>
    </div>

    <!-- Loading -->
    <div class="text-center my-3" v-if="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Department Details -->
    <div v-if="department && !loading" class="card p-4">
      <h5 class="mb-3">Department Information</h5>
      <div class="mb-2">
        <strong>ID:</strong> {{ department.id }}
      </div>
      <div class="mb-2">
        <strong>Name:</strong> {{ department.name }}
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="error && !loading" class="alert alert-danger mt-3">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const route = useRoute();
const departmentId = route.params.id;

const department = ref(null);
const loading = ref(true);
const error = ref("");

const fetchDepartment = async () => {
  loading.value = true;
  error.value = "";

  try {
    const res = await axios.get(`${BASE_URL}/departments/${departmentId}`);
    if (res.data.success) {
      department.value = res.data.data;
    } else {
      error.value = "Failed to load department details.";
    }
  } catch (err) {
    console.error(err);
    error.value = "An error occurred while fetching the department.";
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchDepartment();
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
</style>
