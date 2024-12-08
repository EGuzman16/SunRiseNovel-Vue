<script>
import { getPost, deletePost } from '../services/blog';

export default {
    data() {
        return {
            id: this.$route.params.id,
            title: '',
            date: '',
        };
    },
    async created() {
        const post = await getPost(this.id);
        this.title = post.title;
        this.date = post.date;
    },
    methods: {
        async deletePost() {
            await deletePost(this.id);

            // Redirige al usuario al blog después de borrar el post
            this.$router.push('/blog');
        },
    },
};
</script>

<template>
    <div class="container mx-auto px-4 text-center">
        <h1 class="text-2xl font-bold mb-4 text-violet-950">Borrar Publicación</h1>

        <p>¿Estás seguro de que deseas borrar la publicación "{{ title }}" del {{ date }}?</p>

        <div class="mt-4">
            <button @click="deletePost" class="mr-2 py-2 px-4 bg-red-500 text-white rounded">Aceptar</button>
            <router-link to="/blog" class="py-2 px-4 bg-gray-500 text-white rounded">Rechazar</router-link>
        </div>
    </div>
</template>