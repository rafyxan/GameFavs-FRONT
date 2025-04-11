import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getUserInfo } from './services/UserService'
import { createPinia } from 'pinia'


const app = createApp(App)
app.use(ElementPlus)

const pinia = createPinia()
app.use(pinia)

async function init() {
    // Checkear Token
    const token = localStorage.getItem('token');

    if (token) {
        try {
            await getUserInfo()
            console.log('Informacion del usuario cargada');
        } catch (error) {
            console.error('jwt malformed', error);            
            localStorage.removeItem('token')    
        }
    }

    app.use(router)
    app.mount('#app')
}

init()
