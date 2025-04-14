<template>
  <div class="container mt-4">

    <!-- Buscador y botón -->
    <div class="row mb-3">
      <div class="col-md-10">
        <input type="text" v-model="searchQuery" class="form-control" placeholder="Buscar videojuegos..." />
      </div>
      <div class="col-md-2">
        <button class="btn btn-primary w-100" @click="applyFilters">
          <i class="bi bi-search"></i> <!-- Ícono de búsqueda -->
        </button>
      </div>
    </div>

    <!-- Filtros -->
    <div class="row mb-4">
      <div class="col-md-4">
        <select v-model="selectedGenre" class="form-select">
          <option value="">Géneros</option>
          <option value="4">Acción</option>
          <option value="5">RPG</option>
          <option value="3">Aventura</option>
          <option value="51">Indie</option>
          <option value="11">Arcade</option>
          <option value="2">Shooter</option>
          <option value="7">Puzzle</option>
          <option value="40">Casual</option>
          <option value="6">Pelea</option>
          <option value="1">Carreras</option>
          <option value="14">Simulación</option>
          <option value="10">Estrategia</option>
          <option value="15">Deportes</option>
          <option value="83">Plataformas</option>
          <option value="59">Multijugador masivo</option>
          <option value="19">Family</option>
        </select>
      </div>
      <div class="col-md-4">
        <select v-model="selectedPlatform" class="form-select">
          <option value="">Plataformas</option>
          <option value="4">PC</option>
          <option value="5">macOS</option>
          <option value="6">Linux</option>
          <option value="187">PlayStation 5</option>
          <option value="18">PlayStation 4</option>
          <option value="16">PlayStation 3</option>
          <option value="15">PlayStation 2</option>
          <option value="27">PlayStation 1</option>
          <option value="19">PS Vita</option>
          <option value="17">PSP</option>
          <option value="186">Xbox Series S/X</option>
          <option value="1">Xbox One</option>
          <option value="14">Xbox 360</option>
          <option value="80">Xbox</option>
          <option value="7">Nintendo Switch</option>
          <option value="9">Nintendo DS</option>
          <option value="8">Nintendo 3DS</option>
          <option value="83">Nintendo 64</option>
          <option value="11">Wii</option>
          <option value="10">Wii U</option>
          <option value="21">Android</option>
          <option value="3">iOS</option>
          <option value="105">GameCube</option>
          <option value="26">Game Boy</option>
          <option value="49">NES</option>
        </select>
      </div>
      <div class="col-md-4">
        <select v-model="selectedRatingOrder" class="form-select">
          <option value="">Calificación</option>
          <option value="-rating">Ascendente</option>
          <option value="rating">Descendente</option>
        </select>
      </div>
    </div>

    <!-- Lista de videojuegos -->
    <div class="row">
      <div v-for="game in paginatedGames" :key="game.id" class="col-12 mb-4">
        <div class="card d-flex flex-row" @click="goToDetail(game.id)" style="cursor: pointer;">
          <!-- Imagen del videojuego -->
          <img :src="game.backgroundImage" class="card-img-left border rounded-start" alt="Imagen del videojuego"
            style="width: 350px; height: 210px; object-fit: cover;" />
          <!-- Información del videojuego -->
          <div class="card-body">
            <h5 class="card-title">{{ game.name }}</h5>
            <p class="card-text"><strong>Fecha de lanzamiento:</strong> {{ game.released || 'No disponible' }}</p>
            <p class="card-text"><strong>Plataformas:</strong> {{ game.platforms }}</p>
            <p class="card-text"><strong>Géneros:</strong> {{ game.genres }}</p>
            <p class="card-text"><strong>Calificación:</strong> {{ game.rating }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Paginación -->
    <nav aria-label="Page navigation" class="mt-4">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="prevPage">Anterior</button>
        </li>
        <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
          <button class="page-link" @click="goToPage(page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="nextPage">Siguiente</button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { ref, onMounted, computed } from 'vue';
import { getLatestGames, getGamesWithFilters } from '../services/VideogameService.js';
import { useRouter } from 'vue-router';

export default {
  setup() {
    const router = useRouter();
    const games = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = 7; // Número de juegos por página

    // Filtros
    const searchQuery = ref('');
    const selectedGenre = ref('');
    const selectedPlatform = ref('');
    const selectedRatingOrder = ref('');

    // Función para obtener los videojuegos mejor valorados y tenerlo como default
    const fetchGames = async () => {
      try {
        games.value = await getLatestGames();
      } catch (error) {
        console.error('Error al obtener los videojuegos más populares:', error);
        alert('Hubo un error al cargar los videojuegos.');
      }
    };

    // Función para aplicar los filtros de busqueda
    const applyFilters = async () => {
      console.log('Aplicando filtros:', {
        name: searchQuery.value,
        genres: selectedGenre.value,
        platforms: selectedPlatform.value,
        ratingOrder: selectedRatingOrder.value,
      });
      try {
        const name = searchQuery.value;
        const genres = selectedGenre.value;
        const platforms = selectedPlatform.value;
        const ratingOrder = selectedRatingOrder.value;

        games.value = await getGamesWithFilters(name, genres, platforms, ratingOrder);
        currentPage.value = 1; // Reinicia a la primera página
      } catch (error) {
        console.error('Error al aplicar los filtros:', error);
        alert('Hubo un error al aplicar los filtros.');
      }
    };

    // Función para ir a la página de detalles del videojuego
    const goToDetail = (id) => {
      router.push({ name: 'VideogameDetail', params: { id } });
    };

    // Calcular los juegos que se mostrarán en la página actual
    const paginatedGames = computed(() => {
      const start = (currentPage.value - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      return games.value.slice(start, end);
    });

    // Calcular el número total de páginas
    const totalPages = computed(() => {
      return Math.ceil(games.value.length / itemsPerPage);
    });

    // Ir a la página anterior
    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        scrollToTop();
      }
    };

    // Ir a la página siguiente
    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        scrollToTop();
      }
    };

    // Ir a una página específica
    const goToPage = (page) => {
      currentPage.value = page;
      scrollToTop();
    };

    // Función para desplazarse al inicio
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    };

    onMounted(() => {
      fetchGames();
    });

    return {
      games,
      currentPage,
      paginatedGames,
      totalPages,
      prevPage,
      nextPage,
      goToPage,
      searchQuery,
      selectedGenre,
      selectedPlatform,
      applyFilters,
      selectedRatingOrder,
      goToDetail,
    };
  },
};
</script>

<style>
.pagination .page-item.active .page-link {
  background-color: #007bff;
  color: white;
  border-color: #007bff;
}

.pagination .page-item.disabled .page-link {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
  border-color: #dee2e6;
}
</style>