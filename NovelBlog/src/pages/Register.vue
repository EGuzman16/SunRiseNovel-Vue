<script>
import MainButton from '../components/MainButton.vue';
import MainH1 from '../components/MainH1.vue';
import MainInput from '../components/MainInput.vue';
import MainLabel from '../components/MainLabel.vue';
import { register } from '../services/auth';

export default {
    name: "Register",
    components: { MainH1, MainLabel, MainButton, MainInput },
    data() {
        return {
            user: {
                email: '',
                password: '',
                role: 'common', 
                avatarUrl: '', 
            },
            newAvatar: null,  
            loading: false,
        };
    },
    methods: {
        async handleSubmit() {
            this.loading = true;

            let avatarUrl = '';
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
                    this.loading = false;
                    return;
                }
            }

            await register(this.user.email, this.user.password, this.user.role, avatarUrl);
            this.$router.push({
                path: '/perfil'
            });
            
            this.loading = false;
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
    }
}
</script>

<template>
    <MainH1>Crear una Cuenta</MainH1>

    <form 
        action="#"
        @submit.prevent="handleSubmit"
    >
        <div class="mb-3">
            <MainLabel for="email">Email</MainLabel>
            <MainInput
                type="email"
                id="email"
                v-model="user.email"
            />
        </div>
        <div class="mb-3">
            <MainLabel for="password">Contraseña</MainLabel>
            <MainInput
                type="password"
                id="password"
                v-model="user.password"
            />
        </div>
        <div class="mb-3">
            <MainLabel for="avatar">Avatar</MainLabel>
            <input 
                id="avatar" 
                type="file" 
                @change="handleAvatarUpload" 
                class="w-full p-2 border border-gray-500 rounded"
            />
        </div>
        <MainButton
            type="submit"
            :disabled="loading"
        >Crear Cuenta</MainButton>
    </form>
</template>