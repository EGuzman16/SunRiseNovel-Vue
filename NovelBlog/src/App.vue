<script>
import Home from './pages/Home.vue';
import { logout, subscribeToAuth } from './services/auth';

export default {
    name: 'App',
    components: { Home },
    data() {
        return {
            authUser: {
                id: null,
                email: null,
                avatarUrl: null, 
            },
            isMenuOpen: false,  
        };
    },
    methods: {
        handleLogout() {
            logout();    
            this.$router.push({
                // Que cuando cierre me lleve a login
                path: '/iniciar-sesion'
            });
        },
        toggleMenu() {
            this.isMenuOpen = !this.isMenuOpen;
        },
        closeMenu() {
            this.isMenuOpen = false;
        }
    },
    mounted() {
        subscribeToAuth(newUserData => this.authUser = newUserData);
    }
}
</script> 

<template>
    <div class="grid grid-rows-layout h-full">
        <nav class="flex justify-between items-center p-4 bg-violet-700 text-gray-50">
            <div class="flex items-center">
                <img src="/img/logo.png" alt="Logo" class="w-10 h-10 mr-2" />
                <p class="text-2xl"><a href="#">SunriseNovel Social</a></p>
            </div>
            <div class="md:hidden">
                <button @click="toggleMenu" class="text-gray-50 focus:outline-none">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </div>
            <ul :class="{'block': isMenuOpen, 'hidden': !isMenuOpen}" class="md:flex gap-4 md:gap-4 md:flex-row flex-col absolute md:static top-16 left-0 w-full md:w-auto bg-violet-700 md:bg-transparent p-4 md:p-0">
                <li class="mb-4 md:mb-0 mt-4 md:mt-0"><router-link @click.native="closeMenu" to="/">Inicio</router-link></li>
                <template v-if="authUser.id === null">
                    <li class="mb-4 md:mb-0 mt-4 md:mt-0"><router-link @click.native="closeMenu" to="/blog">Blog</router-link></li>
                    <li class="mb-4 md:mb-0 mt-4 md:mt-0"><router-link @click.native="closeMenu" to="/recommendations">Recomendaciones</router-link></li>
                    <li class="mb-4 md:mb-0 mt-4 md:mt-0"><router-link @click.native="closeMenu" to="/iniciar-sesion">Iniciar Sesión</router-link></li>
                    <li class="mb-4 md:mb-0 mt-4 md:mt-0"><router-link @click.native="closeMenu" to="/registro">Registrarse</router-link></li>
                </template>
                <template v-else>
                    <li class="mb-4 md:mb-0 mt-4 md:mt-0"><router-link @click.native="closeMenu" to="/blog">Blog</router-link></li>
                    <li class="mb-4 md:mb-0 mt-4 md:mt-0"><router-link @click.native="closeMenu" to="/recommendations">Recomendaciones</router-link></li>
                    <li class="mb-4 md:mb-0 mt-4 md:mt-0"><router-link @click.native="closeMenu" to="/chat">Chat global</router-link></li>
                    <li class="mb-4 md:mb-0 mt-4 md:mt-0">
                        <router-link @click.native="closeMenu" to="/perfil" class="flex items-center">
                            <div class="w-8 h-8 rounded-full overflow-hidden">
                                <img 
                                    v-if="authUser.avatarUrl" 
                                    :src="authUser.avatarUrl" 
                                    alt="Avatar" 
                                    class="w-full h-full object-cover" 
                                />
                                <svg v-else class="w-full h-full text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                                </svg>
                            </div>
                        </router-link>
                    </li>
                    <li class="mb-4 md:mb-0 mt-4 md:mt-0">
                        <form 
                            action="#"
                            @submit.prevent="handleLogout"
                        >
                            <button @click="closeMenu">{{ authUser.email }} (Cerrar Sesión)</button>
                        </form>
                    </li>
                </template>
                <li class="md:hidden">
                    <button @click="closeMenu" class="text-gray-50 focus:outline-none">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </li>
            </ul>
        </nav>
        <main class="container p-4 mx-auto">
            <router-view />
        </main>

        <footer class="flex justify-center items-center h-[100px] bg-purple-900 text-gray-50">
            <p>Copyright &copy; Elizabeth Guzman 2024</p>
        </footer>
    </div>
</template>