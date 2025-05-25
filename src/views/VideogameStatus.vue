<template>
    <div class="container mt-4">
        <h2 class="mb-4 text-center">{{ statusTitle }}</h2>

        <!-- Campo de búsqueda -->
        <div class="mb-4">
            <input type="text" class="form-control bg-light" placeholder="Buscar videojuego por nombre..."
                v-model="searchQuery" />
        </div>

        <!-- Lista de videojuegos -->
        <div class="row">
            <div v-for="game in filteredGames" :key="game.id" class="col-12 mb-4">
                <div class="card d-flex flex-row" @click="goToDetail(game.id)" style="cursor: pointer;">

                    <!-- Botón para eliminar del estado -->
                    <button class="btn btn-danger position-absolute top-0 end-0 m-2"
                        @click.stop="removeFromStatus(game.id)">
                        <i class="bi bi-trash-fill"></i>
                    </button>
                    <!-- Información del videojuego -->
                    <!-- Imagen del videojuego -->
                    <img :src="game.backgroundImage" class="card-img-left border rounded-start"
                        alt="Imagen del videojuego" style="width: 350px; height: 210px; object-fit: cover;" />
                    <!-- Información del videojuego -->
                    <div class="card-body">
                        <h5 class="card-title">{{ game.name }}</h5>
                        <p class="card-text"><strong>Fecha de lanzamiento:</strong> {{ game.released || 'No disponible'
                        }}</p>
                        <p class="card-text"><strong>Plataformas:</strong> {{ game.platforms }}</p>
                        <p class="card-text"><strong>Géneros:</strong> {{ game.genres }}</p>
                        <p class="card-text"><strong>Calificación:</strong> {{ game.rating }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { ref, onMounted, watch, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getFavoriteVideogames, getPlayedVideogames, getToPlayVideogames, deleteUserVideogame } from '../services/videogameService.js';
import { useUserStore } from '../stores/userStore.js';

export default {
    setup() {
        const route = useRoute();
        const router = useRouter();
        const userStore = useUserStore();

        const games = ref([]);
        const statusTitle = ref('');
        const searchQuery = ref(''); // Valor reactivo para el campo de búsqueda

        // Función para obtener los videojuegos según el estado
        const fetchGamesByStatus = async () => {
            try {
                const status = route.params.status; // Obtener el estado desde la ruta
                const userId = userStore.userId;

                if (!userId) {
                    alert('Usuario no autenticado.');
                    router.push('/');
                    return;
                }

                if (!['favorito', 'jugado', 'por jugar'].includes(status)) {
                    console.error('Estado no válido:', status);
                    return;
                }

                // Establecer el título según el estado
                statusTitle.value = {
                    favorito: 'Favoritos',
                    jugado: 'Jugados',
                    'por jugar': 'Por Jugar',
                }[status] || 'Videojuegos';

                // Llamar al servicio correspondiente según el estado
                if (status === 'favorito') {
                    games.value = await getFavoriteVideogames(userId);
                } else if (status === 'jugado') {
                    games.value = await getPlayedVideogames(userId);
                } else if (status === 'por jugar') {
                    games.value = await getToPlayVideogames(userId);
                }
                console.log(games.value);
            } catch (error) {
                console.error('Error al obtener los videojuegos por estado:', error);
                alert('Hubo un error al cargar los videojuegos.');
            }
        };

        // Función para eliminar un videojuego del estado
        const removeFromStatus = async (videogameId) => {
            try {
                const userId = userStore.userId;
                const status = route.params.status;

                // Determinar el ID del estado
                const statusId = {
                    favorito: 1,
                    jugado: 2,
                    'por jugar': 3,
                }[status];

                if (!statusId) {
                    console.error('Estado no válido:', status);
                    return;
                }

                // Llamar al servicio para eliminar el videojuego
                await deleteUserVideogame(userId, videogameId, statusId);

                // Refrescar la lista de videojuegos
                await fetchGamesByStatus();
            } catch (error) {
                console.error('Error al eliminar el videojuego del estado:', error);
                alert('Hubo un error al eliminar el videojuego.');
            }
        };

        // Función para ir a la página de detalles del videojuego
        const goToDetail = (id) => {
            router.push({ name: 'VideogameDetail', params: { id } });
        };

        // Computed para filtrar los videojuegos según el nombre
        const filteredGames = computed(() => {
            return games.value.filter((game) =>
                game.name.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });

        // Llamar a la función al montar el componente
        onMounted(() => {
            fetchGamesByStatus();
        });

        // Observar cambios en el parámetro "status" de la ruta
        watch(() => route.params.status, () => {
            fetchGamesByStatus();
        });

        // Observar el evento de navegación hacia atrás
        watch(() => route.fullPath, () => {
            fetchGamesByStatus();
        });

        return {
            games,
            statusTitle,
            goToDetail,
            removeFromStatus,
            filteredGames,
            searchQuery, // Pasar el valor reactivo al template
        };
    },
};
</script>

<style>
/* Estilos personalizados */
.card {
    transition: transform 0.2s;
}

.card:hover {
    transform: scale(1.02);
}
</style>