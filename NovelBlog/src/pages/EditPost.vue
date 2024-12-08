<script>
import { getPost, updatePost } from '../services/blog';

export default {
    data() {
        return {
            id: this.$route.params.id,
            title: '',
            imageUrl: '',
            text: '',
            newImage: null,
            loading: false,
            errorMessage: '',
        };
    },
    async created() {
        const post = await getPost(this.id);
        this.title = post.title;
        this.imageUrl = post.imageUrl;
        this.text = post.text;
    },
    methods: {
        async submitForm() {
            this.loading = true;
            this.errorMessage = '';

            let imageUrl = this.imageUrl;
            if (this.newImage) {
                const formData = new FormData();
                formData.append('file', this.newImage);
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
                    imageUrl = data.secure_url;
                } catch (error) {
                    console.error('Error al subir la imagen:', error);
                    this.errorMessage = 'Error al subir la imagen. Inténtalo de nuevo.';
                    this.loading = false;
                    return;
                }
            }

            const updatedPost = {
                title: this.title,
                imageUrl: imageUrl,
                text: this.text,
            };

            try {
                await updatePost(this.id, updatedPost);
                this.$router.push('/blog');
            } catch (error) {
                console.error('Error al actualizar el post:', error);
                this.errorMessage = 'Error al actualizar el post. Inténtalo de nuevo.';
            } finally {
                this.loading = false;
            }
        },
        handleImageUpload(event) {
            const file = event.target.files[0];
            const maxSize = 2 * 1024 * 1024; // 2MB
            const allowedTypes = ['image/jpeg', 'image/png'];

            if (file.size > maxSize) {
                this.errorMessage = 'El archivo es demasiado grande. El tamaño máximo permitido es 2MB.';
                this.newImage = null;
            } else if (!allowedTypes.includes(file.type)) {
                this.errorMessage = 'Tipo de archivo no permitido. Solo se permiten archivos JPEG y PNG.';
                this.newImage = null;
            } else {
                this.errorMessage = '';
                this.newImage = file;
            }
        }
    }
};
</script>

<template>
    <div class="container mx-auto px-4 ">
        <h1 class="text-2xl font-bold mb-4 text-center text-violet-950">Editar Publicación</h1>

        <form @submit.prevent="submitForm">
            <div class="mb-4">
                <label for="title" class="block mb-2">Título de la publicación</label>
                <input id="title" v-model="title" type="text" class="w-full px-3 py-2 border rounded">
            </div>

            <div class="mb-4">
                <label for="image" class="block mb-2">Imagen</label>
                <input id="image" type="file" @change="handleImageUpload" class="w-full px-3 py-2 border rounded">
                <p v-if="errorMessage" class="text-red-500">{{ errorMessage }}</p>
                <img :src="imageUrl" alt="Imagen de la publicación" class="w-32 h-32 object-cover mt-4" v-if="imageUrl" />
            </div>

            <div class="mb-4">
                <label for="text" class="block mb-2">Texto</label>
                <textarea id="text" v-model="text" class="w-full px-3 py-2 border rounded"></textarea>
            </div>

            <div>
                <button type="submit" class="mr-2 py-2 px-4 bg-blue-500 text-white rounded" :disabled="loading">Actualizar</button>
                <router-link to="/blog" class="py-2 px-4 bg-gray-500 text-white rounded">Cancelar</router-link>
            </div>
        </form>
    </div>
</template>