<script setup>
import Footer from './views/layouts/footer.vue';
import LeftSidebar from './views/layouts/LeftSidebar.vue';
import Modal from './views/layouts/Modal.vue';
import RightSidebar from './views/layouts/RightSidebar.vue';
import Topbar from './views/layouts/Topbar.vue';
</script>

<template>
  <LeftSidebar/>
  <div class="content">
    <Topbar/>
    <router-view></router-view>
    <Footer/>
  </div>
  <Modal/>
  <RightSidebar/>
  
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
