<template>
  <div id="app">
    <!-- Mostrar el Navbar solo si no estamos en "/" o "/register" -->
    <MainNavbar v-if="!isLoginOrRegisterRoute" />
    <router-view />
  </div>
</template>


<script>
import MainNavbar from './components/Navbar.vue'
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  components: {
    MainNavbar,
  },
  setup() {
    const route = useRoute();

    // Computed para verificar si la ruta actual es "/" o "/register"
    const isLoginOrRegisterRoute = computed(() => route.path === '/' || route.path === '/register');

    return {
      isLoginOrRegisterRoute,
    };
  },
};
</script>

<style></style>
