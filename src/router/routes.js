import { createRouter, createWebHistory } from "vue-router";

// summary
const SummaryIndex = () => import("@/views/pages/summary/Index.vue");
const SummaryCreate = () => import("@/views/pages/summary/Create.vue");
const SummaryEdit = () => import("@/views/pages/summary/Edit.vue");
const SummaryView = () => import("@/views/pages/summary/View.vue");

// appointments
const AppointmentIndex = () => import("@/views/pages/appointments/Index.vue");
const AppointmentCreate = () => import("@/views/pages/appointments/Create.vue");
const AppointmentEdit = () => import("@/views/pages/appointments/Edit.vue");
const AppointmentView = () => import("@/views/pages/appointments/View.vue");

// admissions
const AdmissionIndex = () => import("@/views/pages/admissions/Index.vue");
const AdmissionCreate = () => import("@/views/pages/admissions/Create.vue");
const AdmissionEdit = () => import("@/views/pages/admissions/Edit.vue");
const AdmissionView = () => import("@/views/pages/admissions/View.vue");

// beds
const BedsIndex = () => import("@/views/pages/beds/Index.vue");
const BedsCreate = () => import("@/views/pages/beds/Create.vue");
const BedsEdit = () => import("@/views/pages/beds/Edit.vue");
const BedsView = () => import("@/views/pages/beds/View.vue");

// bills
const BillsIndex = () => import("@/views/pages/bills/Index.vue");
const BillsCreate = () => import("@/views/pages/bills/Create.vue");
const BillsEdit = () => import("@/views/pages/bills/Edit.vue");
const BillsView = () => import("@/views/pages/bills/View.vue");

// departments
const DepartmentsIndex = () => import("@/views/pages/departments/Index.vue");
const DepartmentsCreate = () => import("@/views/pages/departments/Create.vue");
const DepartmentsEdit = () => import("@/views/pages/departments/Edit.vue");
const DepartmentsView = () => import("@/views/pages/departments/View.vue");

// designations
const DesignationsIndex = () => import("@/views/pages/designations/Index.vue");
const DesignationsCreate = () =>
  import("@/views/pages/designations/Create.vue");
const DesignationsEdit = () => import("@/views/pages/designations/Edit.vue");
const DesignationsView = () => import("@/views/pages/designations/View.vue");

// doctors
const DoctorsIndex = () => import("@/views/pages/doctors/Index.vue");
const DoctorsCreate = () => import("@/views/pages/doctors/Create.vue");
const DoctorsEdit = () => import("@/views/pages/doctors/Edit.vue");
const DoctorsView = () => import("@/views/pages/doctors/View.vue");

// services
const ServicesIndex = () => import("@/views/pages/services/Index.vue");
const ServicesCreate = () => import("@/views/pages/services/Create.vue");
const ServicesEdit = () => import("@/views/pages/services/Edit.vue");
const ServicesView = () => import("@/views/pages/services/View.vue");

// consultants
const ConsultantsIndex = () => import("@/views/pages/consultants/Index.vue");
const ConsultantsCreate = () => import("@/views/pages/consultants/Create.vue");
const ConsultantsEdit = () => import("@/views/pages/consultants/Edit.vue");
const ConsultantsView = () => import("@/views/pages/consultants/View.vue");

// medicines
const MedicinesIndex = () => import("@/views/pages/medicines/Index.vue");
const MedicinesCreate = () => import("@/views/pages/medicines/Create.vue");
const MedicinesEdit = () => import("@/views/pages/medicines/Edit.vue");
const MedicinesView = () => import("@/views/pages/medicines/View.vue");

// medicineTypes
const MedicineTypesIndex = () => import("@/views/pages/medicineTypes/Index.vue");
const MedicineTypesCreate = () => import("@/views/pages/medicineTypes/Create.vue");
const MedicineTypesEdit = () => import("@/views/pages/medicineTypes/Edit.vue");
const MedicineTypesView = () => import("@/views/pages/medicineTypes/View.vue");

// medicineCategories
const MedicineCategoriesIndex = () => import("@/views/pages/medicineCategories/Index.vue");
const MedicineCategoriesCreate = () => import("@/views/pages/medicineCategories/Create.vue");
const MedicineCategoriesEdit = () => import("@/views/pages/medicineCategories/Edit.vue");
const MedicineCategoriesView = () => import("@/views/pages/medicineCategories/View.vue");

// themes
const ThemesIndex = () => import("@/views/pages/themes/Index.vue");
const ThemesCreate = () => import("@/views/pages/themes/Create.vue");

// patients
const PatientsIndex = () => import("@/views/pages/patients/Index.vue");
const PatientsCreate = () => import("@/views/pages/patients/Create.vue");
const PatientsEdit = () => import("@/views/pages/patients/Edit.vue");
const PatientsView = () => import("@/views/pages/patients/View.vue");

// invoices
const InvoicesIndex = () => import("@/views/pages/invoices/Index.vue");
const InvoicesCreate = () => import("@/views/pages/invoices/Create.vue");
const InvoicesEdit = () => import("@/views/pages/invoices/Edit.vue");
const InvoicesView = () => import("@/views/pages/invoices/View.vue");

// money receipts
const MoneyReceiptsIndex = () =>
  import("@/views/pages/moneyReceipts/Index.vue");
const MoneyReceiptsCreate = () =>
  import("@/views/pages/moneyReceipts/Create.vue");
const MoneyReceiptsEdit = () => import("@/views/pages/moneyReceipts/Edit.vue");
const MoneyReceiptsView = () => import("@/views/pages/moneyReceipts/View.vue");

// prescriptions
const PrescriptionsIndex = () =>
  import("@/views/pages/prescriptions/Index.vue");
const PrescriptionsCreate = () =>
  import("@/views/pages/prescriptions/Create.vue");
const PrescriptionsEdit = () => import("@/views/pages/prescriptions/Edit.vue");
const PrescriptionsView = () => import("@/views/pages/prescriptions/View.vue");

// logout
const Logout= ()=> import("@/views/pages/logout/Logout.vue");

const routes = [
  // summary
  {
    path: "/summary",
    name: "SummaryIndex",
    component: SummaryIndex,
  },
  {
    path: "/summary/create",
    name: "SummaryCreate",
    component: SummaryCreate,
  },
  {
    path: "/summary/:id/edit",
    name: "SummaryEdit",
    component: SummaryEdit,
    props: true,
  },
  {
    path: "/summary/:id",
    name: "SummaryView",
    component: SummaryView,
    props: true,
  },

  // Appointments
  {
    path: "/appointments",
    name: "AppointmentIndex",
    component: AppointmentIndex,
  },
  {
    path: "/appointments/create",
    name: "AppointmentCreate",
    component: AppointmentCreate,
  },
  {
    path: "/appointments/:id/edit",
    name: "AppointmentEdit",
    component: AppointmentEdit,
    props: true,
  },
  {
    path: "/appointments/:id",
    name: "AppointmentView",
    component: AppointmentView,
    props: true,
  },

  // Admissions
  { path: "/admissions", name: "AdmissionIndex", component: AdmissionIndex },
  {
    path: "/admissions/create",
    name: "AdmissionCreate",
    component: AdmissionCreate,
  },
  {
    path: "/admissions/:id/edit",
    name: "AdmissionEdit",
    component: AdmissionEdit,
    props: true,
  },
  {
    path: "/admissions/:id",
    name: "AdmissionView",
    component: AdmissionView,
    props: true,
  },

  // Beds
  { path: "/beds", name: "BedsIndex", component: BedsIndex },
  { path: "/beds/create", name: "BedsCreate", component: BedsCreate },
  {
    path: "/beds/:id/edit",
    name: "BedsEdit",
    component: BedsEdit,
    props: true,
  },
  { path: "/beds/:id", name: "BedsView", component: BedsView, props: true },

  // Bills
  { path: "/bills", name: "BillsIndex", component: BillsIndex },
  { path: "/bills/create", name: "BillsCreate", component: BillsCreate },
  {
    path: "/bills/:id/edit",
    name: "BillsEdit",
    component: BillsEdit,
    props: true,
  },
  { path: "/bills/:id", name: "BillsView", component: BillsView, props: true },

  // Departments
  {
    path: "/departments",
    name: "DepartmentsIndex",
    component: DepartmentsIndex,
  },
  {
    path: "/departments/create",
    name: "DepartmentsCreate",
    component: DepartmentsCreate,
  },
  {
    path: "/departments/:id/edit",
    name: "DepartmentsEdit",
    component: DepartmentsEdit,
    props: true,
  },
  {
    path: "/departments/:id",
    name: "DepartmentsView",
    component: DepartmentsView,
    props: true,
  },

  // Designations
  {
    path: "/designations",
    name: "DesignationsIndex",
    component: DesignationsIndex,
  },
  {
    path: "/designations/create",
    name: "DesignationsCreate",
    component: DesignationsCreate,
  },
  {
    path: "/designations/:id/edit",
    name: "DesignationsEdit",
    component: DesignationsEdit,
    props: true,
  },
  {
    path: "/designations/:id",
    name: "DesignationsView",
    component: DesignationsView,
    props: true,
  },

  // Doctors
  { path: "/doctors", name: "DoctorsIndex", component: DoctorsIndex },
  { path: "/doctors/create", name: "DoctorsCreate", component: DoctorsCreate },
  {
    path: "/doctors/:id/edit",
    name: "DoctorsEdit",
    component: DoctorsEdit,
    props: true,
  },
  {
    path: "/doctors/:id",
    name: "DoctorsView",
    component: DoctorsView,
    props: true,
  },

  // Patients
  { path: "/patients", name: "PatientsIndex", component: PatientsIndex },
  {
    path: "/patients/create",
    name: "PatientsCreate",
    component: PatientsCreate,
  },
  {
    path: "/patients/:id/edit",
    name: "PatientsEdit",
    component: PatientsEdit,
    props: true,
  },
  {
    path: "/patients/:id",
    name: "PatientsView",
    component: PatientsView,
    props: true,
  },

  // Invoices
  { path: "/invoices", name: "InvoicesIndex", component: InvoicesIndex },
  {
    path: "/invoices/create",
    name: "InvoicesCreate",
    component: InvoicesCreate,
  },
  {
    path: "/invoices/:id/edit",
    name: "InvoicesEdit",
    component: InvoicesEdit,
    props: true,
  },
  {
    path: "/invoices/:id",
    name: "InvoicesView",
    component: InvoicesView,
    props: true,
  },

  // Money Receipts
  {
    path: "/money-receipts",
    name: "MoneyReceiptsIndex",
    component: MoneyReceiptsIndex,
  },
  {
    path: "/money-receipts/create",
    name: "MoneyReceiptsCreate",
    component: MoneyReceiptsCreate,
  },
  {
    path: "/money-receipts/:id/edit",
    name: "MoneyReceiptsEdit",
    component: MoneyReceiptsEdit,
    props: true,
  },
  {
    path: "/money-receipts/:id",
    name: "MoneyReceiptsView",
    component: MoneyReceiptsView,
    props: true,
  },

  // Services
  {
    path: "/services",
    name: "ServicesIndex",
    component: ServicesIndex,
  },
  {
    path: "/services/create",
    name: "ServicesCreate",
    component: ServicesCreate,
  },
  {
    path: "/services/:id/edit",
    name: "ServicesEdit",
    component: ServicesEdit,
    props: true,
  },
  {
    path: "/services/:id",
    name: "ServicesView",
    component: ServicesView,
    props: true,
  },

  // consultants
  {
    path: "/consultants",
    name: "ConsultantsIndex",
    component: ConsultantsIndex,
  },
  {
    path: "/consultants/create",
    name: "ConsultantsCreate",
    component: ConsultantsCreate,
  },
  {
    path: "/consultants/:id/edit",
    name: "ConsultantsEdit",
    component: ConsultantsEdit,
    props: true,
  },
  {
    path: "/consultants/:id",
    name: "ConsultantsView",
    component: ConsultantsView,
    props: true,
  },

  
  // Medicines
  {
    path: "/medicines",
    name: "MedicinesIndex",
    component: MedicinesIndex,
  },
  {
    path: "/medicines/create",
    name: "MedicinesCreate",
    component: MedicinesCreate,
  },
  {
    path: "/medicines/:id/edit",
    name: "MedicinesEdit",
    component: MedicinesEdit,
    props: true,
  },
  {
    path: "/medicines/:id",
    name: "MedicinesView",
    component: MedicinesView,
    props: true,
  },

  // MedicineTypes
  {
    path: "/medicine-types",
    name: "MedicineTypesIndex",
    component: MedicineTypesIndex,
  },
  {
    path: "/medicine-types/create",
    name: "MedicineTypesCreate",
    component: MedicineTypesCreate,
  },
  {
    path: "/medicine-types/:id/edit",
    name: "MedicineTypesEdit",
    component: MedicineTypesEdit,
    props: true,
  },
  {
    path: "/medicine-types/:id",
    name: "MedicineTypesView",
    component: MedicineTypesView,
    props: true,
  },

  // Prescriptions
  {
    path: "/prescriptions",
    name: "PrescriptionsIndex",
    component: PrescriptionsIndex,
  },
  {
    path: "/prescriptions/create",
    name: "PrescriptionsCreate",
    component: PrescriptionsCreate,
  },
  {
    path: "/prescriptions/:id/edit",
    name: "PrescriptionsEdit",
    component: PrescriptionsEdit,
    props: true,
  },
  {
    path: "/prescriptions/:id",
    name: "PrescriptionsView",
    component: PrescriptionsView,
    props: true,
  },
  
  // MedicineCategories
  {
    path: "/medicine-categories",
    name: "MedicineCategoriesIndex",
    component: MedicineCategoriesIndex,
  },
  {
    path: "/medicine-categories/create",
    name: "MedicineCategoriesCreate",
    component: MedicineCategoriesCreate,
  },
  {
    path: "/medicine-categories/:id/edit",
    name: "MedicineCategoriesEdit",
    component: MedicineCategoriesEdit,
    props: true,
  },
  {
    path: "/medicine-categories/:id",
    name: "MedicineCategoriesView",
    component: MedicineCategoriesView,
    props: true,
  },

  //themes
  {
    path:"/themes",
    name:"Themes",
    component:ThemesIndex,
  },
  {
    path:"/themes/create",
    name:"ThemesCreate",
    component:ThemesCreate,
  },

  //logout
  {
    path:"/logout",
    name:"Logout",
    component:Logout,
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
