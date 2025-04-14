import backend from '../config/backend';
import { useUserStore } from '../stores/userStore'; // Import the user store

// Inicia sesión y obtiene el token de autenticación
export const loginUser = async (username, password) => {
  try {
    const response = await backend.post(`/users/login`, null, {
      params: {
        username,
        password,
      },
    });

    console.log('token', response.data.token); // Log the token for debugging
    localStorage.setItem('token', response.data.token); // Store the token in local storage
    const userInfo = await getUserInfo(); // Fetch user info after login
    return userInfo; // Return user information
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Cierra sesión y elimina el token de autenticación
export const getUserInfo = async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('Token no disponible');
  }

  try {
    const response = await backend.get('/users/me', {
      params: { token }, // Envía el token como parámetro de consulta
    });

    const { isValid, userId } = response.data;

    if (!isValid || !userId) {
      throw new Error('Token inválido o usuario no encontrado');
    }

    const userStore = useUserStore(); // Importa el store de usuario
    userStore.setUserId(userId); // Establece el userId en el store
    console.log("ID del usuario:", userId); // Log para depuración

    return { isValid, userId }; // Devuelve la información del usuario
  } catch (error) {
    console.error('Error al obtener la información del usuario:', error);
    throw error;
  }
};

// Registra un nuevo usuario
export const registerUser = async (email, username, password) => {
  try {
    const response = await backend.post('/users/register', {
      email,
      username,
      password,
    });
    console.log("Usuario creado correctamente");
    return response.data; // Devuelve la respuesta del backend
  } catch (error) {
    console.error('Error al registrar el usuario:', error.response?.data || error.message);
    throw error; // Lanza el error para manejarlo en el componente
  }
};
