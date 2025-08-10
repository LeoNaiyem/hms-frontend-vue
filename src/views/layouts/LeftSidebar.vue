<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const navbarStyle = localStorage.getItem("navbarStyle");
  if (navbarStyle && navbarStyle !== "transparent") {
    const navbar = document.querySelector(".navbar-vertical");
    if (navbar) {
      navbar.classList.add(`navbar-${navbarStyle}`);
    }
  }
});

const sidebarItems = [
  {
    title: "Dashboard",
    icon: "fas fa-home",
    colorClass: "text-warning",
    id: "dashboard",
    links: [{ name: "Summary", url: "summary" }],
  },
  { type: "section", label: "Modules" },

  {
    title: "Appointments",
    icon: "fas fa-calendar-check",
    colorClass: "text-primary",
    id: "appointments",
    links: [
      { name: "Manage Appointments", url: "appointments" },
      { name: "Create Appointment", url: "appointments/create" },
    ],
  },
  {
    title: "Patients",
    icon: "fas fa-user-injured",
    colorClass: "text-danger",
    id: "patients",
    links: [
      { name: "Manage Patients", url: "patients" },
      { name: "Create Patient", url: "patients/create" },
    ],
  },
  {
    title: "Consultants",
    icon: "fas fa-user-tie",
    colorClass: "text-success",
    id: "consultants",
    links: [
      { name: "Manage Consultants", url: "consultants" },
      { name: "Create Consultant", url: "consultants/create" },
    ],
  },
  {
    title: "Departments",
    icon: "fas fa-building",
    colorClass: "text-info",
    id: "departments",
    links: [
      { name: "Manage Departments", url: "departments" },
      { name: "Create Departments", url: "departments/create" },
    ],
  },
  {
    title: "Designations",
    icon: "fas fa-suitcase",
    colorClass: "text-secondary",
    id: "designations",
    links: [
      { name: "Manage Designations", url: "designations" },
      { name: "Create Designations", url: "designations/create" },
    ],
  },
  {
    title: "Doctors",
    icon: "fas fa-user-md",
    colorClass: "text-primary",
    id: "doctors",
    links: [
      { name: "Manage Doctors", url: "doctors" },
      { name: "Create Doctor", url: "doctors/create" },
    ],
  },
  {
    title: "Prescriptions",
    icon: "fas fa-prescription-bottle-alt",
    colorClass: "text-warning",
    id: "prescriptions",
    links: [
      { name: "Manage Prescriptions", url: "prescriptions" },
      { name: "Create Prescription", url: "prescriptions/create" },
    ],
  },
  {
    title: "Admissions",
    icon: "fas fa-procedures",
    colorClass: "text-danger",
    id: "admissions",
    links: [
      { name: "Manage Admissions", url: "admissions" },
      { name: "Create Admission", url: "admissions/create" },
    ],
  },
  {
    title: "HP Services",
    icon: "fas fa-stethoscope",
    colorClass: "text-success",
    id: "submenu",
    links: [
      {
        name: "Services",
        id: "hpServices",
        children: [
          { name: "Manage Services", url: "services" },
          { name: "Add Service", url: "services/create" },
        ],
      },
      {
        name: "Beds",
        id: "beds",
        children: [
          { name: "Managed Beds", url: "beds" },
          { name: "Add Bed", url: "beds/create" },
        ],
      },
    ],
  },
  {
    title: "Pharmacies",
    icon: "fas fa-pills",
    colorClass: "text-info",
    id: "pharmacies",
    links: [
      { name: "Manage Medicines", url: "medicines" },
      { name: "Add Medicines", url: "medicines/create" },
      { name: "Manage Medi Types", url: "medicine-types" },
      { name: "Add Medi Type", url: "medicine-types/create" },
      { name: "Manage Medi Categories", url: "medicine-categories/create" },
      { name: "Add Medi Category", url: "medicine-categories/create" },
    ],
  },
  {
    title: "Accounts",
    icon: "fas fa-file-invoice-dollar",
    colorClass: "text-warning",
    id: "accounts",
    links: [
      { name: "Crate Bill", url: "bills/create" },
      { name: "Manage Invoices", url: "invoices" },
      { name: "Create Invoices", url: "invoices/create" },
      { name: "Manage Money Receipts", url: "money-receipts" },
      { name: "Create Money Receipt", url: "money-receipts/create" },
    ],
  },
  {
    title: "System",
    icon: "fas fa-cogs",
    colorClass: "text-dark",
    id: "system",
    links: [
      { name: "Manage Themes", url: "themes" },
      { name: "Change Theme", url: "themes/create" },
    ],
  },
  {
    title: "Logout",
    icon: "fas fa-sign-out-alt",
    colorClass: "text-danger",
    id: "logout",
    url: "/logout",
    isStandalone: true,
  },
];
</script>

<template>
  <nav class="navbar navbar-light navbar-vertical navbar-expand-xl">
    <div class="d-flex align-items-center">
      <div class="toggle-icon-wrapper">
        <button
          class="btn navbar-toggler-humburger-icon navbar-vertical-toggle"
          data-bs-toggle="tooltip"
          data-bs-placement="left"
          title="Toggle Navigation"
        >
          <span class="navbar-toggle-icon"
            ><span class="toggle-line"></span
          ></span>
        </button>
      </div>
      <a class="navbar-brand" href="../index.html">
        <div class="d-flex align-items-center py-3">
          <img
            class="me-2 object-fit-cover"
            src="/assets/logos/logo.png"
            alt="logo"
            height="40"
          /><span class="font-sans-serif">HMS</span>
        </div>
      </a>
    </div>
    <div class="collapse navbar-collapse" id="navbarVerticalCollapse">
      <div class="navbar-vertical-content scrollbar">
        <ul class="navbar-nav flex-column mb-3" id="navbarVerticalNav">
          <li
            v-for="(item, index) in sidebarItems"
            :key="index"
            class="nav-item"
          >
            <!-- Section Label -->
            <template v-if="item.type === 'section'">
              <span
                class="nav-link-text ps-1 text-uppercase small fw-bold text-muted"
              >
                {{ item.label }}
              </span>
            </template>

            <!-- Standalone Route Link (e.g. Logout) -->
            <template v-else-if="item.isStandalone">
              <router-link class="nav-link" :to="item.url">
                <div class="d-flex align-items-center">
                  <span class="nav-link-icon">
                    <i :class="[item.icon, item?.colorClass]"></i>
                  </span>
                  <span class="nav-link-text ps-1">{{ item.title }}</span>
                </div>
              </router-link>
            </template>

            <!-- Collapsible Menu -->
            <template v-else>
              <a
                class="nav-link dropdown-indicator"
                :href="'#' + item.id"
                role="button"
                data-bs-toggle="collapse"
                :aria-expanded="false"
                :aria-controls="item.id"
              >
                <div class="d-flex align-items-center">
                  <span class="nav-link-icon" :class="item?.colorClass">
                    <i :class="item.icon"></i>
                  </span>
                  <span class="nav-link-text ps-1">{{ item.title }}</span>
                </div>
              </a>

              <ul class="nav collapse" :id="item.id">
                <!-- Normal link -->
                <li
                  v-for="(link, linkIndex) in item.links"
                  :key="linkIndex"
                  class="nav-item"
                >
                  <!-- Check if this link has nested children (for deep submenus) -->
                  <template v-if="link.children">
                    <!-- Nested collapsible menu -->
                    <a
                      class="nav-link dropdown-indicator"
                      :href="'#' + link.id"
                      role="button"
                      data-bs-toggle="collapse"
                      :aria-expanded="false"
                      :aria-controls="link.id"
                    >
                      <div class="d-flex align-items-center">
                        <span class="nav-link-text ps-1">{{ link.name }}</span>
                      </div>
                    </a>
                    <ul class="nav collapse ps-3" :id="link.id">
                      <li
                        v-for="(child, childIndex) in link.children"
                        :key="childIndex"
                        class="nav-item"
                      >
                        <router-link class="nav-link" :to="'/' + child.url">
                          <span class="nav-link-text ps-1">{{
                            child.name
                          }}</span>
                        </router-link>
                      </li>
                    </ul>
                  </template>

                  <!-- Regular router-link -->
                  <template v-else>
                    <router-link class="nav-link" :to="'/' + link.url">
                      <div class="d-flex align-items-center">
                        <span class="nav-link-text ps-1">{{ link.name }}</span>
                      </div>
                    </router-link>
                  </template>
                </li>
              </ul>
            </template>
          </li>
        </ul>
        <div class="settings mb-3">
          <div class="card shadow-none">
            <div class="card-body alert mb-0" role="alert">
              <div class="btn-close-falcon-container">
                <button
                  class="btn btn-link btn-close-falcon p-0"
                  aria-label="Close"
                  data-bs-dismiss="alert"
                ></button>
              </div>
              <div class="text-center">
                <img
                  src="/assets/img/icons/spot-illustrations/navbar-vertical.png"
                  alt=""
                  width="80"
                />
                <p class="fs--2 mt-2">
                  Enjoying the interface?<br />
                  Dive into the
                  <a href="https://www.github.com/leonaiyem/" target="_blank"
                    >source code</a
                  >
                </p>
                <div class="d-grid">
                  <a
                    class="btn btn-sm btn-purchase"
                    href="https://leonaiyem.onrender.com/"
                    target="_blank"
                  >
                    Discover More
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
