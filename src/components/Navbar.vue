<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
    <div class="container-fluid">
      <router-link class="navbar-brand" to="/videogame">GameFavs</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav"
        aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto">
          <!-- Aquí puedes agregar otros elementos del menú si es necesario -->
        </ul>
        <ul class="navbar-nav ms-auto">
          <li class="nav-item me-3">
            <router-link class="nav-link"
              :to="{ name: 'VideogameStatus', params: { status: 'favorito' } }">Favoritos</router-link>
          </li>
          <li class="nav-item me-3">
            <router-link class="nav-link"
              :to="{ name: 'VideogameStatus', params: { status: 'jugado' } }">Jugados</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link me-5" :to="{ name: 'VideogameStatus', params: { status: 'por jugar' } }">Por
              Jugar</router-link>
          </li>
          <li class="nav-item">
            <button class="btn btn-outline-danger" @click="logout">Logout</button>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script>
import router from '../router/index.js'
import { useUserStore } from '../stores/userStore.js'

export default {
  setup() {

    // Eliminar el token de localStorage y redirigir a la página de inicio de sesión
    const logout = () => {
      localStorage.removeItem('token')
      useUserStore().$reset()
      router.push('/')
      console.log('Logout successful')
    }
    return {
      logout
    }
  }
};

</script>

<style>
/* Estilos personalizados para el Navbar */
.navbar {
  margin-bottom: 20px;
}
</style>