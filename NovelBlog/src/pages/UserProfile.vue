<script>
import Loader from '../components/Loader.vue';
import MainH1 from '../components/MainH1.vue';
import UserProfileData from '../components/UserProfileData.vue';
import { getUserProfileById } from '../services/user-profile';

export default {
    name: 'UserProfile',
    components: { MainH1, Loader, UserProfileData },
    data() {
        return {
            user: {
                id: null,
                email: null,
                displayName: null,
                bio: null,
                career: null,            
            },
            loadingUser: false,
        }
    },
    async mounted() {
        this.loadingUser = true;
        this.user = await getUserProfileById(this.$route.params.id);
        this.loadingUser = false;
    }
}
</script>

<template>
    <Loader v-if="loadingUser" />
    <template v-else>
        <MainH1>Perfil de {{ user.email }}</MainH1>

        <UserProfileData :user="user" />

        <hr class="mb-4">

        <router-link 
            class="text-blue-600 underline"
            :to="`/usuario/${user.id}/chat`"
        >Chatear con {{ user.email }}</router-link>
    </template>
</template>