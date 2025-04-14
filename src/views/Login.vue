<template>
  <div class="login-background d-flex justify-content-center align-items-center">
    <div class="login-container p-4 rounded shadow bg-white">
      <h2 class="text-center mb-4">Iniciar Sesión</h2>
      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label for="username" class="form-label">Usuario</label>
          <input type="text" id="username" v-model="username" class="form-control" placeholder="Ingresa tu usuario"
            required />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label">Contraseña</label>
          <input type="password" id="password" v-model="password" class="form-control"
            placeholder="Ingresa tu contraseña" required />
        </div>
        <div class="d-flex justify-content-between">
          <button type="submit" class="btn btn-primary w-100 text-center me-2">LOGIN</button>
          <button type="button" class="btn btn-secondary w-100 text-center" @click="goToRegister">
            REGISTRARSE
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { loginUser } from '../services/UserService'

export default {
  setup() {
    const username = ref('')
    const password = ref('')
    const router = useRouter()

    // Function mara manejar el login
    const handleLogin = async () => {
      try {
        console.log(username.value, password.value)
        const userInfo = await loginUser(username.value, password.value)
        console.log(userInfo)

        // Redirigir a la página principal después de iniciar sesión
        router.push('/videogame')
      } catch (error) {
        console.error('Error al iniciar sesión:', error)
        alert('Error al iniciar sesión. Por favor, verifica tus credenciales.')
      }
    }

    // Function para redirigir a la página de registro
    const goToRegister = () => {
      router.push('/register')
    }

    return {
      username,
      password,
      handleLogin,
      goToRegister
    }
  }
}
</script>

<style>
/* Estilo para el fondo del login */
.login-background {
  background-image: url('/videogames-background.png');
  /* Ruta de la imagen */
  background-size: 130% 100%;
  /* Aumenta el tamaño de la imagen para que esté más "zoomeada" */
  background-repeat: repeat-x;
  /* Repite la imagen horizontalmente */
  background-position: 0 50%;
  /* Inicia desde la izquierda y centra verticalmente */
  height: 100vh;
  /* Ocupa toda la altura de la pantalla */
  width: 100%;
  /* Ocupa todo el ancho de la pantalla */
  animation: moveBackground 20s linear infinite alternate;
  /* Aplica la animación bidireccional */
}

/* Animación para mover el fondo de izquierda a derecha y luego de derecha a izquierda */
@keyframes moveBackground {
  0% {
    background-position: 0 50%;
    /* Comienza desde la izquierda */
  }

  100% {
    background-position: 100% 50%;
    /* Termina en la derecha */
  }
}
</style>