import backend from '../config/backend';

// Obtener los videojuegos más populares
export const getLatestGames = async () => {
    try {
        const response = await backend.get('/api/rawg/games');
        return response.data; // Devuelve la lista de videojuegos
    } catch (error) {
        console.error('Error al obtener los videojuegos más populares:', error.response?.data || error.message);
        throw error;
    }
};

// Obtener detalles de un videojuego por ID
export const getGameDetails = async (id) => {
    try {
        if (!id || isNaN(id)) {
            throw new Error('ID del videojuego no válido');
        }

        const response = await backend.get(`/api/rawg/game/details/${id}`);
        return response.data;
    } catch (error) {
        console.error(`Error al obtener los detalles del videojuego con ID ${id}:`, error.response?.data || error.message);
        throw error;
    }
};

// Obtener videojuegos con filtros
export const getGamesWithFilters = async (name, genres, platforms, ratingOrder) => {
    try {
        const response = await backend.get('/api/rawg/games/filtered', {
            params: {
                name,
                genres,
                platforms,
                ratingOrder
            }
        });
        return response.data; // Devuelve la lista de videojuegos filtrados
    } catch (error) {
        console.error('Error al obtener los videojuegos con filtros:', error.response?.data || error.message);
        throw error;
    }
};

// Verificar los estados de un videojuego para un usuario
export const getUserVideogameStatuses = async (userId, videogameId) => {
    try {
        const response = await backend.get('/user-videogames/status', {
            params: { userId, videogameId }
        });
        return response.data; // Devuelve los estados (favorito, jugado, por jugar)
    } catch (error) {
        console.error('Error al verificar los estados del videojuego:', error.response?.data || error.message);
        throw error;
    }
};

// Añadir un videojuego a la lista de un usuario
export const addUserVideogame = async (userId, videogameId, status, videogame) => {
    try {
        // Convierte el objeto reactivo en un objeto plano
        const plainVideogame = JSON.parse(JSON.stringify(videogame));

        console.log('Datos enviados al backend:', {
            userId,
            videogameId,
            status,
            videogame: plainVideogame // Asegúrate de que este objeto esté definido,
        });

        const response = await backend.post('/user-videogames/add', {
            userId,
            videogameId,
            status,
            videogame: plainVideogame, // Enviar el objeto completo en el cuerpo
        });
        return response.data;
    } catch (error) {
        console.error('Error al añadir el videojuego a la lista del usuario:', error);
        throw error;
    }
};

// Eliminar un videojuego de la lista de un usuario
export const deleteUserVideogame = async (userId, videogameId, statusId) => {
    try {
        await backend.delete('/user-videogames/delete', {
            params: { userId, videogameId, statusId }
        });
    } catch (error) {
        console.error('Error al eliminar el videojuego de la lista del usuario:', error.response?.data || error.message);
        throw error;
    }
};

// Obtener videojuegos favoritos de un usuario
export const getFavoriteVideogames = async (userId) => {
    try {
        const response = await backend.get('/user-videogames/favorites', {
            params: { userId }
        });
        return response.data; // Devuelve la lista de videojuegos favoritos
    } catch (error) {
        console.error('Error al obtener los videojuegos favoritos:', error.response?.data || error.message);
        throw error;
    }
};

// Obtener videojuegos jugados de un usuario
export const getPlayedVideogames = async (userId) => {
    try {
        const response = await backend.get('/user-videogames/played', {
            params: { userId }
        });
        return response.data; // Devuelve la lista de videojuegos jugados
    } catch (error) {
        console.error('Error al obtener los videojuegos jugados:', error.response?.data || error.message);
        throw error;
    }
};

// Obtener videojuegos por jugar de un usuario
export const getToPlayVideogames = async (userId) => {
    try {
        const response = await backend.get('/user-videogames/to-play', {
            params: { userId }
        });
        return response.data; // Devuelve la lista de videojuegos por jugar
    } catch (error) {
        console.error('Error al obtener los videojuegos por jugar:', error.response?.data || error.message);
        throw error;
    }
};