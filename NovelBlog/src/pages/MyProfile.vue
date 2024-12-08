<script>
import Loader from '../components/Loader.vue';
import MainH1 from '../components/MainH1.vue';
import UserProfileData from '../components/UserProfileData.vue';
import { subscribeToAuth } from '../services/auth';

export default {
    name: 'MyProfile',
    components: { MainH1, Loader, UserProfileData },
    data() {
        return {
            authUser: {
                id: null,
                email: null,
                displayName: null,
                bio: null,
                social: null,
                avatarUrl: null,  
                fullProfileLoaded: false,
            },
            unsubscribeFromAuth: () => {},
            loadingUser: false,
        }
    },
    mounted() {
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => {
            this.authUser = newUserData;
            this.authUser.fullProfileLoaded = true;
        });
    },
    unmounted() {
        this.unsubscribeFromAuth();
    }
}
</script>

<template>
    <section v-if="authUser.fullProfileLoaded" class="flex justify-center items-center min-h-screen">
        <div class="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
            <div class="text-center mb-4">
                <MainH1>Mi Perfil</MainH1>
                <router-link to="/perfil/editar" class="text-blue-700 underline">Editar</router-link>
            </div>
            <div class="mb-4 text-center">
                <img 
                    :src="authUser.avatarUrl" 
                    alt="Avatar" 
                    class="w-60 h-60 rounded-full mx-auto" 
                    v-if="authUser.avatarUrl" 
                />
            </div>
            <div class="text-left">
                <UserProfileData :user="authUser" />
            </div>
        </div>
    </section>
    <Loader v-else />
</template>