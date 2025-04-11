import Login from '../views/Login.vue';
import Register from '../views/Register.vue';
import Videogame from '../views/Videogame.vue';
import VideogameDetail from '../views/VideogameDetail.vue';
import VideogameStatus from '../views/VideogameStatus.vue';
import { createRouter, createWebHistory } from 'vue-router';


const routes = [
    { path: '/', name: 'Login', component: Login },
    { path: '/register', name: 'Register', component: Register },
    { path: '/videogame', name: 'Videogame', component: Videogame, meta: { requiresAuth: true } },
    { path: '/videogame/:id', name: 'VideogameDetail', component: VideogameDetail, meta: { requiresAuth: true } },
    { path: '/videogame/status/:status', name: 'VideogameStatus', component: VideogameStatus, meta: { requiresAuth: true } },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!localStorage.getItem('token');

    // Verifica si el usuario está autenticado y si lo esta redirige a videogame
    if (to.path === '/' && isAuthenticated) {
        next('/videogame');
        // Si el usuario no está autenticado y la ruta requiere autenticación, redirige a login    
    } else if (to.meta.requiresAuth && !isAuthenticated) {
        next('/');
    } else {
        next();
    }
});

export default router;