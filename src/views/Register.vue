<template>
  <div class="login-background d-flex justify-content-center align-items-center">
    <div class="login-container p-4 rounded shadow bg-white">
      <h2 class="text-center mb-4">Registrarse</h2>
      <form @submit.prevent="handleRegister">
        <div class="mb-3">
          <label for="email" class="form-label">Correo Electrónico</label>
          <input type="email" id="email" v-model="email" class="form-control"
            placeholder="Ingresa tu correo electrónico" required />
        </div>
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
        <div class="mb-3">
          <label for="confirmPassword" class="form-label">Repetir Contraseña</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" class="form-control"
            placeholder="Repita tu contraseña" required />
        </div>
        <div class="d-flex justify-content-between">
          <button type="submit" class="btn btn-success w-100 text-center me-2">CREAR CUENTA</button>
          <button type="button" class="btn btn-danger w-100 text-center" @click="cancel">
            CANCELAR
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'
import { ref } from 'vue'
import { registerUser } from '../services/UserService'

export default {
  setup() {
    const router = useRouter();
    const email = ref('');
    const username = ref('');
    const password = ref('');
    const confirmPassword = ref('');


    const handleRegister = async () => {
      if (password.value !== confirmPassword.value) {
        alert('Las contraseñas no coinciden');
        return;
      }

      try {
        await registerUser(email.value, username.value, password.value);
        router.push('/'); // Redirige al login después del registro
      } catch (error) {
        const errorMessage = error.response?.data || 'Error al registrar el usuario';
        alert(errorMessage);
      }
    };
    const cancel = () => {
      router.push('/'); // Redirige al login
    };
    return {
      cancel,
      email,
      username,
      password,
      confirmPassword,
      handleRegister
    }
  }

};
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

/* Ajusta el ancho del contenedor de registro */
.login-container {
  max-width: 600px;
  /* Cambia este valor para ajustar el ancho */
  width: 100%;
  /* Asegura que el contenedor sea responsivo */
}
</style>