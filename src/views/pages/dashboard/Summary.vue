<template>
  <div class="m-3">
    <h4 class="mb-4">Dashboard Summary</h4>

    <!-- Summary Cards -->
    <div class="row mb-4">
  <div class="col-md-3 mb-3" v-for="card in summaryCards" :key="card.title">
    <div
      class="card text-white h-100 shadow-sm"
      :style="{
        background: card.gradient,
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'transform 0.3s'
      }"
      @mouseover="e => e.currentTarget.style.transform = 'scale(1.05)'"
      @mouseleave="e => e.currentTarget.style.transform = 'scale(1)'"
    >
      <div class="card-body d-flex align-items-center justify-content-between">
        <div>
          <h6 class="card-title text-white">{{ card.title }}</h6>
          <h3 class="card-text text-white">{{ card.value }}</h3>
          <p class="mb-0 text-white-50">{{ card.desc }}</p>
        </div>
        <div class="fs-1">
          <i :class="card.icon"></i>
        </div>
      </div>
    </div>
  </div>
</div>


    <!-- Charts Section -->
    <div class="row mb-4">
      <div class="col-md-6 mb-3">
        <div class="card p-3">
          <h6>Appointments Under Doctor</h6>
          <div
            class="d-flex justify-content-center align-items-center"
            style="width: 100%; height: 400px"
          >
            <canvas id="appointmentsChart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-md-6 mb-3">
        <div class="card p-3">
          <h6>Bed Occupancy by Type</h6>
          <div
            class="d-flex justify-content-center align-items-end"
            style="width: 100%; height: 400px"
          >
            <canvas id="bedsChart"></canvas>
          </div>
        </div>
      </div>
      <div class="col-md-12 mb-3">
        <div class="card p-3">
          <h6>Monthly Revenue</h6>
          <canvas id="revenueChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Appointments -->
    <div class="card p-3 mb-4">
      <h6>Recent Appointments</h6>
      <div class="table-responsive">
        <table class="table table-striped align-middle">
          <thead class="table-primary">
            <tr>
              <th>#ID</th>
              <th>Patient</th>
              <th>Doctor</th>
              <th>Date & Time</th>
              <th>CC</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="appt in recentAppointments" :key="appt.id">
              <td>{{ appt.id }}</td>
              <td>{{ appt?.patient?.name || "N/A" }}</td>
              <td>{{ appt?.doctor?.name || "N/A" }}</td>
              <td>{{ formatDateTime(appt.appointment_at) }}</td>
              <td>{{ appt.cc || "-" }}</td>
            </tr>
            <tr v-if="recentAppointments.length === 0">
              <td colspan="5" class="text-center">No recent appointments</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Loading Spinner -->
    <div class="text-center my-3" v-if="loading">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Toast -->
    <div
      class="toast-container position-fixed bottom-0 end-0 p-3"
      style="z-index: 1055"
    >
      <div
        class="toast align-items-center text-white"
        role="alert"
        :class="['toast', toastType, { show: showToast }]"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="d-flex">
          <div class="toast-body">{{ toastMessage }}</div>
          <button
            type="button"
            class="btn-close btn-close-white me-2 m-auto"
            @click="showToast = false"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { Chart, registerables } from "chart.js";
import { nextTick, onMounted, ref } from "vue";
Chart.register(...registerables);

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const loading = ref(false);
const showToast = ref(false);
const toastMessage = ref("");
const toastType = ref("bg-success");

// Summary cards
const summaryCards = ref([
  {
    title: "Patients",
    value: 0,
    desc: "Total registered patients",
    gradient: "linear-gradient(135deg, #1e3c72, #2a5298)",
    icon: "fas fa-procedures"
  },
  {
    title: "Doctors",
    value: 0,
    desc: "Active doctors",
    gradient: "linear-gradient(135deg, #11998e, #38ef7d)",
    icon: "fas fa-user-md"
  },
  {
    title: "Appointments",
    value: 0,
    desc: "Total appointments",
    gradient: "linear-gradient(135deg, #fc4a1a, #f7b733)",
    icon: "fas fa-calendar-check"
  },
  {
    title: "Beds",
    value: 0,
    desc: "Total hospital beds",
    gradient: "linear-gradient(135deg, #6a11cb, #2575fc)",
    icon: "fas fa-bed"
  },
  {
    title: "Departments",
    value: 0,
    desc: "Number of departments",
    gradient: "linear-gradient(135deg, #f7ba2c, #ea5459)",
    icon: "fas fa-building"
  },
  {
    title: "Wards",
    value: 0,
    desc: "Total wards",
    gradient: "linear-gradient(135deg, #432371, #faae7b)",
    icon: "fas fa-hospital"
  },
  {
    title: "Revenue",
    value: 0,
    desc: "Total revenue earned",
    gradient: "linear-gradient(-135deg, #c7b3cc, #268ab2)",
    icon: "fas fa-dollar-sign"
  },
  {
    title: "Admissions",
    value: 0,
    desc: "Current patient admissions",
    gradient: "linear-gradient(135deg, #42047e, #07f49e)",
    icon: "fas fa-notes-medical"
  }
]);


const recentAppointments = ref([]);

// Chart instances
let appointmentsChart = ref(null);
let bedsChart = ref(null);
let revenueChart = ref(null);

const fetchDashboard = async () => {
  loading.value = true;
  try {
    const [
      patientsRes,
      doctorsRes,
      appointmentsRes,
      bedsRes,
      departmentsRes,
      wardsRes,
      invoicesRes,
      admissionsRes,
    ] = await Promise.all([
      axios.get(`${BASE_URL}/patients`),
      axios.get(`${BASE_URL}/doctors`),
      axios.get(`${BASE_URL}/appointments`),
      axios.get(`${BASE_URL}/beds`),
      axios.get(`${BASE_URL}/departments`),
      axios.get(`${BASE_URL}/wards`),
      axios.get(`${BASE_URL}/invoices`),
      axios.get(`${BASE_URL}/admissions`),
    ]);

    // Summary values
    summaryCards.value[0].value = patientsRes.data.data.data.length;
    summaryCards.value[1].value = doctorsRes.data.data.data.length;
    summaryCards.value[2].value = appointmentsRes.data.data.data.length;
    summaryCards.value[3].value = bedsRes.data.data.data.length;
    summaryCards.value[4].value = departmentsRes.data.data.data.length;
    summaryCards.value[5].value = wardsRes.data.data.data.length;
    summaryCards.value[7].value = admissionsRes.data.data.data.length;

    const totalRevenue = invoicesRes.data.data.data.reduce(
      (acc, inv) => acc + (parseFloat(inv.invoice_total) || 0),
      0
    );
    summaryCards.value[6].value = totalRevenue.toFixed(2);

    // Recent appointments
    recentAppointments.value = appointmentsRes.data.data.data
      .slice(-5)
      .reverse();

    // Initialize charts
    initCharts(
      appointmentsRes.data.data.data,
      bedsRes.data.data.data,
      invoicesRes.data.data.data
    );
  } catch (err) {
    console.error(err);
    showToastMessage("Failed to fetch dashboard data", "bg-danger");
  } finally {
    loading.value = false;
  }
};

const showToastMessage = (msg, type = "bg-success") => {
  toastMessage.value = msg;
  toastType.value = type;
  showToast.value = true;
  setTimeout(() => (showToast.value = false), 3000);
};

const formatDateTime = (dt) => (dt ? new Date(dt).toLocaleString() : "-");

const initCharts = async (appointments, beds, invoices) => {
  await nextTick(); // ensure canvas is rendered

  // Appointments per department
  const deptMap = {};
  appointments.forEach((a) => {
    const dept = a?.doctor?.name || "Unknown";
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });
  const ctx1 = document.getElementById("appointmentsChart").getContext("2d");
  if (appointmentsChart.value) appointmentsChart.value.destroy();
  appointmentsChart.value = new Chart(ctx1, {
    type: "bar",
    data: {
      labels: Object.keys(deptMap),
      datasets: [
        {
          label: "Appointments",
          data: Object.values(deptMap),
          backgroundColor: [
            "#007bff",
            "#28a745",
            "#ffc107",
            "#dc3545",
            "#6c757d",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: { responsive: true, scales: { y: { beginAtZero: true } } },
  });

  // Beds chart
  const bedTypes = ["General", "Semi-Cabin", "Cabin", "ICU", "CCU"];
  const bedCounts = bedTypes.map(
    (type) => beds.filter((b) => b.bed_type === type).length
  );
  const ctx2 = document.getElementById("bedsChart").getContext("2d");
  if (bedsChart.value) bedsChart.value.destroy();
  bedsChart.value = new Chart(ctx2, {
    type: "doughnut",
    data: {
      labels: bedTypes,
      datasets: [
        {
          data: bedCounts,
          backgroundColor: [
            "#007bff",
            "#28a745",
            "#ffc107",
            "#dc3545",
            "#6c757d",
          ],
        },
      ],
    },
    options: { responsive: true },
  });

  // Revenue chart
  const monthlyRevenue = {};
  invoices.forEach((inv) => {
    if (!inv.created_at) return;
    const month = new Date(inv.created_at).toLocaleString("default", {
      month: "short",
      year: "numeric",
    });
    monthlyRevenue[month] =
      (monthlyRevenue[month] || 0) + (parseFloat(inv.invoice_total) || 0);
  });
  const ctx3 = document.getElementById("revenueChart").getContext("2d");
  if (revenueChart.value) revenueChart.value.destroy();
  revenueChart.value = new Chart(ctx3, {
    type: "line",
    data: {
      labels: Object.keys(monthlyRevenue),
      datasets: [
        {
          label: "Revenue",
          data: Object.values(monthlyRevenue),
          borderColor: "#17a2b8",
          backgroundColor: "rgba(23,162,184,0.2)",
          fill: true,
          tension: 0.3,
        },
      ],
    },
    options: { responsive: true },
  });
};

onMounted(() => {
  fetchDashboard();
});
</script>

<style scoped>
.card {
  cursor: default;
}
</style>
