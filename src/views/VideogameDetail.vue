<template>
  <div class="container mt-4">
    <!-- Caja con fondo gris claro -->
    <div class="detail-box p-4 rounded mb-4 shadow">
      <h1 class="text-center mb-4">{{ game.name }}</h1>
      <div class="row">
        <!-- Información del videojuego -->
        <div class="col-md-6">
          <p><strong>Fecha de lanzamiento:</strong> {{ game.released || 'No disponible' }}</p>
          <p><strong>Plataformas:</strong> {{ game.platforms || 'No disponible' }}</p>
          <p><strong>Géneros:</strong> {{ game.genres || 'No disponible' }}</p>
          <p><strong>Desarrollador:</strong> {{ game.developer || 'No disponible' }}</p>
          <p><strong>Calificación:</strong> {{ game.rating || 'No disponible' }}</p>
          <p>
            <strong>Sitio web: </strong>
            <a v-if="game.website" :href="game.website" target="_blank" rel="noopener noreferrer">
              {{ game.website }}
            </a>
            <span v-else>No disponible</span>
          </p>
        </div>

        <!-- Imagen del videojuego -->
        <div class="col-md-6 text-center">
          <img :src="game.backgroundImage" class="img-fluid rounded" alt="Imagen del videojuego" />
          <!-- Botones debajo de la imagen -->
          <div class="mt-3">
            <button class="btn btn-danger me-2" @click="toggleStatus(1)"
              :title="isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'">
              <i :class="isFavorite ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
            </button>
            <button class="btn btn-success me-2" @click="toggleStatus(2)"
              :title="isPlayed ? 'Eliminar de jugados' : 'Añadir a jugados'">
              <i :class="isPlayed ? 'bi bi-star-fill' : 'bi bi-star'"></i>
            </button>
            <button class="btn btn-primary" @click="toggleStatus(3)"
              :title="isPlayLater ? 'Eliminar de por jugar' : 'Añadir a por jugar'">
              <i :class="isPlayLater ? 'bi bi-clock-fill' : 'bi bi-clock'"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Descripción -->
      <div class="row mt-4">
        <div class="col-12">
          <h3>Descripción</h3>
          <p v-html="sanitizedDescription"></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { getGameDetails, getUserVideogameStatuses, addUserVideogame, deleteUserVideogame } from '../services/VideogameService'; // Asegúrate de que la ruta sea correcta
import DOMPurify from 'dompurify'; // Asegúrate de instalar dompurify si no lo has hecho
import { useUserStore } from '../stores/userStore';

export default {
  setup() {
    const route = useRoute();
    const game = ref({});
    const isFavorite = ref(false);
    const isPlayed = ref(false);
    const isPlayLater = ref(false);
    const userStore = useUserStore(); // Usar el store de usuario para obtener el ID del usuario

    // Verificar si el userId está disponible
    const getUserId = () => {
      if (!userStore.userId) {
        throw new Error('El ID del usuario no está disponible. Asegúrate de que el usuario haya iniciado sesión.');
      }
      return userStore.userId;
    };

    const userId = getUserId(); // Obtener el ID del usuario desde el store

    // Obtener detalles del videojuego desde la API mediante el ID del videojuego
    const fetchGameDetails = async () => {
      try {
        const id = route.params.id;

        if (!id || isNaN(id)) {
          console.error('ID del videojuego no válido:', id);
          return;
        }

        const gameDetails = await getGameDetails(id);
        game.value = gameDetails;
      } catch (error) {
        console.error('Error al obtener los detalles del videojuego:', error);
        alert('Hubo un error al cargar los detalles del videojuego.');
      }
    };

    // Verificar los estados del videojuego (favorito, jugado, por jugar)
    const checkStatuses = async (videogameId) => {
      try {
        const response = await getUserVideogameStatuses(userId, videogameId);
        isFavorite.value = response.favorite || false;
        isPlayed.value = response.played || false;
        isPlayLater.value = response.playLater || false;
      } catch (error) {
        console.error('Error al verificar los estados:', error);
      }
    };


    // Alternar el estado del videojuego (añadir o eliminar)
    const toggleStatus = async (statusId) => {
      try {
        const videogameId = game.value.id;

        // Si el estado es "Jugado" (2) o "Por jugar" (3), desactiva el otro
        if (statusId === 2 && isPlayLater.value) {
          // Si se activa "Jugado", desactiva "Por jugar"
          await deleteUserVideogame(userId, videogameId, 3);
          isPlayLater.value = false;
        } else if (statusId === 3 && isPlayed.value) {
          // Si se activa "Por jugar", desactiva "Jugado"
          await deleteUserVideogame(userId, videogameId, 2);
          isPlayed.value = false;
        }


        const currentStatus = {
          1: isFavorite,
          2: isPlayed,
          3: isPlayLater,
        }[statusId];

        if (currentStatus.value) {
          // Eliminar de la base de datos
          await deleteUserVideogame(userId, videogameId, statusId);
          currentStatus.value = false;
        } else {
          // Añadir a la base de datos
          await addUserVideogame(userId, videogameId, statusId, game.value);
          currentStatus.value = true;
        }
      } catch (error) {
        console.error(`Error al cambiar el estado con ID ${statusId}:`, error);
      }
    };

    // Función para sanitizar la descripción en HTML
    const sanitizedDescription = computed(() => {
      return game.value.description ? DOMPurify.sanitize(game.value.description) : 'No disponible';
    });

    onMounted(async () => {
      try {
        await fetchGameDetails(); // Cargar los detalles del videojuego
        await checkStatuses(route.params.id); // Verificar los estados del videojuego
      } catch (error) {
        console.error('Error al cargar los detalles o los estados del videojuego:', error);
      }
    });

    return {
      game,
      sanitizedDescription,
      isFavorite,
      isPlayed,
      isPlayLater,
      toggleStatus,
    };
  },
};
</script>

<style>
.img-fluid {
  max-height: 400px;
  object-fit: cover;
}

.detail-box {
  background-color: #ebeef0;
  /* Gris claro */
  border: 1px solid #dee2e6;
  /* Borde gris */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  /* Sombra ligera */
}
</style>