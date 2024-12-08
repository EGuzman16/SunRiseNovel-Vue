<script>
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/MainInput.vue';
import MainLabel from '../components/MainLabel.vue';
import { updateUser, subscribeToAuth } from '../services/auth';

export default {
    name: 'MyProfileEdit',
    components: { MainH1, MainLabel, MainInput, MainButton },
    data() {
        return {
            profileData: {
                displayName: null,
                bio: null,
                social: null,
                avatarUrl: null,  
            },
            updatingProfile: false,
            newAvatar: null,  

            userAuth: {
                id: null,
                email: null,
                displayName: null,
                bio: null,
                social: null,
                avatarUrl: null,  
            },
            unsubscribeFromAuth: () => {},
            loadingUser: false,
        };
    },
    methods: {
        async handleSubmit() {
            this.updatingProfile = true;

            let avatarUrl = this.profileData.avatarUrl;
            if (this.newAvatar) {
                const formData = new FormData();
                formData.append('file', this.newAvatar);
                formData.append('upload_preset', 'uploads');  

                try {
                    const response = await fetch('https://api.cloudinary.com/v1_1/dmpf39dni/image/upload', {
                        method: 'POST',
                        body: formData,
                    });

                    if (!response.ok) {
                        throw new Error('Error al subir la imagen');
                    }

                    const data = await response.json();
                    avatarUrl = data.secure_url;
                } catch (error) {
                    console.error('Error al subir la imagen:', error);
                    this.updatingProfile = false;
                    return;
                }
            }

            try {
                await updateUser({
                    displayName: this.profileData.displayName,
                    bio: this.profileData.bio,
                    social: this.profileData.social,
                    avatarUrl: avatarUrl,  
                });

                // Muestra un mensaje de confirmación
                window.alert('Perfil actualizado correctamente');

                // Vuelve a la página anterior
                this.$router.go(-1);
            } catch (error) {
                console.error('Error al actualizar el perfil:', error);
            } finally {
                this.updatingProfile = false;
            }
        },
        handleAvatarUpload(event) {
            const file = event.target.files[0];
            const maxSize = 2 * 1024 * 1024; // 2MB
            const allowedTypes = ['image/jpeg', 'image/png'];

            if (file.size > maxSize) {
                window.alert('El archivo es demasiado grande. El tamaño máximo permitido es 2MB.');
                this.newAvatar = null;
            } else if (!allowedTypes.includes(file.type)) {
                window.alert('Tipo de archivo no permitido. Solo se permiten archivos JPEG y PNG.');
                this.newAvatar = null;
            } else {
                this.newAvatar = file;
            }
        }
    },
    mounted() {
        this.loadingUser = true;
        this.unsubscribeFromAuth = subscribeToAuth(newUserData => {
            this.userAuth = newUserData;
            this.loadingUser = false;

            // Asignar los datos del usuario al formulario
            this.profileData.displayName = this.userAuth.displayName;
            this.profileData.bio = this.userAuth.bio;
            this.profileData.social = this.userAuth.social;
            this.profileData.avatarUrl = this.userAuth.avatarUrl;  
        });
    },
    unmounted() {
        this.unsubscribeFromAuth();
    },
}
</script>

<template>
    <MainH1>Editar Mi Perfil</MainH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-3">
            <MainLabel for="avatar">Avatar</MainLabel>
            <input 
                id="avatar" 
                type="file" 
                @change="handleAvatarUpload" 
                :readonly="updatingProfile"
                class="w-full p-2 border border-gray-500 rounded read-only:bg-gray-200"
            />
            <img 
                :src="profileData.avatarUrl" 
                alt="Avatar" 
                class="w-32 h-32 rounded-full mt-4" 
                v-if="profileData.avatarUrl" 
            />
        </div>
        <div class="mb-3">
            <MainLabel for="bio">Biografía</MainLabel>
            <textarea
                id="bio"
                :readonly="updatingProfile"
                class="w-full p-2 border border-gray-500 rounded read-only:bg-gray-200"
                v-model="profileData.bio"
            ></textarea>
        </div>
        <div class="mb-3">
            <MainLabel for="displayName">Nombre de Usuario</MainLabel>
            <MainInput
                id="displayName"
                :readonly="updatingProfile"
                v-model="profileData.displayName"
            />
        </div>
        <div class="mb-3">
            <MainLabel for="social">Red Social</MainLabel>
            <MainInput
                id="social"
                :readonly="updatingProfile"
                v-model="profileData.social"
            />
        </div>
        <MainButton type="submit">Actualizar</MainButton>
    </form>
</template>