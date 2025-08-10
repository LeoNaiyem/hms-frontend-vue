<template>
  <div class="container mt-4">
    <div class="card">
      <div class="d-flex justify-content-between align-items-center p-3">
        <h4>Manage Appointments</h4>
        <button class="btn btn-success" @click="addAppointment">Add New Appointment</button>
      </div>
    </div>

    <!-- Filter -->
     <div class="card p-3 my-3 d-flex align-items-center flex-row justify-content-between gap-3">
  <div style="flex-grow: 2;">
    <input v-model="filters.search" type="text" class="form-control" placeholder="Search by patient name..." @input="fetchAppointments(1)" />
  </div>
  <div class="flex-grow-1">
    <input v-model="filters.date" type="date" class="form-control" @change="fetchAppointments(1)" />
  </div>
  <div class="flex-grow-1">
    <button class="btn btn-success w-100" @click="">Apply</button>
  </div>
  <div class="flex-grow-1">
    <button class="btn btn-outline-danger w-100" @click="resetFilters">Reset</button>
  </div>
</div>


    <!-- Table -->
    <div class="card table-responsive">
      <table class="table table-striped align-middle">
        <thead class="table-primary">
          <tr>
            <th>#ID</th>
            <th>Patient</th>
            <th>Doctor</th>
            <th>Date & Time</th>
            <th>CC</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="appt in appointments" :key="appt.id">
            <td>
              {{ appt.id }} <br />
            </td>
            <td>
              {{ appt.patient?.name || 'N/A' }} <br />
              <small>{{ appt.patient?.mobile || '' }}</small>
            </td>
            <td>
              <div v-if="appt.doctor" class="d-flex align-items-center">
                <!-- <img :src="doctorPhotoUrl(appt.doctor.photo)" alt="doctor photo" style="width:32px; height:32px; object-fit:cover; border-radius:50%; margin-right:8px;" /> -->
                <div>
                  {{ appt.doctor.name }}<br />
                  <small>{{ appt.doctor.phone }}</small>
                </div>
              </div>
              <div v-else>N/A</div>
            </td>
            <td>{{ formatDateTime(appt.appointment_at) }}</td>
            <td>{{ appt.cc || '-' }}</td>
            <td class="text-end">
              <button class="btn btn-sm btn-outline-primary me-1" @click="viewAppointment(appt)">View</button>
              <button class="btn btn-sm btn-outline-warning me-1" @click="editAppointment(appt)">Edit</button>
              <button class="btn btn-sm btn-outline-danger" @click="deleteAppointment(appt.id)">Delete</button>
            </td>
          </tr>
          <tr v-if="appointments.length === 0">
            <td colspan="5" class="text-center">No appointments found.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <nav class="mt-3" v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="fetchAppointments(currentPage - 1)" :disabled="currentPage === 1">Previous</button>
        </li>
        <li
          v-for="page in totalPages"
          :key="page"
          class="page-item"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="fetchAppointments(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="fetchAppointments(currentPage + 1)" :disabled="currentPage === totalPages">Next</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const BASE_URL= import.meta.env.VITE_API_BASE_URL;

const appointments = ref([])
const currentPage = ref(1)
const totalPages = ref(1)
const perPage = ref(10)

const filters = ref({
  search: '',
  date: ''
})

// Helper to format datetime nicely
function formatDateTime(dt) {
  if (!dt) return '-'
  const d = new Date(dt)
  return d.toLocaleString()
}

// Construct doctor photo full url
function doctorPhotoUrl(path) {
  if (!path) return ''
  // Assuming your API server is same origin or change accordingly
  return `http://127.0.0.1:8000/${path}`
}

// Fetch appointments from API with pagination and filters
async function fetchAppointments(page = 1) {
  try {
    const params = { page }
    if (filters.value.search) params.search = filters.value.search
    if (filters.value.date) params.date = filters.value.date

    const res = await axios.get(`${BASE_URL}/appointments`, { params })
    if (res.data.success) {
      appointments.value = res.data.data.data
      currentPage.value = res.data.data.current_page
      totalPages.value = res.data.data.last_page
      perPage.value = res.data.data.per_page
    }
  } catch (error) {
    console.error('Failed to fetch appointments:', error)
  }
}

function resetFilters() {
  filters.value = { search: '', date: '' }
  fetchAppointments(1)
}

function addAppointment() {
  alert('Add Appointment clicked!')
}
function viewAppointment(appt){
  console.log(appt);
}
function editAppointment(appt) {
  alert(`Edit appointment for ${appt.patient?.name || 'Unknown'}`)
}

function deleteAppointment(id) {
  if (confirm('Are you sure you want to delete this appointment?')) {
    // Example delete, you might want to call your DELETE API here
    // For demo, remove locally
    appointments.value = appointments.value.filter(a => a.id !== id)
    alert('Deleted appointment locally. Refresh page to reload.')
  }
}

onMounted(() => {
  fetchAppointments()
})
</script>

<style scoped>
/* Optional styling */
</style>
