<template>
  <footer class="footer">
    <div class="row g-0 justify-content-between fs--1 mt-4 mb-3">
      <div class="col-12 col-sm-auto text-center">
        <p class="mb-0 text-600">
        Built with care by
        <a href="http://leonaiyem.onrender.com" target="_blank"> LeoNaiyem </a><br class="d-sm-none" />
        &copy; {{ currentYear }} LeoNaiyem. All rights reserved.
      </p>
      </div>
      <div class="col-12 col-sm-auto text-center">
        <p class="mb-0 text-600">v3.14.0</p>
      </div>
    </div>
  </footer>
</template>
<script setup>
const currentYear = new Date().getFullYear();
</script>
