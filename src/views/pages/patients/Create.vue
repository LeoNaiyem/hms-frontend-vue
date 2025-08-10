<template>
  <div class="m-3 dark-mode-support">
    <!-- Header -->
    <div class="card mb-3">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4 class="m-0">Create Patient</h4>
        <router-link to="/patients" class="btn btn-success">Back</router-link>
      </div>
    </div>

    <!-- Form -->
    <div class="card p-4">
      <form @submit.prevent="submitForm">
        <!-- Name -->
        <div class="mb-3">
          <label for="name" class="form-label">Full Name</label>
          <input
            v-model="form.name"
            type="text"
            id="name"
            class="form-control"
            required
          />
        </div>

        <!-- Mobile -->
        <div class="mb-3">
          <label for="mobile" class="form-label">Mobile</label>
          <input
            v-model="form.mobile"
            type="text"
            id="mobile"
            class="form-control"
            required
          />
        </div>

        <!-- Mobile Extension -->
        <div class="mb-3">
          <label for="mob_ext" class="form-label">Mobile Extension</label>
          <input
            v-model="form.mob_ext"
            type="number"
            id="mob_ext"
            class="form-control"
          />
        </div>

        <!-- Date of Birth -->
        <div class="mb-3">
          <label for="dob" class="form-label">Date of Birth</label>
          <input
            v-model="form.dob"
            type="date"
            id="dob"
            class="form-control"
          />
        </div>

        <!-- Gender -->
        <div class="mb-3">
          <label for="gender" class="form-label">Gender</label>
          <select v-model="form.gender" id="gender" class="form-select" required>
            <option disabled value="">-- Select Gender --</option>
            <option value="0">Male</option>
            <option value="1">Female</option>
            <option value="2">Other</option>
          </select>
        </div>

        <!-- Profession -->
        <div class="mb-3">
          <label for="profession" class="form-label">Profession</label>
          <input
            v-model="form.profession"
            type="text"
            id="profession"
            class="form-control"
            placeholder="Optional"
          />
        </div>

        <!-- Buttons -->
        <div class="d-flex justify-content-between">
          <router-link to="/patients" class="btn btn-secondary">Cancel</router-link>
          <button type="submit" class="btn btn-success">Save Patient</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter();

const form = ref({
  name: "",
  mobile: "",
  mob_ext: "",
  dob: "",
  gender: "",
  profession: "",
});

const submitForm = async () => {
  try {
    const res = await axios.post(`${BASE_URL}/patients`, form.value);
    if (res.data.success) {
      alert("Patient created successfully!");
      router.push("/patients");
    } else {
      alert("Failed to create patient.");
    }
  } catch (err) {
    console.error("Error creating patient:", err);
    alert("An error occurred. Check console for details.");
  }
};
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
